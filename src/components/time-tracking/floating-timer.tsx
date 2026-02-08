import { useEffect, useRef, useState } from 'react'
import { useTimeTracking } from '@/hooks/use-time-tracking'
import { Button } from '@/components/ui/button'
import { MonitorPlay } from 'lucide-react'

/**
 * FloatingTimer utiliza la API de Picture-in-Picture para mostrar un cronómetro flotante
 * que permanece visible incluso cuando el usuario cambia de pestaña o aplicación.
 */
export function FloatingTimer() {
    const { elapsedTime, activeEntry, togglePause, clockOut } = useTimeTracking()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPiPActive, setIsPiPActive] = useState(false)

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    // Configurar Media Session para permitir control desde el sistema (teclas multimedia, barra tareas)
    useEffect(() => {
        if ('mediaSession' in navigator && isPiPActive) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: activeEntry?.status === 'active' ? 'Tempora - Siguiendo Tiempo' : 'Tempora - Pausado',
                artist: 'Sergio Quintero O.',
                album: activeEntry?.status === 'active' ? 'Cronómetro en ejecución' : 'Sesión en pausa',
                artwork: [
                    { src: 'https://img.icons8.com/flat-round/512/time-machine.png', sizes: '512x512', type: 'image/png' }
                ]
            });

            navigator.mediaSession.setActionHandler('play', () => {
                if (activeEntry?.status === 'paused') togglePause();
            });
            navigator.mediaSession.setActionHandler('pause', () => {
                if (activeEntry?.status === 'active') togglePause();
            });
            navigator.mediaSession.setActionHandler('stop', () => {
                clockOut();
            });
            // Opcional: usar nexttrack como atajo para detener (más común en teclados)
            navigator.mediaSession.setActionHandler('nexttrack', () => {
                const confirmed = window.confirm("¿Estás seguro de que deseas detener la sesión desde el reloj?");
                if (confirmed) clockOut();
            });
        }
    }, [isPiPActive, activeEntry?.status, togglePause, clockOut]);

    // Efecto para dibujar el tiempo en el canvas continuamente
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const draw = () => {
            // 1. Limpiar y Fondo con Gradiente
            const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
            bgGradient.addColorStop(0, '#18181b') // zinc-900
            bgGradient.addColorStop(1, '#09090b') // zinc-950
            ctx.fillStyle = bgGradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // 2. Efecto de Brillo/Luz (Glow)
            const glow = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, canvas.width / 1.5
            )
            const color = activeEntry?.status === 'paused' ? '245, 158, 11' : '163, 230, 21' // amber vs lime
            glow.addColorStop(0, `rgba(${color}, 0.1)`)
            glow.addColorStop(1, 'transparent')
            ctx.fillStyle = glow
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // 3. Dibujar Borde Interior (Diseño más redondeado visualmente)
            ctx.strokeStyle = `rgba(${color}, 0.2)`
            ctx.lineWidth = 4
            ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8)

            // 4. Texto del Cronómetro Principal
            ctx.fillStyle = activeEntry?.status === 'paused' ? '#fbbf24' : '#a3e635'
            ctx.font = 'bold 58px "Courier New", Courier, monospace'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'

            // Sombra de neón
            ctx.shadowColor = `rgba(${color}, 0.4)`
            ctx.shadowBlur = 15
            ctx.fillText(formatTime(elapsedTime), canvas.width / 2, canvas.height / 2 - 5)

            // 5. Detalles Inferiores
            ctx.shadowBlur = 0
            ctx.font = 'bold 14px sans-serif'
            ctx.fillStyle = '#71717a' // zinc-400
            ctx.fillText('TEMPORA • SIGUIENDO TIEMPO', canvas.width / 2, canvas.height - 25)

            // 6. Barra de Progreso Sutil (Simulada o decorativa)
            ctx.fillStyle = `rgba(${color}, 0.3)`
            const barWidth = ((elapsedTime % 60) / 60) * (canvas.width - 40)
            ctx.fillRect(20, canvas.height - 10, barWidth, 2)

            // 7. Indicador de Estado Superior
            if (activeEntry?.status === 'paused') {
                ctx.fillStyle = '#f59e0b'
                ctx.font = 'bold 12px sans-serif'
                ctx.fillText('SESIÓN PAUSADA', canvas.width / 2, 25)
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
            } else if (videoRef.current && canvasRef.current) {
                const stream = (canvasRef.current as any).captureStream(30) // Más FPS para suavidad
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
            <canvas ref={canvasRef} width={400} height={200} className="hidden" />
            <video ref={videoRef} className="hidden" muted autoPlay playsInline />

            <Button
                variant="outline"
                size="sm"
                onClick={togglePiP}
                className={`h-8 gap-2 border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300 ${isPiPActive ? 'bg-lime-500 text-black border-lime-600 hover:bg-lime-600' : 'bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                title="Reloj flotante para escritorio"
            >
                <MonitorPlay className={`w-3.5 h-3.5 ${isPiPActive ? 'animate-pulse' : ''}`} />
                <span className="text-[11px] font-bold uppercase tracking-tight">Reloj Escritorio</span>
            </Button>
        </div>
    )
}
