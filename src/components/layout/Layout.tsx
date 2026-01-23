import type { ReactNode } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { MobileNav } from "@/components/layout/MobileNav"
import { useAuth } from "@/components/auth-context"
import { Search, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { useLocation } from "react-router-dom"
import { AvatarDropdown } from "@/components/layout/AvatarDropdown"
import { NotificationsDropdown } from "@/components/layout/NotificationsDropdown"

export default function Layout({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const { theme, setTheme } = useTheme()
    const location = useLocation()

    // Determine title based on path
    const getPageTitle = () => {
        switch (location.pathname) {
            case "/": return "Dashboard"
            case "/history": return "Historial"
            case "/reports": return "Reportes"
            case "/projects": return "Proyectos"
            case "/profile": return "Perfil"
            default: return "tempora"
        }
    }

    return (
        <div className="flex h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden">
            {/* Desktop Sidebar */}
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header */}
                <header className="flex items-center justify-between p-4 md:p-6 pb-2 border-b border-border/50 md:border-none backdrop-blur-sm sticky top-0 z-40 bg-background/80 md:bg-transparent">
                    <div className="flex items-center gap-3">
                        {/* Mobile Logo */}
                        <div className="md:hidden h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                            <Clock className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl md:text-3xl font-bold tracking-tight">{getPageTitle()}</h1>
                            <p className="text-[10px] md:text-sm text-muted-foreground hidden sm:block">
                                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-4">
                        <div className="relative w-48 lg:w-64 hidden md:block">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Buscar..." className="pl-8 rounded-full bg-card/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50" />
                        </div>

                        <NotificationsDropdown />

                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-card/50 shrink-0"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        >
                            {theme === 'dark' ? '🌙' : '☀️'}
                        </Button>

                        <AvatarDropdown />
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-auto scrollbar-hide pb-20 md:pb-6">
                    <div className="max-w-7xl mx-auto w-full p-4 md:p-6">
                        {children}
                    </div>
                </main>

                {/* Mobile Navigation */}
                <MobileNav />
            </div>
        </div>
    )
}
