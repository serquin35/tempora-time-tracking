import { useState } from "react"
import { format } from "date-fns"
import { useTimeTracking } from "@/hooks/use-time-tracking"
import { useProjects } from "@/hooks/use-projects"
import { useTasks } from "@/hooks/use-tasks"
import { Button } from "@/components/ui/button"
import { Play, Pause, StopCircle, Clock } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import confetti from "canvas-confetti"

export function CurrentStatus() {
    const { activeEntry, elapsedTime, clockIn, clockOut, togglePause, isLoading } = useTimeTracking()
    const { projects } = useProjects()

    const handleFinish = async () => {
        // Celebración si la sesión duró más de 30 minutos (sesión productiva)
        if (elapsedTime > 1800) {
            confetti({
                particleCount: 150,
                spread: 60,
                origin: { x: 1, y: 0.8 }, // Dispara desde la derecha (cerca del botón)
                colors: ['#a3e635', '#22c55e', '#ffffff'] // Colores de la marca (lime/green)
            });
        }
        await clockOut()
    }

    const [selectedProjectId, setSelectedProjectId] = useState<string>("")
    const [selectedTaskId, setSelectedTaskId] = useState<string>("")

    // Hook para selección de tareas (cuando no hay sesión activa)
    const { tasks: tasksForSelection, isLoading: isLoadingSelectionTasks } = useTasks(selectedProjectId && selectedProjectId !== "none" ? selectedProjectId : undefined)

    // Hook para mostrar tarea actual (cuando hay sesión activa)
    // Se ejecuta siempre, pero solo busca si hay activeEntry y project_id
    const { tasks: tasksForDisplay } = useTasks(activeEntry?.project_id || undefined)

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    }

    if (isLoading) {
        return <div className="h-64 rounded-[1.5rem] bg-card border shadow-sm animate-pulse" />
    }

    if (!activeEntry) {
        return (
            <div className="h-full min-h-[18rem] bg-card border shadow-sm rounded-[1.5rem] p-6 flex flex-col items-center justify-center text-center space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-16 w-16 bg-lime-400/20 text-lime-600 dark:text-lime-400 rounded-full flex items-center justify-center">
                        <Clock className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">¿Listo para trabajar?</h3>
                        <p className="text-muted-foreground text-sm max-w-xs mx-auto">Selecciona un proyecto e inicia el temporizador.</p>
                    </div>
                </div>

                <div className="w-full max-w-xs space-y-3">
                    <div className="space-y-3">
                        <Select value={selectedProjectId} onValueChange={(v) => { setSelectedProjectId(v); setSelectedTaskId(""); }}>
                            <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
                                <SelectValue placeholder="Seleccionar Proyecto (Opcional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Sin Proyecto</SelectItem>
                                {projects.map((project) => (
                                    <SelectItem key={project.id} value={project.id}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                                            {project.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {selectedProjectId && selectedProjectId !== "none" && (
                            <Select value={selectedTaskId} onValueChange={setSelectedTaskId} disabled={isLoadingSelectionTasks}>
                                <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 animate-in slide-in-from-top-2 duration-300">
                                    <SelectValue placeholder={isLoadingSelectionTasks ? "Cargando tareas..." : "Seleccionar Tarea (Opcional)"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Sin Tarea específica</SelectItem>
                                    {tasksForSelection.map((task) => (
                                        <SelectItem key={task.id} value={task.id}>
                                            {task.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <Button
                        size="lg"
                        className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl"
                        onClick={() => clockIn(
                            selectedProjectId === "none" ? undefined : selectedProjectId,
                            selectedTaskId === "none" ? undefined : selectedTaskId
                        )}
                    >
                        <Play className="mr-2 h-4 w-4" /> Iniciar Sesión
                    </Button>
                </div>
            </div>
        )
    }

    const isPaused = activeEntry.status === "paused"
    // Buscamos el proyecto y tarea activos
    const currentProject = projects.find(p => p.id === activeEntry.project_id)
    const currentTask = tasksForDisplay.find(t => t.id === activeEntry.task_id)

    return (
        <div className="h-full min-h-[16rem] bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-[1.5rem] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-lime-500/10 border border-zinc-200 dark:border-zinc-800">
            {/* Background Decoration - Adapted for Light Mode */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/10 dark:bg-lime-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium tracking-wide uppercase text-xs">Sesión Actual</p>
                        {currentProject && (
                            <div className="flex flex-col gap-1">
                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5 w-fit">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentProject.color }} />
                                    {currentProject.name}
                                </span>
                                {currentTask && (
                                    <span className="text-[10px] text-zinc-500 font-medium ml-1">
                                        ↳ {currentTask.name}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="mt-2 text-5xl md:text-6xl font-bold font-mono tracking-tighter tabular-nums text-zinc-900 dark:text-white">
                        {formatTime(elapsedTime)}
                    </div>
                    <p className="text-zinc-500 mt-2 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Iniciado a las {format(new Date(activeEntry.clock_in), "h:mm a")}
                    </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-md ${isPaused ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20' : 'bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-lime-500/20'}`}>
                    {isPaused ? "Pausado" : "En Vivo"}
                </div>
            </div>

            <div className="relative z-10 flex gap-4 mt-8">
                <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-zinc-300 rounded-xl backdrop-blur-sm transition-all"
                    onClick={togglePause}
                >
                    {isPaused ? <><Play className="mr-2 h-4 w-4" /> Reanudar</> : <><Pause className="mr-2 h-4 w-4" /> Pausar</>}
                </Button>
                <Button
                    variant="destructive"
                    size="lg"
                    className="flex-1 rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all"
                    onClick={handleFinish}
                >
                    <StopCircle className="mr-2 h-4 w-4" /> Detener
                </Button>
            </div>
        </div>
    )
}
