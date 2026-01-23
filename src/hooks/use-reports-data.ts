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
    project_id: string | null
    task_id: string | null
    user_name: string
    project_name: string
    project_hourly_rate: number
    task_name: string
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
                    projects(name, hourly_rate),
                    profiles(full_name),
                    tasks(name)
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
            if (filters.taskId !== "all") {
                query = query.eq('task_id', filters.taskId)
            }

            const { data: entries, error } = await query.order('clock_in', { ascending: false })

            if (error) throw error

            const formattedData: ReportEntry[] = (entries || []).map(entry => ({
                ...entry,
                user_name: (entry.profiles as any)?.full_name || "Desconocido",
                project_name: (entry.projects as any)?.name || "Sin Proyecto",
                project_hourly_rate: (entry.projects as any)?.hourly_rate || 0,
                task_name: (entry.tasks as any)?.name || "Sin Tarea"
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
