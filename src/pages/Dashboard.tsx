"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { CurrentStatus } from "@/components/time-tracking/current-status"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, Zap, BarChart3, AlertCircle, Play, Flame, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-context"
import { useTimeTracking } from "@/hooks/use-time-tracking"
import { format, subDays, startOfDay, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine
} from "recharts"

export default function Dashboard() {
    const { user } = useAuth()
    const { activeEntry, elapsedTime, clockIn } = useTimeTracking()
    const [recentEntries, setRecentEntries] = useState<any[]>([])
    const [weeklyHistory, setWeeklyHistory] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadingEntryId, setLoadingEntryId] = useState<string | null>(null)

    const handleResume = async (entryId: string, projectId: string, taskId: string) => {
        setLoadingEntryId(entryId)
        try {
            await clockIn(projectId, taskId)
        } finally {
            setLoadingEntryId(null)
        }
    }

    // Handle intent from global command menu (just clean up URL for now, user is already here)
    const [searchParams, setSearchParams] = useSearchParams()
    useEffect(() => {
        if (searchParams.get("action") === "timer") {
            setSearchParams(params => {
                params.delete("action")
                return params
            })
        }
    }, [searchParams, setSearchParams])

    const fetchDashboardData = async () => {
        if (!user) return
        setIsLoading(true)

        const sevenDaysAgo = startOfDay(subDays(new Date(), 6))

        // Fetch both recent entries and history for the chart
        const { data, error } = await supabase
            .from('time_entries')
            .select('*, projects(name, color), tasks(name)')
            .eq('user_id', user.id)
            .order('clock_in', { ascending: false })
            .limit(10)

        if (error) {
            console.error("Error fetching dashboard data:", error)
        } else if (data) {
            setRecentEntries(data.filter(e => e.status === 'completed').slice(0, 5))
            setWeeklyHistory(data.filter(e => new Date(e.clock_in) >= sevenDaysAgo))
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchDashboardData()
    }, [user, activeEntry?.status]) // Re-fetch when session status changes (started/stopped)

    // Calculate chart data combining history and active session
    const chartData = useMemo(() => {
        const days = Array.from({ length: 7 }, (_, i) => {
            const date = subDays(new Date(), 6 - i)
            return {
                name: format(date, "EEE", { locale: es }),
                dateStr: format(date, "yyyy-MM-dd"),
                total: 0,
                fullDate: date
            }
        })

        // Add completed hours
        weeklyHistory.forEach(entry => {
            const entryDate = entry.clock_in.split('T')[0]
            const day = days.find(d => d.dateStr === entryDate)
            if (day) {
                day.total += entry.total_hours || 0
            }
        })

        // Add active session hours if it belongs to one of these days
        if (activeEntry && elapsedTime > 0) {
            const entryDate = activeEntry.clock_in.split('T')[0]
            const day = days.find(d => d.dateStr === entryDate)
            if (day) {
                day.total += elapsedTime / 3600
            }
        }

        return days.map(d => ({ ...d, total: Number(d.total.toFixed(2)) }))
    }, [weeklyHistory, activeEntry, elapsedTime])

    // Calculate Streak (días seguidos trabajando)
    const currentStreak = useMemo(() => {
        let streak = 0
        // Recorremos desde hoy hacia atrás
        for (let i = chartData.length - 1; i >= 0; i--) {
            if (chartData[i].total > 0) {
                streak++
            } else if (i === chartData.length - 1) {
                // Si hoy es 0, no rompemos la racha si ayer trabajamos (permitimos empezar el día)
                continue
            } else {
                break
            }
        }
        return streak
    }, [chartData])

    return (
        <div className="grid gap-6 animate-in fade-in duration-700">
            {/* Top Section: Active Timer */}
            <div className="w-full">
                <CurrentStatus />
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="shadow-sm bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Energía Diaria</CardTitle>
                        <div className="p-2 bg-lime-500/10 rounded-lg"><Zap className="h-4 w-4 text-lime-500" /></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {chartData[chartData.length - 1]?.total || 0} hrs
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Hoy</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nivel de Enfoque</CardTitle>
                        <div className="p-2 bg-violet-500/10 rounded-lg"><Activity className="h-4 w-4 text-violet-500" /></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeEntry?.status === 'active' ? 'Alto' : 'Reposando'}</div>
                        <p className="text-xs text-muted-foreground mt-1 text-violet-500 font-medium">
                            {activeEntry?.status === 'active' ? 'Trabajando ahora' : 'Sin sesión activa'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Racha</CardTitle>
                        <div className={`p-2 rounded-lg ${currentStreak > 2 ? 'bg-orange-500/10' : 'bg-muted'}`}>
                            <Flame className={`h-4 w-4 ${currentStreak > 2 ? 'text-orange-500 fill-orange-500' : 'text-muted-foreground'}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {currentStreak} días
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {currentStreak > 2 ? '¡Estás on fire! 🔥' : 'Mantén el ritmo'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content: Charts & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Weekly Activity Chart */}
                <Card className="lg:col-span-3 shadow-sm bg-card overflow-hidden">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-primary" />
                                    Actividad Semanal
                                </CardTitle>
                                <CardDescription>Tus horas de trabajo en los últimos 7 días</CardDescription>
                            </div>
                            {activeEntry && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-bold text-primary uppercase tracking-wider animate-pulse">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    Registrando...
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[250px] w-full px-2 min-w-0">
                            {isLoading ? (
                                <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-xl animate-pulse">
                                    <p className="text-sm text-muted-foreground">Cargando...</p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--card))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                            }}
                                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                                            labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold', marginBottom: '4px' }}
                                            cursor={{ fill: 'hsl(var(--primary))', opacity: 0.05 }}
                                            formatter={(value: number | undefined) => [value ? `${value} horas` : '0h', 'Esfuerzo']}
                                        />
                                        <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={isSameDay(entry.fullDate, new Date()) ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.3)'}
                                                />
                                            ))}
                                        </Bar>
                                        <ReferenceLine y={8} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" opacity={0.5} label={{ position: 'right', value: 'Meta 8h', fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity List */}
                <Card className="lg:col-span-2 shadow-sm bg-card">
                    <CardHeader>
                        <CardTitle>Registros Recientes</CardTitle>
                        <CardDescription>Tus últimas sesiones finalizadas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentEntries.length > 0 ? (
                                recentEntries.map((entry) => (
                                    <RecentActivityItem
                                        key={entry.id}
                                        entry={entry}
                                        onResume={() => handleResume(entry.id, entry.project_id, entry.task_id)}
                                        isLoading={loadingEntryId === entry.id}
                                        isActive={activeEntry?.id === entry.id}
                                        isAnyActive={!!activeEntry}
                                    />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center space-y-2 opacity-50">
                                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                                    <p className="text-sm">No hay sesiones recientes.<br />Finaliza tu sesión actual para verla aquí.</p>
                                </div>
                            )}

                            {activeEntry && (
                                <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl border-dashed relative animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-pulse">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm text-primary">Sesión en curso</span>
                                            <span className="text-xs text-muted-foreground">Registrando tiempo...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}

import { ChevronDown, ChevronUp } from "lucide-react"

function RecentActivityItem({ entry, onResume, isLoading, isActive, isAnyActive }: any) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div
            className={`bg-background/50 border rounded-xl overflow-hidden transition-all duration-200 ${isExpanded ? 'ring-1 ring-primary/20 shadow-md bg-card' : 'border-border/20 hover:bg-background/80'}`}
        >
            {/* Header - Always Visible */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-3 flex items-center justify-between cursor-pointer active:bg-muted/50"
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {/* Play Button - Stop Propagation to avoid accordion toggle */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onResume()
                        }}
                        disabled={isAnyActive || isLoading}
                        className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                        title="Reanudar esta tarea"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Play className="w-5 h-5 fill-current ml-0.5 group-hover/btn:scale-110 transition-transform" />
                        )}
                    </button>

                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm truncate">
                            {entry.projects?.name || "Sin Proyecto"}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="truncate max-w-[120px]">
                                {format(new Date(entry.clock_in), "d 'de' MMMM", { locale: es })}
                            </span>
                            {entry.total_hours && (
                                <span className="font-mono font-bold text-primary bg-primary/5 px-1.5 rounded">
                                    {entry.total_hours.toFixed(2)}h
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pl-2">
                    {isExpanded ?
                        <ChevronUp className="w-5 h-5 text-muted-foreground/70" /> :
                        <ChevronDown className="w-5 h-5 text-muted-foreground/70" />
                    }
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-3 pb-3 pt-0 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="h-px bg-border/40 w-full" />

                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="space-y-1">
                            <span className="text-muted-foreground/70 uppercase tracking-wider text-[10px] font-bold">Tarea</span>
                            <div className="font-medium flex items-center gap-1.5 break-words">
                                {entry.projects?.color && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.projects.color }} />}
                                {entry.tasks?.name || "Sin tarea específica"}
                            </div>
                        </div>
                        <div className="space-y-1 text-right">
                            <span className="text-muted-foreground/70 uppercase tracking-wider text-[10px] font-bold">Horario</span>
                            <div className="font-mono text-muted-foreground">
                                {format(new Date(entry.clock_in), "HH:mm")} - {entry.clock_out ? format(new Date(entry.clock_out), "HH:mm") : '...'}
                            </div>
                        </div>
                    </div>

                    {/* Finalizado label only visible when expanded for context */}
                    <div className="flex justify-end">
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium">
                            Sesión Finalizada
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}
