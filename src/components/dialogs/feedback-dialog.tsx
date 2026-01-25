import { useState } from "react"
import { useAuth } from "@/components/auth-context"
import { supabase } from "@/lib/supabase"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Send, CheckCircle2 } from "lucide-react"

interface FeedbackDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
    const { user } = useAuth()
    const [type, setType] = useState<string>("feature")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !message.trim()) return

        setLoading(true)
        setError(null)

        try {
            const { error: submitError } = await supabase
                .from('feedback')
                .insert({
                    user_id: user.id,
                    type,
                    message: message.trim()
                })

            if (submitError) throw submitError

            setSuccess(true)
            setMessage("")
            setTimeout(() => {
                setSuccess(false)
                onOpenChange(false)
            }, 2000)
        } catch (e: any) {
            console.error(e)
            setError("Error enviando feedback. Inténtalo de nuevo.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Enviar Comentarios</DialogTitle>
                    <DialogDescription>
                        ¿Encontraste un error o tienes una idea? Nos encantaría escucharte.
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in zoom-in duration-300">
                        <div className="h-12 w-12 rounded-full bg-lime-500/10 flex items-center justify-center text-lime-500">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-lg">¡Feedback Recibido!</h3>
                        <p className="text-sm text-muted-foreground">Gracias por ayudarnos a mejorar Tempora.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo de feedback</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="feature">✨ Sugerencia / Idea</SelectItem>
                                    <SelectItem value="bug">🐛 Reportar Error</SelectItem>
                                    <SelectItem value="other">💬 Otro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Tu mensaje</Label>
                            <Textarea
                                id="message"
                                placeholder={type === 'bug' ? "Describe el error y cómo reproducirlo..." : "Cuéntanos tu idea para mejorar Tempora..."}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="min-h-[120px] resize-none"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 font-medium">{error}</p>
                        )}

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading || !message.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Enviar Feedback
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
