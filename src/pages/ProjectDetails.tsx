import { useParams, Link } from "react-router-dom"
import { useProjectDetails } from "@/hooks/use-project-details"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, DollarSign, Briefcase } from "lucide-react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectDetails() {
    const { id } = useParams()
    const { project, isLoading, error } = useProjectDetails(id)

    if (isLoading) {
        return <ProjectSkeleton />
    }

    if (error || !project) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <p className="text-xl text-muted-foreground">No se encontró el proyecto</p>
                <Button variant="outline" asChild>
                    <Link to="/reports">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link to="/reports">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                            <Badge style={{ backgroundColor: project.color }} className="text-white hover:opacity-90">
                                {project.status === 'active' ? 'Activo' : 'Archivado'}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                            <Briefcase className="h-3 w-3" /> ID: {project.id.slice(0, 8)}...
                        </p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Horas Totales</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{project.total_hours.toFixed(2)}h</div>
                        <p className="text-xs text-muted-foreground">Registradas en este proyecto</p>
                    </CardContent>
                </Card>
                <Card className="bg-card shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Generados</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">{project.total_revenue.toFixed(2)}€</div>
                        <p className="text-xs text-muted-foreground">Basado en tarifa horaria</p>
                    </CardContent>
                </Card>
                <Card className="bg-card shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tarifa</CardTitle>
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: project.color }} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{project.hourly_rate}€ / h</div>
                        <p className="text-xs text-muted-foreground">Coste por hora configurado</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts & Tasks Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Chart */}
                <Card className="lg:col-span-2 shadow-sm bg-card border-none">
                    <CardHeader>
                        <CardTitle>Actividad del Proyecto</CardTitle>
                        <CardDescription>Horas trabajadas por día</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                            <AreaChart data={project.activity_chart}>
                                <defs>
                                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={project.color} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={project.color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })}
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    hide
                                />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="hours"
                                    stroke={project.color}
                                    fillOpacity={1}
                                    fill="url(#colorHours)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Tasks List */}
                <Card className="shadow-sm bg-card border-none h-fit">
                    <CardHeader>
                        <CardTitle>Desglose por Tarea</CardTitle>
                        <CardDescription>Dónde se invirtió el tiempo</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {project.task_stats.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">No hay tareas con tiempo registrado.</p>
                        ) : (
                            project.task_stats.map(task => (
                                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm">{task.name}</p>
                                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal">
                                            {task.status}
                                        </Badge>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold font-mono">{task.total_hours.toFixed(1)}h</p>
                                        <div className="w-16 h-1 bg-muted rounded-full mt-1 overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${Math.min((task.total_hours / project.total_hours) * 100, 100)}%`,
                                                    backgroundColor: project.color
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function ProjectSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="flex gap-4 items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Skeleton className="h-[400px] lg:col-span-2 rounded-xl" />
                <Skeleton className="h-[400px] rounded-xl" />
            </div>
        </div>
    )
}
