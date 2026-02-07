import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"
import { Lock, Loader2 } from "lucide-react"

export default function UpdatePassword() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [isValidating, setIsValidating] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        // Escuchar cambios de auth (Supabase procesa el hash de la URL asíncronamente)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setError(null)
                setIsValidating(false)
            }
        })

        const verify = async () => {
            // Damos un margen inicial para que Supabase procese el hash
            await new Promise(resolve => setTimeout(resolve, 1500))
            const { data: { session } } = await supabase.auth.getSession()

            if (session) {
                setError(null)
                setIsValidating(false)
            } else {
                // Si tras el margen extra no hay nada y NO hay hash en la URL, error
                if (!window.location.hash.includes('access_token')) {
                    setError("La sesión de recuperación ha expirado o el enlace es inválido. Por favor, solicita uno nuevo desde el login.")
                    setIsValidating(false)
                } else {
                    // Si HAY hash pero no hay sesión, esperamos un poco más (retraso de red)
                    setTimeout(async () => {
                        const { data: { session: retrySession } } = await supabase.auth.getSession()
                        if (!retrySession) {
                            setError("No se ha podido validar la sesión. Intenta recargar la página o solicita un nuevo enlace.")
                        }
                        setIsValidating(false)
                    }, 2000)
                }
            }
        }

        verify()
        return () => subscription.unsubscribe()
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
            navigate("/")
        }
        setLoading(false)
    }

    if (isValidating && !error) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
                <div className="flex flex-col items-center gap-4 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-lime-500" />
                    <div className="space-y-1">
                        <p className="font-medium">Validando seguridad...</p>
                        <p className="text-xs text-zinc-500">Esto solo tomará un momento</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <Lock className="w-6 h-6 text-lime-500" /> Nueva Contraseña
                    </CardTitle>
                    <CardDescription>
                        Crea una nueva contraseña segura para tu cuenta.
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
                                disabled={!!error}
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
                                disabled={!!error}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Button className="w-full" type="submit" disabled={loading || !!error}>
                            {loading ? "Actualizando..." : "Cambiar Contraseña"}
                        </Button>
                        {error && (
                            <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
                                Volver al Login
                            </Button>
                        )}
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
