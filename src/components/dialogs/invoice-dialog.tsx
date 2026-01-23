import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Download } from "lucide-react"
import type { ReportEntry } from "@/hooks/use-reports-data"
import { exportInvoiceToPDF } from "@/lib/export-utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface InvoiceDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: ReportEntry[]
    organizationName: string
}

export function InvoiceDialog({ open, onOpenChange, data, organizationName }: InvoiceDialogProps) {
    const [invoiceNumber, setInvoiceNumber] = useState(`INV-${format(new Date(), "yyyyMMdd")}-001`)
    const [clientName, setClientName] = useState("")
    const [clientAddress, setClientAddress] = useState("")
    const [notes, setNotes] = useState("")
    const [taxRate, setTaxRate] = useState(21)
    const [taxName, setTaxName] = useState("IVA")

    // Calcular totales
    const totalHours = data.reduce((sum, entry) => sum + (entry.total_hours || 0), 0)
    const subtotal = data.reduce((sum, entry) => {
        const hours = entry.total_hours || 0
        const rate = entry.project_hourly_rate || 0
        return sum + (hours * rate)
    }, 0)
    const taxAmount = subtotal * (taxRate / 100)
    const totalAmount = subtotal + taxAmount

    // Agrupar por proyecto
    const projectSummary = data.reduce((acc, entry) => {
        const projectName = entry.project_name
        if (!acc[projectName]) {
            acc[projectName] = {
                hours: 0,
                rate: entry.project_hourly_rate || 0,
                amount: 0
            }
        }
        const hours = entry.total_hours || 0
        acc[projectName].hours += hours
        acc[projectName].amount += hours * (entry.project_hourly_rate || 0)
        return acc
    }, {} as Record<string, { hours: number; rate: number; amount: number }>)

    const handleGenerateInvoice = () => {
        exportInvoiceToPDF({
            invoiceNumber,
            clientName,
            clientAddress,
            organizationName,
            notes,
            data,
            taxRate,
            taxName
        })
        // Cerrar el diálogo después de generar
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-500" />
                        Generar Factura
                    </DialogTitle>
                    <DialogDescription>
                        Completa los datos para generar una factura profesional basada en los datos filtrados.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Formulario de datos de factura */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="invoice-number">Número de Factura</Label>
                            <Input
                                id="invoice-number"
                                value={invoiceNumber}
                                onChange={(e) => setInvoiceNumber(e.target.value)}
                                placeholder="INV-20260122-001"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="client-name">Nombre del Cliente</Label>
                            <Input
                                id="client-name"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Empresa S.L."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="tax-name">Impuesto (Nombre)</Label>
                            <Input
                                id="tax-name"
                                value={taxName}
                                onChange={(e) => setTaxName(e.target.value)}
                                placeholder="IVA, VAT, Tax..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tax-rate">Impuesto (%)</Label>
                            <Input
                                id="tax-rate"
                                type="number"
                                step="0.5"
                                value={taxRate}
                                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                                placeholder="21"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="client-address">Dirección del Cliente</Label>
                        <Textarea
                            id="client-address"
                            value={clientAddress}
                            onChange={(e) => setClientAddress(e.target.value)}
                            placeholder="Calle Principal 123, 28001 Madrid"
                            rows={2}
                        />
                    </div>

                    {/* Preview de la factura */}
                    <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-950/50 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-bold">{organizationName}</h3>
                                <p className="text-sm text-muted-foreground">Factura #{invoiceNumber}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Fecha</p>
                                <p className="font-semibold">{format(new Date(), "dd 'de' MMMM yyyy", { locale: es })}</p>
                            </div>
                        </div>

                        {clientName && (
                            <div className="pt-4 border-t border-zinc-800">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Cliente</p>
                                <p className="font-semibold">{clientName}</p>
                                {clientAddress && <p className="text-sm text-muted-foreground">{clientAddress}</p>}
                            </div>
                        )}

                        {/* Desglose por proyecto */}
                        <div className="pt-4 border-t border-zinc-800">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Desglose de Servicios</p>
                            <div className="space-y-2">
                                {Object.entries(projectSummary).map(([projectName, summary]) => (
                                    <div key={projectName} className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                                        <div>
                                            <p className="font-medium">{projectName}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {summary.hours.toFixed(2)} horas × {summary.rate.toFixed(2)}€/h
                                            </p>
                                        </div>
                                        <p className="font-semibold text-emerald-500">{summary.amount.toFixed(2)}€</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totales */}
                        <div className="pt-4 border-t-2 border-zinc-700 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Total Horas</span>
                                <span className="font-mono">{totalHours.toFixed(2)}h</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-mono">{subtotal.toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{taxName} ({taxRate}%)</span>
                                <span className="font-mono">{taxAmount.toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                                <span className="text-lg font-semibold">Total</span>
                                <span className="text-2xl font-bold text-emerald-500">{totalAmount.toFixed(2)}€</span>
                            </div>
                        </div>
                    </div>

                    {/* Notas adicionales */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notas Adicionales (Opcional)</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Condiciones de pago, información adicional..."
                            rows={3}
                        />
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-2 pt-4 border-t border-zinc-800">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleGenerateInvoice}
                            className="bg-emerald-600 hover:bg-emerald-700"
                            disabled={!clientName}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Descargar Factura PDF
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
