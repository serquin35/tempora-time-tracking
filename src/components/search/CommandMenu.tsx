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
    BookOpen
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

                <CommandGroup heading="Acciones Rápidas">
                    <CommandItem onSelect={() => runCommand(() => navigate("/?action=timer"))} value="iniciar timer cronometro empezar">
                        <Play className="mr-2 h-4 w-4 text-lime-500" />
                        <span>Iniciar Timer</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/projects?action=new"))} value="crear nuevo proyecto">
                        <Plus className="mr-2 h-4 w-4 text-primary" />
                        <span>Crear Nuevo Proyecto</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Navegación">
                    <CommandItem onSelect={() => runCommand(() => navigate("/"))} value="dashboard inicio home">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/projects"))} value="proyectos projects">
                        <Briefcase className="mr-2 h-4 w-4" />
                        <span>Proyectos</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/history"))} value="historial history log">
                        <History className="mr-2 h-4 w-4" />
                        <span>Historial</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/reports"))} value="reportes informes exportar">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Reportes</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/team"))} value="equipo team miembros usuarios">
                        <Users className="mr-2 h-4 w-4" />
                        <span>Equipo</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Proyectos Recientes">
                    {projects.slice(0, 5).map((project) => (
                        <CommandItem
                            key={project.id}
                            onSelect={() => runCommand(() => navigate(`/projects/${project.id}`))}
                            value={`proyecto project ${project.name}`}
                        >
                            <div
                                className="mr-2 h-4 w-4 rounded-full border border-zinc-200 dark:border-zinc-800"
                                style={{ backgroundColor: project.color }}
                            />
                            <span>{project.name}</span>
                            <CommandShortcut>Proy</CommandShortcut>
                        </CommandItem>
                    ))}
                    {projects.length === 0 && (
                        <CommandItem disabled>
                            <span className="text-muted-foreground">Sin proyectos activos</span>
                        </CommandItem>
                    )}
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Centro de Ayuda">
                    <CommandItem onSelect={() => runCommand(() => navigate('/help'))} value="ayuda help soporte">
                        <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>Ir al Centro de Ayuda</span>
                    </CommandItem>
                    {allArticles.map((article) => (
                        <CommandItem
                            key={article.id}
                            onSelect={() => runCommand(() => navigate(`/help/${article.category}/${article.id}`))}
                            value={`${article.title} ${article.description} ayuda help`}
                        >
                            <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-col">
                                <span>{article.title}</span>
                                <span className="text-[10px] text-muted-foreground line-clamp-1">{article.description}</span>
                            </div>
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandGroup heading="Configuración">
                    <CommandItem onSelect={() => runCommand(() => navigate("/profile"))} value="perfil profile cuenta ajustes settings">
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil y Ajustes</span>
                        <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
