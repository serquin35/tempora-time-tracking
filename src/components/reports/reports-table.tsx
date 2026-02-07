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
            <div className="overflow-x-auto">
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
        </div>
    )
}
