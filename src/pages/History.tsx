import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-context"
import { format, subDays, startOfDay } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Filter, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type TimeEntry = {
    id: string
    clock_in: string
    clock_out: string | null
    status: string
    total_hours: number | null
    project_id: string | null
    task_id: string | null
    projects?: { name: string }
    tasks?: { name: string }
}

type DateFilter = "7days" | "30days" | "90days" | "all"

export default function History() {
    const { user, organization } = useAuth()
    const [entries, setEntries] = useState<TimeEntry[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [dateFilter, setDateFilter] = useState<DateFilter>("30days")
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const ITEMS_PER_PAGE = 50

    const fetchEntries = async (resetPage = false) => {
        if (!user || !organization) return

        setIsLoading(true)
        const currentPage = resetPage ? 1 : page

        try {
            let query = supabase
                .from('time_entries')
                .select(`
                    *,
                    projects(name),
                    tasks(name)
                `, { count: 'exact' })
                .eq('user_id', user.id)
                .eq('organization_id', organization.id)
                .order('clock_in', { ascending: false })

            // Aplicar filtro de fecha
            if (dateFilter !== "all") {
                const days = dateFilter === "7days" ? 7 : dateFilter === "30days" ? 30 : 90
                const startDate = startOfDay(subDays(new Date(), days))
                query = query.gte('clock_in', startDate.toISOString())
            }

            // Paginación
            const from = (currentPage - 1) * ITEMS_PER_PAGE
            const to = from + ITEMS_PER_PAGE - 1
            query = query.range(from, to)

            const { data, error, count } = await query

            if (error) throw error

            if (data) {
                const formattedData = data.map(entry => ({
                    ...entry,
                    project_name: (entry.projects as any)?.name || "Sin Proyecto",
                    task_name: (entry.tasks as any)?.name || "Sin Tarea"
                }))

                if (resetPage) {
                    setEntries(formattedData)
                    setPage(1)
                } else {
                    setEntries(prev => currentPage === 1 ? formattedData : [...prev, ...formattedData])
                }

                // Verificar si hay más registros
                setHasMore(count ? (currentPage * ITEMS_PER_PAGE) < count : false)
            }
        } catch (error) {
            console.error("Error fetching entries:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchEntries(true)
    }, [user, organization, dateFilter])

    const loadMore = () => {
        setPage(prev => prev + 1)
        fetchEntries()
    }

    const getFilterLabel = () => {
        switch (dateFilter) {
            case "7days": return "Últimos 7 días"
            case "30days": return "Últimos 30 días"
            case "90days": return "Últimos 90 días"
            case "all": return "Todo el historial"
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Historial</h2>
                    <p className="text-muted-foreground">Revisa tu registro de actividad y tiempo trabajado.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={dateFilter} onValueChange={(value: DateFilter) => setDateFilter(value)}>
                        <SelectTrigger className="w-[180px] bg-card">
                            <Calendar className="w-4 h-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7days">Últimos 7 días</SelectItem>
                            <SelectItem value="30days">Últimos 30 días</SelectItem>
                            <SelectItem value="90days">Últimos 90 días</SelectItem>
                            <SelectItem value="all">Todo el historial</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => fetchEntries(true)}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Registro de Actividad
                    </CardTitle>
                    <CardDescription>
                        Mostrando {getFilterLabel().toLowerCase()} • {entries.length} registro{entries.length !== 1 ? 's' : ''}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px] w-full pr-4">
                        <div className="space-y-3">
                            {isLoading && entries.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                                    <p>Cargando registros...</p>
                                </div>
                            ) : entries.length > 0 ? (
                                <>
                                    {entries.map((entry) => (
                                        <div
                                            key={entry.id}
                                            className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-muted/50 transition-colors gap-3"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-semibold text-base">
                                                        {format(new Date(entry.clock_in), "EEEE, d 'de' MMMM", { locale: es })}
                                                    </span>
                                                    {entry.project_id && (
                                                        <Badge variant="outline" className="text-[10px]">
                                                            {(entry as any).project_name}
                                                        </Badge>
                                                    )}
                                                    {entry.task_id && (
                                                        <Badge variant="outline" className="text-[10px] border-lime-500/30 text-lime-600 dark:text-lime-500/80">
                                                            {(entry as any).task_name}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <span className="text-sm text-muted-foreground">
                                                    {format(new Date(entry.clock_in), "HH:mm", { locale: es })}
                                                    {entry.clock_out && ` - ${format(new Date(entry.clock_out), "HH:mm", { locale: es })}`}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <Badge
                                                    variant={entry.status === 'active' ? 'default' : 'secondary'}
                                                    className={entry.status === 'active' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20'}
                                                >
                                                    {entry.status === 'active' ? 'En Vivo' : 'Completado'}
                                                </Badge>
                                                <span className="font-mono font-bold text-lg text-lime-600 dark:text-lime-500">
                                                    {entry.total_hours ? `${entry.total_hours.toFixed(2)}h` : '--'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                    {hasMore && (
                                        <div className="flex justify-center pt-4">
                                            <Button
                                                variant="outline"
                                                onClick={loadMore}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                        Cargando...
                                                    </>
                                                ) : (
                                                    'Cargar más registros'
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                                        <Filter className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">No hay registros</h3>
                                    <p className="text-muted-foreground">
                                        No se encontraron registros para {getFilterLabel().toLowerCase()}.
                                    </p>
                                    {dateFilter !== "all" && (
                                        <Button
                                            variant="outline"
                                            className="mt-4"
                                            onClick={() => setDateFilter("all")}
                                        >
                                            Ver todo el historial
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
