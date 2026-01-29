import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { User, Session } from "@supabase/supabase-js"
import type { Organization } from "@/types/organization"

type AuthContextType = {
    user: User | null
    session: Session | null
    organization: Organization | null
    organizations: Organization[]
    switchOrganization: (orgId: string) => void
    userRole: 'owner' | 'admin' | 'member' | null
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    organization: null,
    organizations: [],
    switchOrganization: () => { },
    userRole: null,
    loading: true,
    signOut: async () => { },
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [organization, setOrganization] = useState<Organization | null>(null)
    const [organizations, setOrganizations] = useState<Organization[]>([])
    const [userRole, setUserRole] = useState<'owner' | 'admin' | 'member' | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchOrganization = async (userId: string) => {
        try {
            const { data: memberData } = await supabase
                .from('organization_members')
                .select('organization_id, role, organizations(*)')
                .eq('user_id', userId)

            if (memberData && memberData.length > 0) {
                const orgs = memberData.map(m => m.organizations as unknown as Organization)
                setOrganizations(orgs)

                // 1. Try to restore last active session
                const lastOrgId = localStorage.getItem(`last_org_${userId}`)
                let activeMember = memberData.find(m => m.organization_id === lastOrgId)

                // 2. Fallback: Prefer business over personal
                if (!activeMember) {
                    activeMember = memberData.find(m => (m.organizations as unknown as Organization).type === 'business')
                }

                // 3. Fallback: Use the first one (usually personal if no business)
                if (!activeMember) {
                    activeMember = memberData[0]
                }

                setOrganization(activeMember.organizations as unknown as Organization)
                setUserRole(activeMember.role as any)
            } else {
                await createPersonalWorkspace(userId)
            }
        } catch (e) {
            console.error("Fetch org error", e)
        }
    }

    const switchOrganization = async (orgId: string) => {
        if (!user) return

        const targetOrg = organizations.find(o => o.id === orgId)
        if (targetOrg) {
            // We need to fetch the role for this specific org
            // Since we have the data in fetchOrganization, we could store it better, 
            // but for now let's just re-fetch or assume we need to get the role from the member list if we kept it.
            // A simpler way is to just call fetchOrganization again but that might be overkill. 
            // Better: Store memberData in state or just fetch the role here.

            // Optimization: We could store the map of orgId -> role. 
            // For now, let's just fast-switch the org object and fetch the role in background or re-query.
            // Actually, we should probably query the member role for this org to be safe and accurate.

            setOrganization(targetOrg)
            localStorage.setItem(`last_org_${user.id}`, orgId)

            const { data } = await supabase
                .from('organization_members')
                .select('role')
                .eq('organization_id', orgId)
                .eq('user_id', user.id)
                .maybeSingle()

            if (data) {
                setUserRole(data.role as any)
            }
        }
    }

    const createPersonalWorkspace = async (userId: string) => {
        try {
            const { data: newOrg, error: createError } = await supabase
                .from('organizations')
                .insert({
                    name: "Personal Workspace",
                    slug: `w-${userId.substring(0, 8)}-${Date.now()}`,
                    owner_id: userId,
                    type: 'personal'
                })
                .select()
                .single()

            if (createError) throw createError

            await supabase
                .from('organization_members')
                .insert({
                    organization_id: newOrg.id,
                    user_id: userId,
                    role: 'owner'
                })

            const newOrgTyped = newOrg as Organization
            setOrganizations([newOrgTyped])
            setOrganization(newOrgTyped)
            setUserRole('owner')
        } catch (e) {
            console.error("Error creating personal workspace:", e)
        }
    }

    useEffect(() => {
        // 1. Carga inicial rápida
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) fetchOrganization(session.user.id)
            else setLoading(false)
        })

        // 2. Escuchar cambios sin bloqueos
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                // If the user changed, fetch their orgs
                // Note: onAuthStateChange fires often, we might want to debounce or check if user ID actually changed
                // checking organization state might be null initially
                fetchOrganization(session.user.id)
            } else {
                setOrganization(null)
                setOrganizations([])
                setUserRole(null)
            }
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signOut = async () => {
        // 1. Limpieza local inmediata e incondicional
        localStorage.removeItem('sb-hfbguegpdgdicnmcooom-auth-token')
        localStorage.clear() // Limpieza profunda por seguridad

        setOrganization(null)
        setOrganizations([])
        setUserRole(null)
        setSession(null)
        setUser(null)

        // 2. Redirección instantánea (Usuario percibe velocidad máxima)
        window.location.href = "/"

        // 3. Intentar notificar a Supabase en 'fire-and-forget' (si falla o tarda, no nos importa)
        try {
            await supabase.auth.signOut()
        } catch (error) {
            console.error("Error silencioso en signOut de servidor:", error)
        }
    }

    return (
        <AuthContext.Provider value={{ user, session, organization, organizations, switchOrganization, userRole, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
