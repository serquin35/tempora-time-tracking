import { useState } from "react"
import { useProjects } from "@/hooks/use-projects"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Folder, ChevronDown, ChevronUp, CheckCircle2, ListTodo, MoreVertical, Pencil, Trash2, Users } from "lucide-react"
import { useTasks } from "@/hooks/use-tasks"
import type { Task } from "@/hooks/use-tasks"
import { Badge } from "@/components/ui/badge"
import { TaskFormDialog } from "@/components/dialogs/task-form-dialog"
import type { TaskFormValues } from "@/components/dialogs/task-form-dialog"
import { TaskDeleteDialog } from "@/components/dialogs/task-delete-confirm"
import { ProjectMembersDialog } from "@/components/dialogs/project-members-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/components/auth-context"

export default function Projects() {
    const { projects, createProject, deleteProject, isLoading } = useProjects()
    const { userRole } = useAuth()
    const [isCreating, setIsCreating] = useState(false)
    const [newProjectName, setNewProjectName] = useState("")
    const [newProjectHourlyRate, setNewProjectHourlyRate] = useState("")
    const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null)
    const [projectToDelete, setProjectToDelete] = useState<typeof projects[0] | null>(null)
    const [projectToManageMembers, setProjectToManageMembers] = useState<{ id: string; name: string } | null>(null)

    const isAdminOrOwner = userRole === 'owner' || userRole === 'admin'

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newProjectName.trim()) return

        const hourlyRate = parseFloat(newProjectHourlyRate) || 0
        const project = await createProject(newProjectName, getRandomColor(), hourlyRate)
        if (project) {
            setNewProjectName("")
            setNewProjectHourlyRate("")
            setIsCreating(false)
        }
    }

    const handleDeleteProject = async () => {
        if (!projectToDelete) return
        await deleteProject(projectToDelete.id)
        setProjectToDelete(null)
    }

    const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e']
    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Proyectos</h2>
                    <p className="text-muted-foreground">Gestiona los proyectos de tu organización.</p>
                </div>
                {isAdminOrOwner && (
                    <Button onClick={() => setIsCreating(!isCreating)} className={isCreating ? "bg-secondary text-secondary-foreground" : ""}>
                        {isCreating ? "Cancelar" : <><Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto</>}
                    </Button>
                )}
            </div>

            {isCreating && isAdminOrOwner && (
                <Card className="border-2 border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-lg">Crear Nuevo Proyecto</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="flex gap-4">
                                <Input
                                    placeholder="Nombre del proyecto (ej. Rediseño Web, Consultoría...)"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    autoFocus
                                    className="flex-1"
                                />
                                <div className="flex items-center gap-2 w-48">
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="Tarifa/hora"
                                        value={newProjectHourlyRate}
                                        onChange={(e) => setNewProjectHourlyRate(e.target.value)}
                                        className="flex-1"
                                    />
                                    <span className="text-sm text-muted-foreground">€/h</span>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={!newProjectName.trim()}>
                                    Guardar Proyecto
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-muted/20 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <div key={project.id} className="space-y-2">

                            <Card
                                className="group hover:shadow-lg transition-all cursor-pointer border-l-4 overflow-hidden flex flex-col justify-between"
                                style={{ borderLeftColor: project.color }}
                                onClick={() => setExpandedProjectId(expandedProjectId === project.id ? null : project.id)}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                                        Proyecto
                                    </CardTitle>
                                    <div className="flex items-center gap-1">
                                        {isAdminOrOwner && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground" onClick={(e) => e.stopPropagation()}>
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        className="cursor-pointer text-xs"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setProjectToManageMembers({ id: project.id, name: project.name })
                                                        }}
                                                    >
                                                        <Users className="mr-2 h-3 w-3" /> Gestionar Equipo
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-500 focus:text-red-500 cursor-pointer text-xs"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setProjectToDelete(project)
                                                        }}
                                                    >
                                                        <Trash2 className="mr-2 h-3 w-3" /> Eliminar Proyecto
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            {expandedProjectId === project.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold mb-1">{project.name}</div>
                                    {isAdminOrOwner && project.hourly_rate > 0 && (
                                        <div className="mb-3">
                                            <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-md border border-emerald-500/20">
                                                💰 {project.hourly_rate.toFixed(2)} €/h
                                            </span>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>Progreso</span>
                                            <span className="font-medium text-foreground">{project.stats?.progress || 0}%</span>
                                        </div>
                                        <Progress value={project.stats?.progress || 0} className="h-1.5 bg-muted" />

                                        <div className="flex items-center justify-between text-xs pt-1">
                                            <span className="text-muted-foreground">
                                                {project.stats?.completedTasks || 0}/{project.stats?.totalTasks || 0} tareas
                                            </span>
                                            {project.stats?.totalEstimatedHours ? (
                                                <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                                    Est: {project.stats.totalEstimatedHours}h
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {expandedProjectId === project.id && (
                                <div className="ml-4 pl-4 border-l-2 border-muted animate-in slide-in-from-top-4 duration-300">
                                    <ProjectTasks projectId={project.id} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl border-muted text-center space-y-4">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                        <Folder className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">No hay proyectos</h3>
                        <p className="text-muted-foreground">Crea tu primer proyecto para empezar a registrar tiempo organizado.</p>
                    </div>
                    <Button variant="outline" onClick={() => setIsCreating(true)}>
                        Crear primer proyecto
                    </Button>
                </div>
            )}
            <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el proyecto
                            <span className="font-bold text-foreground"> {projectToDelete?.name} </span>
                            y todas sus tareas asociadas.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProject} className="bg-red-600 hover:bg-red-700">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            <ProjectMembersDialog
                open={!!projectToManageMembers}
                onOpenChange={(open) => !open && setProjectToManageMembers(null)}
                project={projectToManageMembers}
            />
        </div >
    )
}

function ProjectTasks({ projectId }: { projectId: string }) {
    const { tasks, isLoading, createTask, updateTaskStatus, updateTask, deleteTask } = useTasks(projectId)
    const { userRole } = useAuth()
    const isAdminOrOwner = userRole === 'owner' || userRole === 'admin'

    const [newTaskName, setNewTaskName] = useState("")
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    // Quick add (inline)
    const handleQuickAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTaskName.trim()) return
        await createTask({ name: newTaskName, project_id: projectId, status: 'active' })
        setNewTaskName("")
    }

    // Full creation via dialog
    const handleCreateTask = async (data: TaskFormValues) => {
        await createTask({
            ...data,
            project_id: projectId
        })
    }

    // Edit task
    const handleUpdateTask = async (data: TaskFormValues, taskId?: string) => {
        if (!taskId) return
        await updateTask(taskId, data)
        setTaskToEdit(null)
    }

    // Delete task
    const handleDeleteTask = async () => {
        if (!taskToDelete) return
        await deleteTask(taskToDelete.id)
        setTaskToDelete(null)
    }

    return (
        <div className="space-y-3 py-2">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <ListTodo className="w-3 h-3" /> Tareas
                </h4>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}</Badge>
                    {isAdminOrOwner && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setIsCreateDialogOpen(true)}
                            title="Crear tarea detallada"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {isAdminOrOwner && (
                <form onSubmit={handleQuickAdd} className="flex gap-2">
                    <Input
                        placeholder="Añadir tarea rápida..."
                        className="h-8 text-xs bg-muted/30 focus-visible:ring-1"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                    />
                </form>
            )}

            <div className="space-y-1">
                {isLoading ? (
                    <div className="text-[10px] text-muted-foreground animate-pulse">Cargando tareas...</div>
                ) : tasks.length > 0 ? (
                    tasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 group hover:bg-muted/40 transition-colors">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-5 w-5 shrink-0 ${task.status === 'completed' ? 'text-lime-500 hover:text-lime-600' : 'text-zinc-500 hover:text-primary'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateTaskStatus(task.id, task.status === 'completed' ? 'active' : 'completed');
                                    }}
                                >
                                    <CheckCircle2 className={`h-4 w-4 ${task.status === 'completed' ? 'fill-lime-500/10' : ''}`} />
                                </Button>
                                <span className={`text-xs truncate ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                    {task.name}
                                </span>
                                {task.estimated_hours && task.estimated_hours > 0 && (
                                    <span className="text-[10px] text-muted-foreground border border-zinc-700/50 px-1 rounded">
                                        {task.estimated_hours}h
                                    </span>
                                )}
                            </div>

                            {isAdminOrOwner && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <MoreVertical className="h-3 w-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-32">
                                        <DropdownMenuItem onClick={() => setTaskToEdit(task)} className="text-xs cursor-pointer">
                                            <Pencil className="mr-2 h-3 w-3" /> Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setTaskToDelete(task)}
                                            className="text-xs text-red-500 focus:text-red-500 cursor-pointer"
                                        >
                                            <Trash2 className="mr-2 h-3 w-3" /> Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-[10px] text-muted-foreground italic py-2 text-center bg-muted/10 rounded-lg">
                        {isAdminOrOwner ? "Sin tareas. Añade una arriba." : "Sin tareas asignadas."}
                    </div>
                )}
            </div>

            {/* Dialogs */}
            <TaskFormDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSubmit={handleCreateTask}
            />

            {taskToEdit && (
                <TaskFormDialog
                    open={!!taskToEdit}
                    onOpenChange={(open) => !open && setTaskToEdit(null)}
                    onSubmit={handleUpdateTask}
                    initialData={taskToEdit}
                />
            )}

            {taskToDelete && (
                <TaskDeleteDialog
                    open={!!taskToDelete}
                    onOpenChange={(open) => !open && setTaskToDelete(null)}
                    onConfirm={handleDeleteTask}
                    taskName={taskToDelete.name}
                    isDeleting={isLoading}
                />
            )}
        </div>
    )
}

