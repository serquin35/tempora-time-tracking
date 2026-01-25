import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { HelpCircle, BookOpen, MessageSquare, PlayCircle, ExternalLink } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { FeedbackDialog } from "@/components/dialogs/feedback-dialog"

export function HelpDropdown() {
    const navigate = useNavigate()
    const [showFeedback, setShowFeedback] = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                        <HelpCircle className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
                        <span className="sr-only">Ayuda</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Ayuda y Soporte</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => navigate("/help")} className="cursor-pointer">
                        <BookOpen className="mr-2 h-4 w-4 text-blue-500" />
                        <span>Centro de Ayuda</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => navigate("/help")} className="cursor-pointer">
                        <PlayCircle className="mr-2 h-4 w-4 text-purple-500" />
                        <span>Tutoriales</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => setShowFeedback(true)} className="cursor-pointer">
                        <MessageSquare className="mr-2 h-4 w-4 text-green-500" />
                        <span>Enviar Feedback</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="cursor-pointer">
                        <a href="mailto:soporte@tempora.app" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4 text-orange-500" />
                            <span>Contactar Soporte</span>
                        </a>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <FeedbackDialog open={showFeedback} onOpenChange={setShowFeedback} />
        </>
    )
}
