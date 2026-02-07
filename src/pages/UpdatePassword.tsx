import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"
import { Lock } from "lucide-react"

export default function UpdatePassword() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        // En un flujo real de Supabase, cuando el usuario pincha el link del correo, 
        // llega a la app con un fragmento en la URL que contiene el access_token.
        // Supabase-js detecta esto automáticamente y establece la sesión.
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                // Si no hay sesión, algo fue mal con el link o expiró
                setError("No se ha podido validar la sesión de recuperación. Por favor, solicita un nuevo enlace.")
            }
        }
        checkSession()
    }, [])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden")
            setLoading(false)
            return
        }

        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres")
            setLoading(false)
            return
        }

        const { error } = await supabase.auth.updateUser({
            password: password
        })

        if (error) {
            setError(error.message)
        } else {
            // Éxito, redirigir al dashboard
            navigate("/")
        }
        setLoading(false)
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <Lock className="w-6 h-6 text-lime-500" /> Nueva Contraseña
                    </CardTitle>
                    <CardDescription>
                        Ingresa tu nueva contraseña para acceder a Tempora.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdate}>
                    <CardContent className="grid gap-4">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="password">Nueva Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "Actualizando..." : "Cambiar Contraseña"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
