import { useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-context"
import { startOfDay, endOfDay } from "date-fns"

export interface ReportEntry {
    id: string
    user_id: string
    clock_in: string
    clock_out: string | null
    total_hours: number | null
    status: string
    description: string | null
    project_id: string | null
    task_id: string | null
    user_name: string
    user_avatar: string | null
    project_name: string
    project_color: string | null
    project_hourly_rate: number
    task_name: string
    estimated_hours: number | null
}

export interface ReportFilters {
    startDate: Date | undefined
    endDate: Date | undefined
    projectId: string | "all"
    userId: string | "all"
    taskId: string | "all"
}

export function useReportsData() {
    const { organization } = useAuth()
    const [data, setData] = useState<ReportEntry[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchReport = useCallback(async (filters: ReportFilters) => {
        if (!organization) return

        setIsLoading(true)
        try {
            let query = supabase
                .from('time_entries')
                .select(`
                    *,
                    projects(name, hourly_rate, color),
                    profiles(full_name, avatar_url),
                    tasks(name, estimated_hours)
                `)
                .eq('organization_id', organization.id)

            if (filters.startDate) {
                query = query.gte('clock_in', startOfDay(filters.startDate).toISOString())
            }
            if (filters.endDate) {
                query = query.lte('clock_in', endOfDay(filters.endDate).toISOString())
            }
            if (filters.projectId !== "all") {
                query = query.eq('project_id', filters.projectId)
            }
            if (filters.userId !== "all") {
                query = query.eq('user_id', filters.userId)
            }
            if (filters.taskId && filters.taskId !== "all") {
                query = query.eq('task_id', filters.taskId)
            }

            const { data: entries, error } = await query.order('clock_in', { ascending: false })

            if (error) throw error

            const formattedData: ReportEntry[] = (entries || []).map(entry => ({
                id: entry.id,
                user_id: entry.user_id,
                clock_in: entry.clock_in,
                clock_out: entry.clock_out,
                total_hours: entry.total_hours,
                status: entry.status,
                description: entry.description,
                project_id: entry.project_id,
                task_id: entry.task_id,
                user_name: (entry.profiles as any)?.full_name || "Desconocido",
                user_avatar: (entry.profiles as any)?.avatar_url || null,
                project_name: (entry.projects as any)?.name || "Sin Proyecto",
                project_color: (entry.projects as any)?.color || "#cbd5e1",
                project_hourly_rate: (entry.projects as any)?.hourly_rate || 0,
                task_name: (entry.tasks as any)?.name || "",
                estimated_hours: (entry.tasks as any)?.estimated_hours || null
            }))

            setData(formattedData)
        } catch (error) {
            console.error("Error fetching report data:", error)
            alert("Error al cargar los datos del reporte")
        } finally {
            setIsLoading(false)
        }
    }, [organization])

    return { data, isLoading, fetchReport }
}
