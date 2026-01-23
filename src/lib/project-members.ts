import { supabase } from "@/lib/supabase"

export async function assignUserToProject(projectId: string, userId: string, organizationId: string) {
    const { data, error } = await supabase
        .from('project_members')
        .insert({
            project_id: projectId,
            user_id: userId,
            organization_id: organizationId
        })
        .select()
        .single()

    if (error) {
        // Si el error es por duplicado, lo ignoramos
        if (error.code === '23505') {
            console.log("User already assigned to project")
            return { success: true, alreadyAssigned: true }
        }
        console.error("Error assigning user to project:", error)
        return { success: false, error }
    }

    return { success: true, data }
}

export async function removeUserFromProject(projectId: string, userId: string) {
    const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', userId)

    if (error) {
        console.error("Error removing user from project:", error)
        return false
    }

    return true
}

export async function getProjectMembers(projectId: string) {
    const { data, error } = await supabase
        .from('project_members')
        .select('user_id')
        .eq('project_id', projectId)

    if (error) {
        console.error("Error fetching project members:", error)
        return []
    }

    return data || []
}
