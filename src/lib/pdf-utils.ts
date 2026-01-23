import { format } from "date-fns"
import type { ReportEntry } from "@/hooks/use-reports-data"

export const generatePDF = async (data: ReportEntry[], orgName: string) => {
    // Lazy load libraries
    const { default: jsPDF } = await import("jspdf")
    const { default: autoTable } = await import("jspdf-autotable")

    const doc = new jsPDF()

    // Title
    doc.setFontSize(20)
    doc.text(`Reporte de Tiempo - ${orgName}`, 14, 22)

    // Subtitle
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Generado el: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 30)

    const tableData = data.map(entry => [
        entry.user_name,
        entry.project_name,
        format(new Date(entry.clock_in), "dd/MM/yyyy HH:mm"),
        entry.clock_out ? format(new Date(entry.clock_out), "dd/MM/yyyy HH:mm") : "Activo",
        entry.total_hours?.toFixed(2) || "0.00"
    ])

    autoTable(doc, {
        startY: 40,
        head: [['Usuario', 'Proyecto', 'Inicio', 'Fin', 'Horas']],
        body: tableData,
        headStyles: { fillColor: [59, 130, 246] }, // Blue-500
    })

    const totalHours = data.reduce((sum, e) => sum + (e.total_hours || 0), 0)

    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY + 10
    doc.setFontSize(12)
    doc.setTextColor(0)
    doc.text(`Total de Horas: ${totalHours.toFixed(2)}`, 14, finalY)

    doc.save(`reporte_${format(new Date(), "yyyy-MM-dd")}.pdf`)
}
