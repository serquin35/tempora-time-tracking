import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTimeTracking } from "@/hooks/use-time-tracking"
import { Button } from "@/components/ui/button"
import { Pause, Play, Square, Minimize2 } from "lucide-react"

import confetti from "canvas-confetti"

export default function FocusMode() {
    const navigate = useNavigate()
    const { activeEntry, elapsedTime, clockOut, togglePause } = useTimeTracking()

    // Si no hay tarea activa, salir del modo focus automáticamente
    useEffect(() => {
        if (!activeEntry && elapsedTime === 0) {
            navigate("/")
        }
    }, [activeEntry, elapsedTime, navigate])

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    if (!activeEntry) return null

    const handleFinish = async () => {
        // Celebración si la sesión duró más de 1 minuto (para no celebrar pruebas)
        if (elapsedTime > 60) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
        await clockOut()
        navigate("/") // Volver al dashboard al terminar
    }

    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
            {/* Header Minimalista */}
            <div className="absolute top-6 right-6">
                <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full hover:bg-muted/20">
                    <Minimize2 className="w-6 h-6 text-muted-foreground" />
                </Button>
            </div>

            {/* Contenido Central */}
            <div className="flex flex-col items-center gap-8 max-w-2xl w-full text-center">

                {/* Info Tarea */}
                <div className="space-y-4">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
                        Focus Mode
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
                        {activeEntry.task_id ? 'Depuración de API' : 'Sesión de Trabajo'}
                        {/* TODO: Obtener nombre real de tarea via Supabase o Contexto enriquecido */}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        {activeEntry.project_id ? 'App Control de Tiempos' : 'Sin Proyecto'}
                    </p>
                </div>

                {/* Cronómetro Gigante */}
                <div className="relative py-12">
                    <div className="text-[120px] md:text-[180px] font-mono leading-none tracking-tighter text-foreground tabular-nums select-none">
                        {formatTime(elapsedTime)}
                    </div>
                    {/* Efecto de resplandor sutil */}
                    <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -z-10 animate-pulse" />
                </div>

                {/* Controles */}
                <div className="flex items-center gap-6">
                    <Button
                        size="lg"
                        variant="outline"
                        className="h-16 w-16 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary/10 transition-all"
                        onClick={togglePause}
                    >
                        {activeEntry.status === 'paused' ? (
                            <Play className="w-8 h-8 fill-current" />
                        ) : (
                            <Pause className="w-8 h-8 fill-current" />
                        )}
                    </Button>

                    <Button
                        size="lg"
                        className="h-16 px-8 rounded-full text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all bg-red-500 hover:bg-red-600 border-none text-white"
                        onClick={handleFinish}
                    >
                        <Square className="w-6 h-6 mr-2 fill-current" />
                        Finalizar
                    </Button>
                </div>

            </div>

            {/* Footer Inspiracional (Opcional) */}
            <div className="absolute bottom-10 text-muted-foreground/50 text-sm font-medium italic">
                "La concentración es la clave del rendimiento."
            </div>
        </div>
    )
}
