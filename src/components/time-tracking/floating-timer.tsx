import { useEffect, useRef, useState } from 'react'
import { useTimeTracking } from '@/hooks/use-time-tracking'
import { Button } from '@/components/ui/button'
import { MonitorPlay } from 'lucide-react'

/**
 * FloatingTimer utiliza la API de Picture-in-Picture para mostrar un cronómetro flotante
 * que permanece visible incluso cuando el usuario cambia de pestaña o aplicación.
 */
export function FloatingTimer() {
    const { elapsedTime, activeEntry } = useTimeTracking()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPiPActive, setIsPiPActive] = useState(false)

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    // Efecto para dibujar el tiempo en el canvas continuamente
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const draw = () => {
            // Fondo oscuro premium
            ctx.fillStyle = '#09090b' // zinc-950
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Brillo sutil lime
            const gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 10,
                canvas.width / 2, canvas.height / 2, 100
            )
            gradient.addColorStop(0, 'rgba(163, 230, 21, 0.05)')
            gradient.addColorStop(1, 'transparent')
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Texto del Cronómetro
            ctx.fillStyle = '#a3e635' // lime-400
            ctx.font = 'bold 50px monospace'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'

            // Añadir sombra al texto para legibilidad
            ctx.shadowColor = 'rgba(0,0,0,0.5)'
            ctx.shadowBlur = 4
            ctx.fillText(formatTime(elapsedTime), canvas.width / 2, canvas.height / 2)

            // Etiqueta Tempora
            ctx.shadowBlur = 0
            ctx.font = 'bold 12px sans-serif'
            ctx.fillStyle = '#71717a' // zinc-400
            ctx.fillText('TEMPORA • SIGUIENDO TIEMPO', canvas.width / 2, canvas.height - 20)

            // Si está pausado, mostrar indicador
            if (activeEntry?.status === 'paused') {
                ctx.fillStyle = '#f59e0b' // amber-500
                ctx.fillText('PAUSADO', canvas.width / 2, 20)
            }

            if (isPiPActive) {
                requestAnimationFrame(draw)
            }
        }

        if (isPiPActive) {
            const animId = requestAnimationFrame(draw)
            return () => cancelAnimationFrame(animId)
        } else {
            draw() // Dibujar una vez para el estado inicial
        }
    }, [elapsedTime, activeEntry, isPiPActive])

    const togglePiP = async () => {
        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture()
                // El estado se actualiza mediante el listener 'leavepictureinpicture'
            } else if (videoRef.current && canvasRef.current) {
                // Capturar el stream del canvas a 10fps (suficiente para un reloj y ahorra CPU)
                const stream = (canvasRef.current as any).captureStream(10)
                videoRef.current.srcObject = stream

                await videoRef.current.play()
                await videoRef.current.requestPictureInPicture()
                setIsPiPActive(true)

                videoRef.current.addEventListener('leavepictureinpicture', () => {
                    setIsPiPActive(false)
                }, { once: true })
            }
        } catch (error) {
            console.error('Picture-in-Picture failed:', error)
        }
    }

    if (!activeEntry) return null

    return (
        <div className="flex items-center">
            {/* Elementos ocultos necesarios para la magia del PiP */}
            <canvas ref={canvasRef} width={300} height={150} className="hidden" />
            <video ref={videoRef} className="hidden" muted autoPlay playsInline />

            <Button
                variant="outline"
                size="sm"
                onClick={togglePiP}
                className={`h-8 gap-2 border-zinc-200 dark:border-zinc-800 transition-all ${isPiPActive ? 'bg-lime-500/10 text-lime-600 border-lime-500/30' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                title="Abrir reloj flotante"
            >
                <MonitorPlay className={`w-4 h-4 ${isPiPActive ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-semibold">Reloj Escritorio (PiP)</span>
            </Button>
        </div>
    )
}
