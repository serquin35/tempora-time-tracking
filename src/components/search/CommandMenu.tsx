import { useEffect } from "react"
import {
    LayoutDashboard,
    Users,
    FileText,
    History,
    Briefcase,
    Lightbulb,
    User
} from "lucide-react"
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
            <CommandInput placeholder="Escribe un comando o busca..." />
            <CommandList>
                <CommandEmpty>No se encontraron resultados.</CommandEmpty>

                <CommandGroup heading="Sugerencias">
                    <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/projects"))}>
                        <Briefcase className="mr-2 h-4 w-4" />
                        <span>Proyectos</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/history"))}>
                        <History className="mr-2 h-4 w-4" />
                        <span>Historial</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/reports"))}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Reportes</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/team"))}>
                        <Users className="mr-2 h-4 w-4" />
                        <span>Equipo</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Proyectos">
                    {projects.slice(0, 5).map((project) => (
                        <CommandItem
                            key={project.id}
                            onSelect={() => runCommand(() => navigate("/projects"))} // Future: Navigate to specific project details if we had a route
                            value={project.name}
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

                <CommandGroup heading="Configuración">
                    <CommandItem onSelect={() => runCommand(() => navigate("/profile"))}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                        <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate('/help'))}>
                        <Lightbulb className="mr-2 h-4 w-4" />
                        <span>Ayuda</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
