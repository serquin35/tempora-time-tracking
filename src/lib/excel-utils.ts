import * as XLSX from "xlsx"
import { format } from "date-fns"
import type { ReportEntry } from "@/hooks/use-reports-data"

export const generateExcel = (data: ReportEntry[], orgName: string) => {
    const worksheetData = data.map(entry => ({
        "Usuario": entry.user_name,
        "Proyecto": entry.project_name,
        "Inicio": format(new Date(entry.clock_in), "dd/MM/yyyy HH:mm"),
        "Fin": entry.clock_out ? format(new Date(entry.clock_out), "dd/MM/yyyy HH:mm") : "Activo",
        "Horas": entry.total_hours || 0,
        "Estado": entry.status
    }))

    const worksheet = XLSX.utils.json_to_sheet(worksheetData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registros")

    const filename = `reporte_${orgName.replace(/\s+/g, '_')}_${format(new Date(), "yyyy-MM-dd")}.xlsx`
    XLSX.writeFile(workbook, filename)
}
