import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export interface Task {
    id: string
    project_id: string
    name: string
    description?: string
    estimated_hours?: number
    status: 'active' | 'completed' | 'archived'
    created_at: string
}

export function useTasks(projectId?: string) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchTasks = async (pId: string) => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('project_id', pId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error("Error fetching tasks:", error)
        } else {
            setTasks(data || [])
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (projectId) {
            fetchTasks(projectId)
        }
    }, [projectId])

    const createTask = async (task: Partial<Task>) => {
        const { data, error } = await supabase
            .from('tasks')
            .insert(task)
            .select()
            .single()

        if (error) {
            console.error("Error creating task:", error)
            return null
        }

        setTasks(prev => [data, ...prev])
        return data
    }

    const updateTaskStatus = async (taskId: string, status: Task['status']) => {
        const { error } = await supabase
            .from('tasks')
            .update({ status })
            .eq('id', taskId)

        if (error) {
            console.error("Error updating task status:", error)
            return false
        }

        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t))
        return true
    }

    const updateTask = async (taskId: string, updates: Partial<Task>) => {
        const { data, error } = await supabase
            .from('tasks')
            .update(updates)
            .eq('id', taskId)
            .select()
            .single()

        if (error) {
            console.error("Error updating task:", error)
            return null
        }

        setTasks(prev => prev.map(t => t.id === taskId ? data : t))
        return data
    }

    const deleteTask = async (taskId: string) => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId)

        if (error) {
            console.error("Error deleting task:", error)
            return false
        }

        setTasks(prev => prev.filter(t => t.id !== taskId))
        return true
    }

    return {
        tasks,
        isLoading,
        createTask,
        updateTaskStatus,
        updateTask,
        deleteTask,
        refreshTasks: () => projectId && fetchTasks(projectId)
    }
}
