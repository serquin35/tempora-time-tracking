import { useState, useEffect, useCallback, useRef, createContext, useContext, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-context"
import { differenceInSeconds, differenceInHours } from "date-fns"
import { ZombieTimerRecoveryDialog } from "@/components/dialogs/zombie-timer-recovery-dialog"
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

// Internal hook implementation (not exported directly)
function useTimeTrackingInternal() {
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
            // Immediate calculation
            calculateElapsedTime(activeEntry)

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

    // Background sync handler
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && activeEntry) {
                calculateElapsedTime(activeEntry)
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [activeEntry])

    const clockIn = async (projectId?: string, taskId?: string) => {
        if (!user || !organization) {
            console.error("Cannot clock in: Missing user or organization context")
            return
        }

        // 1. Si ya tenemos una activeEntry en estado local, ciérrala primero
        if (activeEntry) {
            console.log("Auto-closing active session before starting new one...")
            await clockOut()
        }

        // 2. Red de seguridad: Verificar en DB si hay alguna sesión colgada (por si el estado local falló)
        // Esto previene que se queden sesiones "zombies" activas en otros dispositivos o pestañas
        const { data: zombieEntries } = await supabase
            .from("time_entries")
            .select("id, clock_in")
            .eq("user_id", user.id)
            .in("status", ["active", "paused"])

        if (zombieEntries && zombieEntries.length > 0) {
            console.log("Cleaning up zombie sessions...", zombieEntries)
            const now = new Date().toISOString()

            // Cerramos todas las sesiones abiertas
            for (const zombie of zombieEntries) {
                const start = new Date(zombie.clock_in)
                const totalHours = differenceInSeconds(new Date(), start) / 3600

                await supabase
                    .from("time_entries")
                    .update({
                        clock_out: now,
                        status: "completed",
                        total_hours: Number(totalHours.toFixed(2)),
                    })
                    .eq("id", zombie.id)
            }
        }

        // 3. Ahora es seguro iniciar la nueva sesión
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
        refetch: fetchActiveEntry,
    }
}

// Context type
type TimeTrackingContextType = ReturnType<typeof useTimeTrackingInternal>

// Create context with null default
const TimeTrackingContext = createContext<TimeTrackingContextType | null>(null)

// Provider component
export function TimeTrackingProvider({ children }: { children: ReactNode }) {
    const value = useTimeTrackingInternal()
    return (
        <TimeTrackingContext.Provider value={value} >
            {children}
        </TimeTrackingContext.Provider>
    )
}

// Public hook that consumes the context
export function useTimeTracking(): TimeTrackingContextType {
    const context = useContext(TimeTrackingContext)
    if (!context) {
        throw new Error("useTimeTracking must be used within a TimeTrackingProvider")
    }
    return context
}
