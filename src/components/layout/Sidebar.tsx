import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, History, FileText, User, LogOut, Clock, Briefcase, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Tablero", href: "/" },
    { icon: Briefcase, label: "Proyectos", href: "/projects" },
    { icon: Users, label: "Equipo", href: "/team" },
    { icon: History, label: "Historial", href: "/history" },
    { icon: FileText, label: "Reportes", href: "/reports" },
    { icon: User, label: "Perfil", href: "/profile" },
]

export function Sidebar() {
    const location = useLocation()
    const { signOut, organization } = useAuth()

    return (
        <aside className="w-64 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hidden md:flex flex-col p-4 m-4 rounded-[2rem] shadow-xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
            <div className="flex items-center space-x-2 px-4 py-6">
                <div className="h-8 w-8 bg-lime-400 rounded-lg flex items-center justify-center shadow-md shadow-lime-400/20">
                    <Clock className="h-5 w-5 text-black" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold tracking-wider">tempora</span>
                    {organization && (
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                            {organization.name}
                        </span>
                    )}
                </div>
            </div>

            <nav className="flex-1 space-y-2 mt-8">
                {sidebarItems.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                                isActive
                                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black shadow-lg translate-x-1"
                                    : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-lime-400 dark:text-primary" : "text-current")} />
                            <span className="font-medium">{item.label}</span>
                            {isActive && (
                                <div className="absolute right-3 w-2 h-2 rounded-full bg-lime-400" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Upgrade Card Replacement - "Current Status" */}
            <div className="mt-auto bg-gradient-to-br from-lime-300 to-lime-500 rounded-[1.5rem] p-6 text-black mb-4 relative overflow-hidden group shadow-lg shadow-lime-500/10">
                <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-1">¿Hora de enfocarse?</h3>
                    <p className="text-sm opacity-80 mb-4">Inicia el temporizador y avanza.</p>
                    <Button size="sm" className="w-full bg-black text-white hover:bg-zinc-800 rounded-xl" asChild>
                        <Link to="/">Empezar</Link>
                    </Button>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute top-2 right-2 text-white/40">
                    <Clock className="h-8 w-8" />
                </div>
            </div>

            <button
                onClick={signOut}
                className="flex items-center space-x-3 px-4 py-3 text-zinc-500 dark:text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors mt-2"
            >
                <LogOut className="h-5 w-5" />
                <span>Cerrar Sesión</span>
            </button>
        </aside>
    )
}
