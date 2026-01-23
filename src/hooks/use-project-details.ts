import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Project } from "@/types/project"

export interface TaskStats {
    id: string
    name: string
    status: string
    total_hours: number
}

export interface ProjectDetailsData extends Project {
    total_hours: number
    total_revenue: number
    task_stats: TaskStats[]
    activity_chart: { date: string; hours: number }[]
}

export function useProjectDetails(projectId: string | undefined) {
    const [project, setProject] = useState<ProjectDetailsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!projectId) return

        const fetchProjectDetails = async () => {
            setIsLoading(true)
            try {
                // 1. Fetch Project Info + Tasks
                const { data: projectData, error: projectError } = await supabase
                    .from('projects')
                    .select('*, tasks(*)')
                    .eq('id', projectId)
                    .single()

                if (projectError) throw projectError

                // 2. Fetch Time Entries for this project
                const { data: timeParams, error: timeError } = await supabase
                    .from('time_entries')
                    .select('total_hours, clock_in, task_id')
                    .eq('project_id', projectId)

                if (timeError) throw timeError

                // 3. Process Stats
                const entries = timeParams || []
                const totalHours = entries.reduce((sum, e) => sum + (e.total_hours || 0), 0)
                const totalRevenue = totalHours * (projectData.hourly_rate || 0)

                // Task Breakdown
                const taskMap = new Map<string, number>()
                entries.forEach(e => {
                    if (e.task_id) {
                        taskMap.set(e.task_id, (taskMap.get(e.task_id) || 0) + (e.total_hours || 0))
                    }
                })

                const taskStats: TaskStats[] = projectData.tasks.map((t: any) => ({
                    id: t.id,
                    name: t.name,
                    status: t.status,
                    total_hours: taskMap.get(t.id) || 0
                })).sort((a: TaskStats, b: TaskStats) => b.total_hours - a.total_hours)

                // Activity Chart (Last 14 days)
                const chartMap = new Map<string, number>()
                entries.forEach(e => {
                    const date = e.clock_in.split('T')[0]
                    chartMap.set(date, (chartMap.get(date) || 0) + (e.total_hours || 0))
                })

                const activityChart = Array.from(chartMap.entries())
                    .map(([date, hours]) => ({ date, hours }))
                    .sort((a, b) => a.date.localeCompare(b.date))

                setProject({
                    ...projectData,
                    total_hours: totalHours,
                    total_revenue: totalRevenue,
                    task_stats: taskStats,
                    activity_chart: activityChart
                })

            } catch (err: any) {
                console.error("Error loading project details:", err)
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProjectDetails()
    }, [projectId])

    return { project, isLoading, error }
}
