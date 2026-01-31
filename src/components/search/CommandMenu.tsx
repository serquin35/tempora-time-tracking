import { useEffect } from "react"
import {
    Plus,
    BookOpen,
    Target,
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
} from "@/components/ui/command"
import { useNavigate } from "react-router-dom"


interface CommandMenuProps {
    open: boolean
    setOpen: (open: boolean) => void
}

export function CommandMenu({ open, setOpen }: CommandMenuProps) {
    const navigate = useNavigate()

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
            <CommandInput placeholder="Buscar ayuda, acciones..." />
            <CommandList>
                <CommandEmpty>No se encontraron resultados.</CommandEmpty>

                <CommandGroup heading="Acciones Rápidas">
                    <CommandItem onSelect={() => runCommand(() => navigate("/projects?action=new"))} value="nuevo proyecto crear project">
                        <Plus className="mr-2 h-4 w-4 text-primary" />
                        <span>Crear Nuevo Proyecto</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => navigate("/profile"))} value="perfil profile configuracion settings ajustes">
                        <Target className="mr-2 h-4 w-4 text-blue-500" />
                        <span>Mi Perfil</span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Centro de Ayuda">
                    <CommandItem onSelect={() => runCommand(() => navigate('/help'))} value="ayuda help centro soporte">
                        <HelpCircle className="mr-2 h-4 w-4 text-yellow-500" />
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
                                <span className="text-sm">{article.title}</span>
                                <span className="text-[11px] text-muted-foreground line-clamp-1">{article.description}</span>
                            </div>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
