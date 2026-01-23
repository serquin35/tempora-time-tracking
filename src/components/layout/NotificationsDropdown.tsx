import { Bell, Check, Info, AlertTriangle, CheckCircle, AlertCircle, Trash2 } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export function NotificationsDropdown() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearRead } = useNotifications()

    const hasReadNotifications = notifications.some(n => n.is_read)

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
            case 'alert': return <AlertCircle className="h-4 w-4 text-red-500" />
            default: return <Info className="h-4 w-4 text-blue-500" />
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-card/50 shrink-0 relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notificaciones</span>
                    {unreadCount > 0 ? (
                        <Button variant="ghost" onClick={() => markAllAsRead()} className="text-xs h-6 px-2 py-0 hover:bg-lime-400/20 hover:text-lime-600">
                            <Check className="mr-1 h-3 w-3" />
                            Marcar leídas
                        </Button>
                    ) : hasReadNotifications && (
                        <Button variant="ghost" onClick={() => clearRead()} className="text-xs h-6 px-2 py-0 hover:bg-red-400/20 hover:text-red-600">
                            <Trash2 className="mr-1 h-3 w-3" />
                            Limpiar
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-auto max-h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No tienes notificaciones nuevas
                        </div>
                    ) : (
                        <div className="flex flex-col p-1">
                            {notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={cn(
                                        "flex flex-col items-start gap-1 p-3 cursor-pointer my-0.5 rounded-lg",
                                        !notification.is_read ? "bg-muted/50" : ""
                                    )}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex items-start gap-2 w-full">
                                        <div className="mt-0.5">{getIcon(notification.type)}</div>
                                        <div className="flex-1 space-y-1">
                                            <p className={cn("text-sm font-medium leading-none", !notification.is_read && "text-foreground")}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground/70">
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: es })}
                                            </p>
                                        </div>
                                        {!notification.is_read && (
                                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-1" />
                                        )}
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
