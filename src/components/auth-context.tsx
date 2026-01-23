import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { User, Session } from "@supabase/supabase-js"
import type { Organization } from "@/types/organization"

type AuthContextType = {
    user: User | null
    session: Session | null
    organization: Organization | null
    userRole: 'owner' | 'admin' | 'member' | null
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    organization: null,
    userRole: null,
    loading: true,
    signOut: async () => { },
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [organization, setOrganization] = useState<Organization | null>(null)
    const [userRole, setUserRole] = useState<'owner' | 'admin' | 'member' | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchOrganization = async (userId: string) => {
        try {
            const { data: memberData } = await supabase
                .from('organization_members')
                .select('organization_id, role, organizations(*)')
                .eq('user_id', userId)

            if (memberData && memberData.length > 0) {
                // Priorizar la que no sea personal
                let active = memberData.find(m => (m.organizations as any).name !== "Personal Workspace")
                if (!active) active = memberData[0]

                setOrganization(active.organizations as any)
                setUserRole(active.role as any)
            } else {
                await createPersonalWorkspace(userId)
            }
        } catch (e) {
            console.error("Fetch org error", e)
        }
    }

    const createPersonalWorkspace = async (userId: string) => {
        try {
            const { data: newOrg, error: createError } = await supabase
                .from('organizations')
                .insert({
                    name: "Personal Workspace",
                    slug: `w-${userId.substring(0, 8)}-${Date.now()}`,
                    owner_id: userId
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

            setOrganization(newOrg as any)
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
            setLoading(false)
        })

        // 2. Escuchar cambios sin bloqueos
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchOrganization(session.user.id)
            } else {
                setOrganization(null)
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
        <AuthContext.Provider value={{ user, session, organization, userRole, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
