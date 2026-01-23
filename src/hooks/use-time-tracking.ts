import { useState, useEffect, useCallback, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-context"
import { differenceInSeconds } from "date-fns"

export type TimeEntryStatus = "active" | "paused" | "completed"

export interface TimeEntry {
    id: string
    user_id: string
    organization_id: string
    project_id?: string
    task_id?: string
    clock_in: string
    clock_out: string | null
    status: TimeEntryStatus
    total_hours: number | null
    notes?: string
}

export function useTimeTracking() {
    const { user, organization } = useAuth()
    const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [elapsedTime, setElapsedTime] = useState(0)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const fetchActiveEntry = useCallback(async () => {
        if (!user) return

        setIsLoading(true)
        const { data, error } = await supabase
            .from("time_entries")
            .select("*")
            .eq("user_id", user.id)
            .in("status", ["active", "paused"])
            .single()

        if (error && error.code !== "PGRST116") {
            console.error("Error fetching active entry:", error)
        }

        if (data) {
            setActiveEntry(data)
            calculateElapsedTime(data)
        } else {
            setActiveEntry(null)
            setElapsedTime(0)
        }
        setIsLoading(false)
    }, [user])

    const calculateElapsedTime = (entry: TimeEntry) => {
        if (entry.status === "paused") {
            const start = new Date(entry.clock_in)
            const now = new Date()
            setElapsedTime(differenceInSeconds(now, start))
            return
        }

        const start = new Date(entry.clock_in)
        const now = new Date()
        setElapsedTime(differenceInSeconds(now, start))
    }

    useEffect(() => {
        fetchActiveEntry()
    }, [fetchActiveEntry])

    useEffect(() => {
        if (activeEntry?.status === "active") {
            intervalRef.current = setInterval(() => {
                calculateElapsedTime(activeEntry)
            }, 1000)
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [activeEntry])

    const clockIn = async (projectId?: string, taskId?: string) => {
        if (!user || !organization) {
            console.error("Cannot clock in: Missing user or organization context")
            return
        }

        const now = new Date().toISOString()
        const { data, error } = await supabase
            .from("time_entries")
            .insert({
                user_id: user.id,
                organization_id: organization.id,
                project_id: projectId || null,
                task_id: taskId || null,
                clock_in: now,
                date: now.split("T")[0],
                status: "active",
            })
            .select()
            .single()

        if (error) {
            console.error("Error clocking in:", error)
            return
        }

        setActiveEntry(data)
    }

    const clockOut = async () => {
        if (!activeEntry) return

        const now = new Date().toISOString()
        const start = new Date(activeEntry.clock_in)
        const end = new Date(now)
        const totalHours = differenceInSeconds(end, start) / 3600

        const { error } = await supabase
            .from("time_entries")
            .update({
                clock_out: now,
                status: "completed",
                total_hours: Number(totalHours.toFixed(2)),
            })
            .eq("id", activeEntry.id)

        if (error) {
            console.error("Error clocking out:", error)
            return
        }

        setActiveEntry(null)
        setElapsedTime(0)
    }

    const togglePause = async () => {
        if (!activeEntry) return

        const newStatus = activeEntry.status === "active" ? "paused" : "active"

        if (newStatus === "paused") {
            await supabase.from("pauses").insert({
                time_entry_id: activeEntry.id,
                start_time: new Date().toISOString(),
                type: "break"
            })
        }

        const { data, error } = await supabase
            .from("time_entries")
            .update({ status: newStatus })
            .eq("id", activeEntry.id)
            .select()
            .single()

        if (error) console.error("Error toggling pause:", error)
        if (data) setActiveEntry(data)
    }

    return {
        activeEntry,
        isLoading,
        elapsedTime,
        clockIn,
        clockOut,
        togglePause,
    }
}
