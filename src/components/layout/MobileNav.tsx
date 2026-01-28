import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, History, FileText, User, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    { icon: LayoutDashboard, label: "Tablero", href: "/" },
    { icon: Users, label: "Equipo", href: "/team" },
    { icon: History, label: "Historial", href: "/history" },
    { icon: FileText, label: "Reportes", href: "/reports" },
    { icon: User, label: "Perfil", href: "/profile" },
]

export function MobileNav() {
    const location = useLocation()

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border px-4 py-2 flex justify-around items-center">
            {navItems.map((item) => {
                const isActive = location.pathname === item.href
                return (
                    <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200",
                            isActive
                                ? "text-primary bg-primary/10"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <item.icon className={cn("h-6 w-6", isActive && "animate-pulse")} />
                        <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}
