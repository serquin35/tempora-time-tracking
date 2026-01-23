import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-context"

export interface Notification {
    id: string
    title: string
    message: string
    type: 'info' | 'warning' | 'success' | 'alert'
    is_read: boolean
    link?: string
    created_at: string
}

export function useNotifications() {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(true)

    const fetchNotifications = async () => {
        if (!user) return

        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(20)

        if (error) {
            console.error("Error fetching notifications:", error)
        } else {
            setNotifications(data || [])
            setUnreadCount(data?.filter(n => !n.is_read).length || 0)
        }
        setLoading(false)
    }

    const markAsRead = async (id: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, is_read: true } : n
        ))
        setUnreadCount(prev => Math.max(0, prev - 1))

        await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("id", id)
    }

    const markAllAsRead = async () => {
        if (unreadCount === 0) return

        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        setUnreadCount(0)

        await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("user_id", user?.id)
            .eq("is_read", false)
    }

    useEffect(() => {
        fetchNotifications()

        // Realtime subscription
        const channel = supabase
            .channel('notifications_changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user?.id}`
                },
                (payload) => {
                    const newNotification = payload.new as Notification
                    setNotifications(prev => [newNotification, ...prev])
                    setUnreadCount(prev => prev + 1)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user])

    const clearRead = async () => {
        // Optimistic update
        setNotifications(prev => prev.filter(n => !n.is_read))

        await supabase
            .from("notifications")
            .delete()
            .eq("user_id", user?.id)
            .eq("is_read", true)
    }

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        clearRead,
        refresh: fetchNotifications
    }
}
