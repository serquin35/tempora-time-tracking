import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Link } from "react-router-dom"
import type { ReportEntry } from "@/hooks/use-reports-data"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ReportsTableProps {
    data: ReportEntry[]
}

export function ReportsTable({ data }: ReportsTableProps) {
    if (data.length === 0) {
        return (
            <div className="text-center py-10 border border-dashed rounded-xl bg-muted/20">
                <p className="text-muted-foreground">No hay registros para este periodo.</p>
            </div>
        )
    }

    return (
        <div className="rounded-md border bg-card shadow-sm overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Proyecto</TableHead>
                            <TableHead>Tarea / Descripción</TableHead>
                            <TableHead className="text-right">Duración</TableHead>
                            <TableHead className="text-right">Ingreso</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((entry) => (
                            <TableRow key={entry.id} className="hover:bg-muted/50">
                                {/* Fecha */}
                                <TableCell className="font-medium whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span>{format(new Date(entry.clock_in), "d MMM, yyyy", { locale: es })}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {format(new Date(entry.clock_in), "HH:mm")} -
                                            {entry.clock_out ? format(new Date(entry.clock_out), "HH:mm") : '...'}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Usuario */}
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={entry.user_avatar || ""} />
                                            <AvatarFallback className="text-[10px]">{entry.user_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm truncate max-w-[120px]" title={entry.user_name}>
                                            {entry.user_name}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Proyecto */}
                                <TableCell>
                                    {entry.project_id ? (
                                        <Link to={`/projects/${entry.project_id}`}>
                                            <Badge variant="outline" style={{ borderColor: entry.project_color || '#ccc', color: entry.project_color || '#ccc' }} className="bg-transparent hover:bg-muted cursor-pointer transition-colors">
                                                {entry.project_name}
                                            </Badge>
                                        </Link>
                                    ) : (
                                        <Badge variant="outline" className="bg-transparent text-muted-foreground border-muted-foreground">
                                            {entry.project_name}
                                        </Badge>
                                    )}
                                </TableCell>

                                {/* Tarea */}
                                <TableCell>
                                    <div className="flex flex-col max-w-[200px]">
                                        {entry.task_name && <span className="font-medium text-xs">{entry.task_name}</span>}
                                        <span className="text-xs text-muted-foreground truncate" title={entry.description || ""}>
                                            {entry.description || "Sin descripción"}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Duración */}
                                <TableCell className="text-right font-mono font-bold">
                                    {entry.total_hours?.toFixed(2)}h
                                </TableCell>

                                {/* Ingreso (si aplica) */}
                                <TableCell className="text-right font-mono text-muted-foreground text-xs">
                                    {entry.project_hourly_rate ?
                                        `${((entry.total_hours || 0) * entry.project_hourly_rate).toFixed(2)}€`
                                        : '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile View (Cards) */}
            <div className="md:hidden space-y-4 p-4">
                {data.map((entry) => (
                    <MobileReportEntry key={entry.id} entry={entry} />
                ))}
            </div>
        </div>
    )
}

function MobileReportEntry({ entry }: { entry: ReportEntry }) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div
            className={`bg-card border rounded-xl shadow-sm overflow-hidden transition-all duration-200 ${isExpanded ? 'ring-1 ring-primary/20' : ''}`}
        >
            {/* Header - Always Visible - Click to Toggle */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-4 flex justify-between items-center cursor-pointer active:bg-muted/50 transition-colors"
            >
                <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-sm">
                        {format(new Date(entry.clock_in), "d MMM, yyyy", { locale: es })}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                            {format(new Date(entry.clock_in), "HH:mm")} - {entry.clock_out ? format(new Date(entry.clock_out), "HH:mm") : '...'}
                        </span>
                        {entry.total_hours && (
                            <span className="font-mono font-medium text-primary bg-primary/10 px-1.5 rounded">
                                {entry.total_hours.toFixed(2)}h
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {entry.project_hourly_rate && (
                        <span className="text-xs font-mono font-medium text-muted-foreground">
                            {((entry.total_hours || 0) * entry.project_hourly_rate).toFixed(2)}€
                        </span>
                    )}
                    {isExpanded ?
                        <ChevronUp className="w-5 h-5 text-muted-foreground" /> :
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    }
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-4 pb-4 pt-0 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="h-px bg-border/50 w-full" />

                    {/* User & Project Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={entry.user_avatar || ""} />
                                <AvatarFallback className="text-[10px]">{entry.user_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                                {entry.user_name}
                            </span>
                        </div>

                        <div>
                            {entry.project_id ? (
                                <Link to={`/projects/${entry.project_id}`} onClick={(e) => e.stopPropagation()}>
                                    <Badge variant="outline" style={{ borderColor: entry.project_color || '#ccc', color: entry.project_color || '#ccc' }} className="bg-transparent text-[10px]">
                                        {entry.project_name}
                                    </Badge>
                                </Link>
                            ) : (
                                <span className="text-[10px] text-muted-foreground italic">Sin Proyecto</span>
                            )}
                        </div>
                    </div>

                    {/* Task & Description */}
                    <div className="bg-muted/30 rounded-lg p-3 space-y-1.5">
                        {entry.task_name && (
                            <div className="font-medium text-sm flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                {entry.task_name}
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {entry.description || <span className="italic opacity-50">Sin descripción</span>}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
