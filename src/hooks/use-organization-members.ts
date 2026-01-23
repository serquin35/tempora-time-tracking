import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-context"

interface MemberProfile {
    id: string
    full_name: string
    role: string
}

export function useOrganizationMembers() {
    const { organization } = useAuth()
    const [members, setMembers] = useState<MemberProfile[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!organization) {
            setMembers([])
            setIsLoading(false)
            return
        }

        const fetchMembers = async () => {
            setIsLoading(true)

            // First get members
            const { data: memberData, error: memberError } = await supabase
                .from('organization_members')
                .select('user_id, role')
                .eq('organization_id', organization.id)

            if (memberError) {
                console.error("Error fetching organization members:", memberError)
                setIsLoading(false)
                return
            }

            if (memberData) {
                const userIds = memberData.map(m => m.user_id)

                // Then get profiles
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('id, full_name')
                    .in('id', userIds)

                if (profileError) {
                    console.error("Error fetching profiles:", profileError)
                } else {
                    const mergedMembers = memberData.map(m => {
                        const profile = profileData.find(p => p.id === m.user_id)
                        return {
                            id: m.user_id,
                            full_name: profile?.full_name || "Usuario Desconocido",
                            role: m.role
                        }
                    })
                    setMembers(mergedMembers)
                }
            }
            setIsLoading(false)
        }

        fetchMembers()
    }, [organization])

    const updateMemberRole = async (userId: string, newRole: 'admin' | 'member') => {
        if (!organization) return

        const { error } = await supabase
            .from('organization_members')
            .update({ role: newRole })
            .eq('organization_id', organization.id)
            .eq('user_id', userId)

        if (error) {
            console.error("Error updating role:", error)
            alert("Error al actualizar el rol")
            return false
        }

        setMembers(prev => prev.map(m => m.id === userId ? { ...m, role: newRole } : m))
        return true
    }

    const removeMember = async (userId: string) => {
        if (!organization) return

        const { error } = await supabase
            .from('organization_members')
            .delete()
            .eq('organization_id', organization.id)
            .eq('user_id', userId)

        if (error) {
            console.error("Error removing member:", error)
            alert("Error al eliminar miembro")
            return false
        }

        setMembers(prev => prev.filter(m => m.id !== userId))
        return true
    }

    return { members, isLoading, updateMemberRole, removeMember }
}
