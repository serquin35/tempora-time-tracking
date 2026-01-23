import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { ReportEntry } from "@/hooks/use-reports-data"

/**
 * Exporta los datos a formato CSV y descarga el archivo automáticamente.
 */
export const exportToCSV = (data: ReportEntry[], filename = "reporte-tiempo", isAdmin = false) => {
    // Definir cabeceras (incluir columnas financieras si es admin)
    const headers = isAdmin
        ? ["Fecha", "Usuario", "Proyecto", "Tarea", "Hora Inicio", "Hora Fin", "Total Horas", "Tarifa/Hora", "Ingresos", "Estado"]
        : ["Fecha", "Usuario", "Proyecto", "Tarea", "Hora Inicio", "Hora Fin", "Total Horas", "Estado"]

    // Mapear datos a filas
    const rows = data.map(entry => {
        const date = format(new Date(entry.clock_in), "dd/MM/yyyy", { locale: es })
        const startTime = format(new Date(entry.clock_in), "HH:mm", { locale: es })
        const endTime = entry.clock_out ? format(new Date(entry.clock_out), "HH:mm", { locale: es }) : "-"
        const hours = entry.total_hours ? entry.total_hours.toFixed(2) : "0.00"
        const hourlyRate = entry.project_hourly_rate ? entry.project_hourly_rate.toFixed(2) : "0.00"
        const revenue = entry.total_hours && entry.project_hourly_rate
            ? (entry.total_hours * entry.project_hourly_rate).toFixed(2)
            : "0.00"

        const baseRow = [
            date,
            entry.user_name,
            entry.project_name,
            entry.task_name,
            startTime,
            endTime,
            hours
        ]

        if (isAdmin) {
            return [...baseRow, hourlyRate, revenue, entry.status === 'completed' ? 'Completado' : 'En Progreso']
        }

        return [...baseRow, entry.status === 'completed' ? 'Completado' : 'En Progreso']
    })

    // Construir contenido CSV
    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    // Crear Blob y descargar
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}_${format(new Date(), "yyyyMMdd_HHmm")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

/**
 * Exporta los datos a formato PDF con un diseño profesional usando jsPDF-AutoTable.
 * Carga las librerías bajo demanda para optimizar el bundle inicial.
 */
export const exportToPDF = async (data: ReportEntry[], title = "Reporte de Horas", filename = "reporte-tiempo", isAdmin = false) => {
    // Lazy load libraries
    const { default: jsPDF } = await import("jspdf")
    const { default: autoTable } = await import("jspdf-autotable")

    const doc = new jsPDF()

    // Título del documento
    doc.setFontSize(18)
    doc.text(title, 14, 22)

    // Fecha de generación
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Generado el: ${format(new Date(), "dd 'de' MMMM yyyy, HH:mm", { locale: es })}`, 14, 28)

    // Calcular totales para el resumen
    const totalHours = data.reduce((acc, curr) => acc + (curr.total_hours || 0), 0)
    const totalRevenue = data.reduce((acc, curr) => {
        const hours = curr.total_hours || 0
        const rate = curr.project_hourly_rate || 0
        return acc + (hours * rate)
    }, 0)
    const uniqueProjects = Array.from(new Set(data.map(d => d.project_name))).length
    const uniqueUsers = Array.from(new Set(data.map(d => d.user_name))).length

    // Añadir resumen
    doc.setFontSize(12)
    doc.setTextColor(0)
    if (isAdmin) {
        doc.text(`Total Horas: ${totalHours.toFixed(2)}h  |  Total Ingresos: ${totalRevenue.toFixed(2)}€`, 14, 38)
        doc.text(`Proyectos: ${uniqueProjects}  |  Usuarios: ${uniqueUsers}`, 14, 44)
    } else {
        doc.text(`Total Horas: ${totalHours.toFixed(2)}h  |  Proyectos: ${uniqueProjects}  |  Usuarios: ${uniqueUsers}`, 14, 38)
    }

    // Definir columnas y filas para la tabla
    const tableColumn = isAdmin
        ? ["Fecha", "Usuario", "Proyecto", "Tarea", "Horas", "Tarifa", "Ingresos", "Estado"]
        : ["Fecha", "Usuario", "Proyecto", "Tarea", "Horas", "Estado"]

    const tableRows = data.map(entry => {
        const baseRow = [
            format(new Date(entry.clock_in), "dd/MM/yy", { locale: es }),
            entry.user_name,
            entry.project_name,
            entry.task_name,
            entry.total_hours ? entry.total_hours.toFixed(2) : "0.00"
        ]

        if (isAdmin) {
            const hourlyRate = entry.project_hourly_rate ? entry.project_hourly_rate.toFixed(2) + "€" : "0.00€"
            const revenue = entry.total_hours && entry.project_hourly_rate
                ? (entry.total_hours * entry.project_hourly_rate).toFixed(2) + "€"
                : "0.00€"
            return [...baseRow, hourlyRate, revenue, entry.status === 'completed' ? 'Completado' : 'Activo']
        }

        return [...baseRow, entry.status === 'completed' ? 'Completado' : 'Activo']
    })

    // Generar tabla
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: isAdmin ? 50 : 45,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [22, 163, 74], textColor: 255 }, // Color corporativo (ej. verde primary)
        alternateRowStyles: { fillColor: [240, 253, 244] },
    })

    // Descargar
    doc.save(`${filename}_${format(new Date(), "yyyyMMdd")}.pdf`)
}

/**
 * Genera una factura profesional en PDF con diseño corporativo
 */
export interface InvoiceData {
    invoiceNumber: string
    clientName: string
    clientAddress: string
    organizationName: string
    notes?: string
    data: ReportEntry[]
    taxRate?: number // Porcentaje (ej: 21)
    taxName?: string // Nombre (ej: "IVA")
}

export const exportInvoiceToPDF = async (invoiceData: InvoiceData) => {
    // Lazy load libraries
    const { default: jsPDF } = await import("jspdf")
    const { default: autoTable } = await import("jspdf-autotable")

    const doc = new jsPDF()
    const { invoiceNumber, clientName, clientAddress, organizationName, notes, data, taxRate = 21, taxName = "IVA" } = invoiceData

    // Colores corporativos (definidos como tuplas)
    const primaryColor: [number, number, number] = [16, 185, 129] // Emerald-500
    const darkGray: [number, number, number] = [39, 39, 42] // Zinc-800
    const lightGray: [number, number, number] = [161, 161, 170] // Zinc-400

    // Encabezado de la factura
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(0, 0, 210, 40, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('FACTURA', 14, 20)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(organizationName, 14, 28)

    // Número de factura y fecha (derecha)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`#${invoiceNumber}`, 196, 20, { align: 'right' })
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(format(new Date(), "dd 'de' MMMM yyyy", { locale: es }), 196, 28, { align: 'right' })

    // Información del cliente
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('FACTURAR A:', 14, 52)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(clientName, 14, 59)

    if (clientAddress) {
        doc.setFontSize(9)
        doc.setTextColor(lightGray[0], lightGray[1], lightGray[2])
        const addressLines = doc.splitTextToSize(clientAddress, 80)
        doc.text(addressLines, 14, 65)
    }

    // Calcular totales y agrupar por proyecto
    const projectSummary = data.reduce((acc, entry) => {
        const projectName = entry.project_name
        if (!acc[projectName]) {
            acc[projectName] = {
                hours: 0,
                rate: entry.project_hourly_rate || 0,
                amount: 0,
                tasks: []
            }
        }
        const hours = entry.total_hours || 0
        acc[projectName].hours += hours
        acc[projectName].amount += hours * (entry.project_hourly_rate || 0)
        if (entry.task_name && entry.task_name !== 'Sin Tarea') {
            acc[projectName].tasks.push({
                name: entry.task_name,
                hours: hours
            })
        }
        return acc
    }, {} as Record<string, { hours: number; rate: number; amount: number; tasks: Array<{ name: string; hours: number }> }>)

    // Tabla de servicios
    const tableData: any[][] = []
    Object.entries(projectSummary).forEach(([projectName, summary]) => {
        tableData.push([
            projectName,
            summary.hours.toFixed(2),
            `${summary.rate.toFixed(2)}€`,
            `${summary.amount.toFixed(2)}€`
        ])
    })

    autoTable(doc, {
        head: [['Descripción', 'Horas', 'Tarifa/Hora', 'Importe']],
        body: tableData,
        startY: 85,
        theme: 'striped',
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'left'
        },
        bodyStyles: {
            fontSize: 9,
            textColor: darkGray
        },
        columnStyles: {
            0: { cellWidth: 90 },
            1: { halign: 'center', cellWidth: 30 },
            2: { halign: 'right', cellWidth: 35 },
            3: { halign: 'right', cellWidth: 35, fontStyle: 'bold' }
        },
        alternateRowStyles: {
            fillColor: [250, 250, 250]
        }
    })

    // Obtener posición Y final de la tabla
    const finalY = (doc as any).lastAutoTable.finalY || 150

    // Totales
    const subtotal = Object.values(projectSummary).reduce((sum, p) => sum + p.amount, 0)
    const taxAmount = subtotal * (taxRate / 100)
    const total = subtotal + taxAmount

    const totalsX = 140
    let currentY = finalY + 15

    doc.setFontSize(10)
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
    doc.text('Subtotal:', totalsX, currentY)
    doc.text(`${subtotal.toFixed(2)}€`, 196, currentY, { align: 'right' })

    currentY += 7
    doc.text(`${taxName} (${taxRate}%):`, totalsX, currentY)
    doc.text(`${taxAmount.toFixed(2)}€`, 196, currentY, { align: 'right' })

    currentY += 10
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(totalsX - 5, currentY - 6, 61, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.text('TOTAL:', totalsX, currentY)
    doc.text(`${total.toFixed(2)}€`, 196, currentY, { align: 'right' })

    // Notas adicionales
    if (notes) {
        currentY += 20
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text('Notas:', 14, currentY)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(lightGray[0], lightGray[1], lightGray[2])
        const notesLines = doc.splitTextToSize(notes, 180)
        doc.text(notesLines, 14, currentY + 5)
    }

    // Pie de página
    doc.setFontSize(8)
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2])
    doc.text('Gracias por su confianza', 105, 280, { align: 'center' })

    // Descargar
    doc.save(`Factura_${invoiceNumber}_${format(new Date(), "yyyyMMdd")}.pdf`)
}
