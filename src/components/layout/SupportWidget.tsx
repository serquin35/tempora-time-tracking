import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, Sparkles, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/components/auth-context"
import { chatService } from "@/lib/chat-service"
import type { ChatMessage } from "@/types/chat"
import { cn } from "@/lib/utils"

export function SupportWidget() {
    const { user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Load real history from Supabase
    useEffect(() => {
        const loadHistory = async () => {
            if (!user || !isOpen) return

            const history = await chatService.getChatHistory(user.id)
            if (history.length > 0) {
                setMessages(history)
            } else {
                // Initial greeting if no history
                setMessages([
                    {
                        id: "greeting",
                        text: "¡Hola! Soy el asistente virtual de Tempora. ¿En qué puedo ayudarte hoy?",
                        sender: 'bot',
                        timestamp: new Date()
                    }
                ])
            }
        }

        loadHistory()
    }, [isOpen, user])

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isTyping, isOpen])

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isOpen])

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!inputValue.trim() || isTyping) return

        const userMsg: ChatMessage = {
            id: crypto.randomUUID(),
            text: inputValue.trim(),
            sender: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInputValue("")
        setIsTyping(true)

        // API Call
        if (!user) return
        const response = await chatService.sendMessage(userMsg.text, user.id)

        setMessages(prev => [...prev, response])
        setIsTyping(false)
    }

    return (
        <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-[60] flex flex-col items-end gap-3 md:gap-4 font-sans">
            {/* Chat Window */}
            {isOpen && (
                <div className={cn(
                    "fixed bottom-40 right-4 sm:relative sm:bottom-0 sm:right-0", // Position fixed on mobile, relative on desktop
                    "w-[calc(100vw-2rem)] sm:w-[380px] h-[60vh] sm:h-[550px] max-h-[calc(100vh-12rem)]",
                    "bg-background/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl flex flex-col overflow-hidden",
                    "animate-in slide-in-from-bottom-10 fade-in duration-300 dark:bg-zinc-900/90 dark:border-zinc-800",
                    "transition-all z-[61]"
                )}>
                    {/* Header */}
                    <div className="p-4 bg-lime-400 dark:bg-lime-500 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Bot className="w-5 h-5 text-black" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-black text-sm">Soporte Tempora</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                    </span>
                                    <span className="text-[10px] uppercase font-bold text-black/60 tracking-wider">En línea</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-black hover:bg-white/20 rounded-full h-8 w-8"
                                onClick={async () => {
                                    if (user && confirm("¿Estás seguro de que deseas borrar el historial de esta conversación?")) {
                                        const success = await chatService.clearChatHistory(user.id)
                                        if (success) {
                                            setMessages([
                                                {
                                                    id: "greeting",
                                                    text: "Conversación finalizada. ¿En qué más puedo ayudarte?",
                                                    sender: 'bot',
                                                    timestamp: new Date()
                                                }
                                            ])
                                        }
                                    }
                                }}
                                title="Limpiar historial"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-black hover:bg-white/20 rounded-full h-8 w-8"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <ScrollArea className="flex-1 p-4 bg-white/50 dark:bg-zinc-950/50">
                        <div className="space-y-4 flex flex-col">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm animate-in zoom-in-95 duration-200",
                                        msg.sender === 'user'
                                            ? "bg-black text-white dark:bg-white dark:text-black self-end rounded-tr-sm"
                                            : "bg-white text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100 self-start rounded-tl-sm border border-zinc-100 dark:border-zinc-700"
                                    )}
                                >
                                    {msg.text}
                                    <span className="text-[10px] opacity-40 block mt-1 text-right">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="bg-white dark:bg-zinc-800 self-start p-4 rounded-2xl rounded-tl-sm shadow-sm border border-zinc-100 dark:border-zinc-700 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
                        <div className="relative flex items-center">
                            <Input
                                ref={inputRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Escribe tu mensaje..."
                                className="pr-12 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus-visible:ring-lime-400"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!inputValue.trim() || isTyping}
                                className={cn(
                                    "absolute right-1 h-8 w-8 rounded-lg transition-all",
                                    inputValue.trim()
                                        ? "bg-lime-400 text-black hover:bg-lime-500"
                                        : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
                                )}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex justify-center mt-2">
                            <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-lime-500" /> Powered by n8n AI
                            </span>
                        </div>
                    </form>
                </div>
            )}

            {/* Floating Bubble */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="lg"
                className={cn(
                    "rounded-full h-14 w-14 shadow-xl transition-all duration-300 hover:scale-105",
                    isOpen
                        ? "bg-zinc-100 text-zinc-900 rotate-90 dark:bg-zinc-800 dark:text-white"
                        : "bg-lime-400 text-black hover:bg-lime-500 animate-in zoom-in"
                )}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
            </Button>
        </div>
    )
}
