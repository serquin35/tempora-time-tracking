import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, AlertTriangle } from "lucide-react"
import { format, differenceInHours } from "date-fns"
import { es } from "date-fns/locale"

interface ZombieTimerRecoveryDialogProps {
    open: boolean
    entry: {
        id: string
        clock_in: string
        notes?: string
        project?: { name: string }
    } | null
    onKeep: () => void
    onFix: (newEndTime: string) => void
}

export function ZombieTimerRecoveryDialog({ open, entry, onKeep, onFix }: ZombieTimerRecoveryDialogProps) {
    const [mode, setMode] = useState<"initial" | "fix">("initial")
    const [fixTime, setFixTime] = useState("")

    if (!entry) return null

    const startTime = new Date(entry.clock_in)
    const hoursRunning = differenceInHours(new Date(), startTime)

    // Suggest a reasonable end time (e.g., start time + 8 hours or current time if less)
    const suggestedFixDate = new Date(startTime.getTime() + 4 * 60 * 60 * 1000) // Default to +4h as a safe guess

    // Format for datetime-local input: YYYY-MM-DDTHH:mm
    const formatForInput = (date: Date) => {
        return formatDateToLocalISOString(date).slice(0, 16)
    }

    const handleFixClick = () => {
        setFixTime(formatForInput(suggestedFixDate))
        setMode("fix")
    }

    const handleConfirmFix = () => {
        // Validation could go here
        onFix(new Date(fixTime).toISOString())
        setMode("initial") // Reset for next time
    }

    return (
        <Dialog open={open} onOpenChange={() => { /* Prevent closing by clicking outside */ }}>
            <DialogContent className="sm:max-w-[500px]" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader>
                    <div className="mx-auto bg-amber-100 p-3 rounded-full mb-4 w-fit">
                        <AlertTriangle className="h-8 w-8 text-amber-600" />
                    </div>
                    <DialogTitle className="text-center text-xl">¿Olvidaste detener el temporizador?</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        Hemos detectado una sesión inusualmente larga de <strong>{hoursRunning} horas</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-muted/50 p-4 rounded-lg my-2 text-sm space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Proyecto:</span>
                        <span className="font-medium">{entry.project?.name || "Sin Proyecto"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Tarea:</span>
                        <span className="font-medium truncate max-w-[200px]">{entry.notes || "Sin descripción"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Iniciado:</span>
                        <span className="font-medium capitalize">
                            {format(startTime, "EEEE d, HH:mm", { locale: es })}
                        </span>
                    </div>
                </div>

                {mode === "initial" ? (
                    <div className="space-y-3 pt-2">
                        <Button
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                            onClick={handleFixClick}
                        >
                            <Clock className="mr-2 h-4 w-4" />
                            No, olvidé pararlo (Corregir Hora)
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={onKeep}
                        >
                            Sí, trabajé todo este tiempo
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 pt-2">
                        <div className="grid gap-2">
                            <Label htmlFor="endtime">¿A qué hora terminaste realmente?</Label>
                            <Input
                                id="endtime"
                                type="datetime-local"
                                value={fixTime}
                                onChange={(e) => setFixTime(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Se ajustará el registro para terminar en esta fecha y hora.
                            </p>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="ghost" onClick={() => setMode("initial")}>
                                Volver
                            </Button>
                            <Button onClick={handleConfirmFix}>
                                Confirmar y Guardar
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

function formatDateToLocalISOString(date: Date) {
    const tzOffset = -date.getTimezoneOffset();
    const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds());
}
