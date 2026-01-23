import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-context"
import type { Project } from "@/types/project"

export interface ProjectWithStats extends Project {
    stats: {
        totalTasks: number
        completedTasks: number
        progress: number
        totalEstimatedHours: number
    }
}

export function useProjects() {
    const { organization, user, userRole } = useAuth()
    const [projects, setProjects] = useState<ProjectWithStats[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!organization || !user) {
            setProjects([])
            setIsLoading(false)
            return
        }

        const fetchProjects = async () => {
            setIsLoading(true)

            try {
                // Admins y Owners ven todos los proyectos
                if (userRole === 'admin' || userRole === 'owner') {
                    const { data, error } = await supabase
                        .from('projects')
                        .select('*, tasks(id, status, estimated_hours)')
                        .eq('organization_id', organization.id)
                        .eq('status', 'active')
                        .order('name', { ascending: true })

                    if (error) throw error

                    if (data) {
                        const projectsWithStats = data.map((p: any) => {
                            const tasks = p.tasks || []
                            const totalTasks = tasks.length
                            const completedTasks = tasks.filter((t: any) => t.status === 'completed').length
                            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
                            const totalEstimatedHours = tasks.reduce((acc: number, t: any) => acc + (t.estimated_hours || 0), 0)

                            const { tasks: _, ...projectData } = p

                            return {
                                ...projectData,
                                stats: {
                                    totalTasks,
                                    completedTasks,
                                    progress,
                                    totalEstimatedHours
                                }
                            }
                        })
                        setProjects(projectsWithStats)
                    }
                } else {
                    // Empleados solo ven proyectos donde están asignados
                    const { data, error } = await supabase
                        .from('project_members')
                        .select(`
                            project_id,
                            projects!inner(
                                *,
                                tasks(id, status, estimated_hours)
                            )
                        `)
                        .eq('user_id', user.id)
                        .eq('organization_id', organization.id)
                        .eq('projects.status', 'active')

                    if (error) throw error

                    // Si el empleado tiene proyectos asignados, mostrar solo esos
                    if (data && data.length > 0) {
                        const projectsWithStats = data.map((pm: any) => {
                            const p = pm.projects
                            const tasks = p.tasks || []
                            const totalTasks = tasks.length
                            const completedTasks = tasks.filter((t: any) => t.status === 'completed').length
                            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
                            const totalEstimatedHours = tasks.reduce((acc: number, t: any) => acc + (t.estimated_hours || 0), 0)

                            const { tasks: _, ...projectData } = p

                            return {
                                ...projectData,
                                stats: {
                                    totalTasks,
                                    completedTasks,
                                    progress,
                                    totalEstimatedHours
                                }
                            }
                        })
                        setProjects(projectsWithStats)
                    } else {
                        // FALLBACK: Si no tiene asignaciones, mostrar todos los proyectos
                        // (temporal hasta que se configuren las asignaciones)
                        console.warn("Employee has no assigned projects, showing all projects as fallback")
                        const { data: allProjects, error: allError } = await supabase
                            .from('projects')
                            .select('*, tasks(id, status, estimated_hours)')
                            .eq('organization_id', organization.id)
                            .eq('status', 'active')
                            .order('name', { ascending: true })

                        if (allError) throw allError

                        if (allProjects) {
                            const projectsWithStats = allProjects.map((p: any) => {
                                const tasks = p.tasks || []
                                const totalTasks = tasks.length
                                const completedTasks = tasks.filter((t: any) => t.status === 'completed').length
                                const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
                                const totalEstimatedHours = tasks.reduce((acc: number, t: any) => acc + (t.estimated_hours || 0), 0)

                                const { tasks: _, ...projectData } = p

                                return {
                                    ...projectData,
                                    stats: {
                                        totalTasks,
                                        completedTasks,
                                        progress,
                                        totalEstimatedHours
                                    }
                                }
                            })
                            setProjects(projectsWithStats)
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching projects:", error)
                setProjects([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchProjects()
    }, [organization, user, userRole])

    const createProject = async (name: string, color: string = '#3b82f6', hourlyRate: number = 0) => {
        if (!organization) return null

        const { data, error } = await supabase
            .from('projects')
            .insert({
                organization_id: organization.id,
                name,
                color,
                hourly_rate: hourlyRate,
                status: 'active'
            })
            .select()
            .single()

        if (error) {
            console.error("Error creating project:", error)
            alert(`Error al crear proyecto: ${error.message}`)
            return null
        }

        const newProject: ProjectWithStats = {
            ...(data as Project),
            stats: {
                totalTasks: 0,
                completedTasks: 0,
                progress: 0,
                totalEstimatedHours: 0
            }
        }

        setProjects(prev => [...prev, newProject])
        return newProject
    }

    const deleteProject = async (projectId: string) => {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId)

        if (error) {
            console.error("Error deleting project:", error)
            return false
        }

        setProjects(prev => prev.filter(p => p.id !== projectId))
        return true
    }

    return { projects, isLoading, createProject, deleteProject }
}
