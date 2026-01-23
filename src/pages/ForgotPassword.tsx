import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Link } from "react-router-dom"
import { KeyRound } from "lucide-react"

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-callback', // Need to handle this eventually, but basics first
        })

        if (error) {
            setError(error.message)
        } else {
            setMessage("Se ha enviado un enlace de recuperación a tu correo.")
        }
        setLoading(false)
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <KeyRound className="w-6 h-6 text-lime-500" /> Recuperar Contraseña
                    </CardTitle>
                    <CardDescription>
                        Ingresa tu correo para recibir un enlace de recuperación.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleReset}>
                    <CardContent className="grid gap-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="p-3 text-sm text-green-500 bg-green-50 dark:bg-green-900/20 rounded-md">
                                {message}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@ejemplo.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "Enviando..." : "Enviar Enlace"}
                        </Button>
                        <div className="text-center text-sm">
                            <Link to="/login" className="underline text-zinc-500 hover:text-zinc-800">
                                Volver a Iniciar Sesión
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
