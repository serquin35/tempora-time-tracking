import { useEffect } from "react"
import {
    LayoutDashboard,
    Users,
    FileText,
    History,
    Briefcase,
    Lightbulb,
    User,
    Plus,
    Play,
    BookOpen,
    Pause,
    Coffee,
    Wind,
    Target,
    Brain,
    Zap,
    Flame,
    Timer,
    CheckCircle,
    Moon,
    FileText as ReportIcon,
    HelpCircle
} from "lucide-react"
import { getAllArticles } from "@/lib/help-content"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { useNavigate } from "react-router-dom"
import { useProjects } from "@/hooks/use-projects"

interface CommandMenuProps {
    open: boolean
    setOpen: (open: boolean) => void
}

export function CommandMenu({ open, setOpen }: CommandMenuProps) {
    const navigate = useNavigate()
    const { projects } = useProjects()

    // Obtener todos los artículos para búsqueda plana
    const allArticles = getAllArticles()

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen(!open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [open, setOpen])

    const runCommand = (command: () => void) => {
        setOpen(false)
        command()
    }

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="¿Qué necesitas hacer? (ej. Timer, Presupuesto, Proyecto...)" />
            <CommandList>
                <CommandEmpty>No se encontraron resultados.</CommandEmpty>

                <CommandGroup heading="⏸️ Pausa / Calma">
                    <CommandItem onSelect={() => runCommand(() => navigate("/?action=pause"))} value="pausar timer stop">
                        <Pause className="mr-2 h-4 w-4 text-emerald-500" />
                        <span>Pausar Timer</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/?action=rest"))} value="tomar respiro descanso break">
                        <Wind className="mr-2 h-4 w-4 text-emerald-400" />
                        <span>Tomar un Respiro</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/?action=coffee"))} value="pausa cafe coffee descanso">
                        <Coffee className="mr-2 h-4 w-4 text-amber-600" />
                        <span>Pausa Café</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="🎯 Concentración / Foco">
                    <CommandItem onSelect={() => runCommand(() => navigate("/?action=deepwork"))} value="iniciar deep work foco intenso">
                        <Brain className="mr-2 h-4 w-4 text-violet-500" />
                        <span>Iniciar Deep Work</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/?action=zone"))} value="entrar zona flow">
                        <Target className="mr-2 h-4 w-4 text-red-500" />
                        <span>Entrar en la Zona</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/?action=focus-block"))} value="bloque enfoque 1h hora">
                        <Zap className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>Bloque de Enfoque (1h)</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="🔥 Sprint / Intensidad">
                    <CommandItem onSelect={() => runCommand(() => navigate("/?action=sprint-25"))} value="sprint final 25m pomodoro">
                        <Flame className="mr-2 h-4 w-4 text-orange-500" />
                        <span>Sprint Final (25m)</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/?action=deadline"))} value="modo deadline urgencia">
                        <Timer className="mr-2 h-4 w-4 text-red-600" />
                        <span>Modo Deadline</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="🏁 Finalizar / Cerrar">
                    <CommandItem onSelect={() => runCommand(() => navigate("/?action=complete"))} value="completar tarea finish done">
                        <CheckCircle className="mr-2 h-4 w-4 text-lime-500" />
                        <span>Completar Tarea</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/?action=finish-day"))} value="cerrar dia day end log out">
                        <Moon className="mr-2 h-4 w-4 text-indigo-400" />
                        <span>Cerrar el Día</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="🚀 Navegación / Utilitarios">
                    <CommandItem onSelect={() => runCommand(() => navigate("/projects?action=new"))} value="nuevo proyecto new project">
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Nuevo Proyecto</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/reports"))} value="ver reportes informes">
                        <ReportIcon className="mr-2 h-4 w-4" />
                        <span>Ver Reportes</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/help"))} value="centro ayuda help center">
                        <HelpCircle className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>Centro de Ayuda</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Ayuda Rápida">
                    {allArticles.slice(0, 3).map((article) => (
                        <CommandItem
                            key={article.id}
                            onSelect={() => runCommand(() => navigate(`/help/${article.category}/${article.id}`))}
                            value={`${article.title} ayuda`}
                        >
                            <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{article.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
