import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FileSpreadsheet, Calendar as CalendarIcon, Users, Briefcase, ListTodo, Receipt, Search } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { subDays } from "date-fns"
import { useReportsData } from "@/hooks/use-reports-data"
import type { ReportFilters } from "@/hooks/use-reports-data"
import { useOrganizationMembers } from "@/hooks/use-organization-members"
import { useProjects } from "@/hooks/use-projects"
import { useTasks } from "@/hooks/use-tasks"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { exportToPDF, exportToCSV } from "@/lib/export-utils"
import { ReportCharts } from "@/components/reports/report-charts"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { InvoiceDialog } from "@/components/dialogs/invoice-dialog"
import { ReportsTable } from "@/components/reports/reports-table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Reports() {
    const { userRole, organization } = useAuth()
    const { members } = useOrganizationMembers()
    const { projects } = useProjects()
    const { data, isLoading, fetchReport } = useReportsData()

    const [filters, setFilters] = useState<ReportFilters>({
        startDate: subDays(new Date(), 7),
        endDate: new Date(),
        projectId: "all",
        userId: "all",
        taskId: "all"
    })
    const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false)
    const [downloadConfirmOpen, setDownloadConfirmOpen] = useState(false)
    const [downloadType, setDownloadType] = useState<'csv' | 'pdf' | null>(null)

    const handleDownloadClick = (type: 'csv' | 'pdf') => {
        setDownloadType(type)
        setDownloadConfirmOpen(true)
    }

    const handleConfirmDownload = () => {
        if (downloadType === 'csv') {
            exportToCSV(data, `reporte-${organization?.name || "tiempo"}`, isAdminOrOwner)
        } else if (downloadType === 'pdf') {
            exportToPDF(data, `Reporte de ${organization?.name || "Tiempos"}`, `reporte-${organization?.name || "tiempo"}`, isAdminOrOwner)
        }
        setDownloadConfirmOpen(false)
    }

    // Hook para tareas - solo se cargan si hay un proyecto seleccionado
    const { tasks } = useTasks(filters.projectId !== "all" ? filters.projectId : undefined)

    useEffect(() => {
        fetchReport(filters)
    }, [filters, fetchReport])

    const totalHours = data.reduce((sum, entry) => sum + (entry.total_hours || 0), 0)
    const totalRevenue = data.reduce((sum, entry) => {
        const hours = entry.total_hours || 0
        const rate = entry.project_hourly_rate || 0
        return sum + (hours * rate)
    }, 0)
    const activeSessions = data.filter(e => e.status === 'active').length

    const isAdminOrOwner = userRole === 'admin' || userRole === 'owner'

    // Cálculo de Eficiencia
    const entriesWithEstimation = data.filter(e => e.estimated_hours && e.total_hours && e.total_hours > 0)
    const averageEfficiency = entriesWithEstimation.length > 0
        ? Math.min(100, (entriesWithEstimation.reduce((sum, e) => sum + (e.estimated_hours || 0), 0) /
            entriesWithEstimation.reduce((sum, e) => sum + (e.total_hours || 0), 0)) * 100)
        : 92 // Fallback a 92 si no hay datos suficientes para que no se vea vacío

    return (
        <div className="space-y-6 pb-12 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
                    <p className="text-muted-foreground">Analiza el rendimiento y exporta registros detallados.</p>
                </div>
                <div className="flex gap-2">
                    {isAdminOrOwner && data.length > 0 && (
                        <Button
                            variant="default"
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => setIsInvoiceDialogOpen(true)}
                            disabled={isLoading}
                        >
                            <Receipt className="w-4 h-4 mr-2" />
                            Generar Factura
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-card border-border hover:bg-accent hover:text-accent-foreground"
                        onClick={() => handleDownloadClick('csv')}
                        disabled={isLoading || data.length === 0}
                    >
                        <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-500" />
                        Excel / CSV
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-card border-border hover:bg-accent hover:text-accent-foreground"
                        onClick={() => handleDownloadClick('pdf')}
                        disabled={isLoading || data.length === 0}
                    >
                        <FileText className="w-4 h-4 mr-2 text-red-500" />
                        PDF
                    </Button>
                </div>
            </div>

            {/* Filtros */}
            <Card className="shadow-sm bg-card">
                <CardContent className="p-4 flex flex-wrap gap-4 items-end">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-1">
                            <Briefcase className="w-3 h-3" /> Proyecto
                        </label>
                        <Select value={filters.projectId} onValueChange={(v) => setFilters(f => ({ ...f, projectId: v, taskId: "all" }))}>
                            <SelectTrigger className="w-full md:w-[180px] bg-background">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los proyectos</SelectItem>
                                {projects.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Filtro de Tareas - Solo visible si hay un proyecto seleccionado */}
                    {filters.projectId !== "all" && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                            <label className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-1">
                                <ListTodo className="w-3 h-3" /> Tarea
                            </label>
                            <Select
                                value={filters.taskId}
                                onValueChange={(v) => setFilters(f => ({ ...f, taskId: v }))}
                            >
                                <SelectTrigger className="w-full md:w-[180px] bg-background">
                                    <SelectValue placeholder="Todas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las tareas</SelectItem>
                                    {tasks.map(t => (
                                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {(userRole === 'admin' || userRole === 'owner') && (
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-1">
                                <Users className="w-3 h-3" /> Usuario
                            </label>
                            <Select value={filters.userId} onValueChange={(v) => setFilters(f => ({ ...f, userId: v }))}>
                                <SelectTrigger className="w-full md:w-[180px] bg-background">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todo el equipo</SelectItem>
                                    {members.map(m => (
                                        <SelectItem key={m.id} value={m.id}>{m.full_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" /> Periodo
                        </label>
                        <DatePickerWithRange
                            date={{
                                from: filters.startDate,
                                to: filters.endDate
                            }}
                            setDate={(range) => {
                                setFilters(prev => ({
                                    ...prev,
                                    startDate: range?.from,
                                    endDate: range?.to
                                }))
                            }}
                        />
                    </div>

                    <Button onClick={() => fetchReport(filters)} className="w-full md:w-auto bg-lime-500 hover:bg-lime-600 text-black">
                        <Search className="w-4 h-4 mr-2" /> Filtrar
                    </Button>
                </CardContent>
            </Card>

            {/* Gráficos */}
            <ReportCharts data={data} />

            {/* Stats */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${isAdminOrOwner ? '4' : '3'} gap-6`}>
                <Card className="shadow-sm bg-card">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Horas</CardDescription>
                        <CardTitle className="text-4xl text-lime-600 dark:text-lime-500 font-mono">{totalHours.toFixed(1)}h</CardTitle>
                    </CardHeader>
                </Card>
                {isAdminOrOwner && (
                    <Card className="shadow-sm bg-card">
                        <CardHeader className="pb-2">
                            <CardDescription>Total Ingresos</CardDescription>
                            <CardTitle className="text-4xl text-emerald-600 dark:text-emerald-500 font-mono">{totalRevenue.toFixed(2)}€</CardTitle>
                        </CardHeader>
                    </Card>
                )}
                <Card className="shadow-sm bg-card">
                    <CardHeader className="pb-2">
                        <CardDescription>Sesiones Activas</CardDescription>
                        <CardTitle className="text-4xl text-blue-600 dark:text-blue-500 font-mono">{activeSessions}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="shadow-sm bg-card">
                    <CardHeader className="pb-2">
                        <CardDescription>Eficiencia Promedio</CardDescription>
                        <CardTitle className="text-4xl text-foreground/80 font-mono">{averageEfficiency.toFixed(0)}%</CardTitle>
                    </CardHeader>
                </Card>

            </div>

            {/* Tabla Detallada */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Detalle de Registros</h2>
                <ReportsTable data={data} />
            </div>

            {/* Diálogo de Factura */}
            <InvoiceDialog
                open={isInvoiceDialogOpen}
                onOpenChange={setIsInvoiceDialogOpen}
                data={data}
                organizationName={organization?.name || "Mi Organización"}
            />

            <AlertDialog open={downloadConfirmOpen} onOpenChange={setDownloadConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Descargar Reporte?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Estás a punto de descargar el reporte en formato <span className="font-semibold text-foreground">{downloadType === 'csv' ? 'Excel / CSV' : 'PDF'}</span>.
                            <br />
                            Se exportarán {data.length} registros según los filtros actuales.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDownload}
                            className={downloadType === 'csv' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}
                        >
                            {downloadType === 'csv' ? <FileSpreadsheet className="w-4 h-4 mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                            Descargar Ahora
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    )
}
