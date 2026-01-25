import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/components/theme-provider"
import {
    Camera,
    User,
    Shield,
    Settings,
    Moon,
    Sun,
    Check,
    AlertCircle,
    KeyRound,
    Building2,
    Users as UsersIcon,
    ArrowRight,
    Briefcase,
    PlusCircle,
    Eye,
    EyeOff
} from "lucide-react"

export default function Profile() {
    const { user, organization, userRole } = useAuth()
    const { theme, setTheme } = useTheme()

    // Loading states
    const [loading, setLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)

    // Form states
    const [fullName, setFullName] = useState("")
    const [avatarUrl, setAvatarUrl] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Organization states
    const [joinCode, setJoinCode] = useState("")
    const [joinLoading, setJoinLoading] = useState(false)
    const [newOrgName, setNewOrgName] = useState("")
    const [createOrgLoading, setCreateOrgLoading] = useState(false)

    // Messages
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

    useEffect(() => {
        if (user) {
            setFullName(user.user_metadata?.full_name || "")
            setAvatarUrl(user.user_metadata?.avatar_url || "")
        }
    }, [user])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.updateUser({
            data: { full_name: fullName, avatar_url: avatarUrl }
        })

        if (error) {
            setMessage({ text: `Error: ${error.message}`, type: 'error' })
        } else {
            setMessage({ text: "Perfil actualizado correctamente", type: 'success' })
        }
        setLoading(false)
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        // ... previous code
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            setMessage({ text: "Las contraseñas no coinciden", type: 'error' })
            return
        }

        setPasswordLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (error) {
            setMessage({ text: `Error: ${error.message}`, type: 'error' })
        } else {
            setMessage({ text: "Contraseña actualizada correctamente", type: 'success' })
            setNewPassword("")
            setConfirmPassword("")
        }
        setPasswordLoading(false)
    }

    const handleJoinOrganization = async (e: React.FormEvent) => {
        e.preventDefault()
        const cleanCode = joinCode.trim()
        if (!cleanCode || !user) return

        setJoinLoading(true)
        setMessage(null)

        try {
            // Use secure RPC function to bypass RLS restrictions
            const { data, error } = await supabase.rpc('join_organization', {
                _org_id: cleanCode
            }) as any

            if (error) throw error
            if (!data.success) throw new Error(data.message)

            setMessage({ text: data.message + ". Por favor recarga la página.", type: 'success' })
            setJoinCode("")

            // Optional: Auto-reload after short delay
            setTimeout(() => window.location.reload(), 1500)
        } catch (error: any) {
            setMessage({ text: error.message || "Error al unirse a la organización", type: 'error' })
        } finally {
            setJoinLoading(false)
        }
    }

    const handleCreateOrganization = async (e: React.FormEvent) => {
        e.preventDefault()
        const name = newOrgName.trim()
        if (!name || !user) return

        setCreateOrgLoading(true)
        setMessage(null)

        try {
            // Generate slug from name
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000)

            // 1. Create Organization
            const { data: org, error: orgError } = await supabase
                .from('organizations')
                .insert({
                    name: name,
                    slug: slug,
                    type: 'business',
                    owner_id: user.id
                })
                .select()
                .single()

            if (orgError) throw orgError

            // 2. Add as Owner
            const { error: memberError } = await supabase
                .from('organization_members')
                .insert({
                    organization_id: org.id,
                    user_id: user.id,
                    role: 'owner'
                })

            if (memberError) throw memberError

            setMessage({ text: `Organización "${name}" creada exitosamente. Recargando...`, type: 'success' })
            setNewOrgName("")

            // Reload to update context
            setTimeout(() => window.location.reload(), 1500)
        } catch (error: any) {
            console.error(error)
            setMessage({ text: error.message || "Error al crear la organización", type: 'error' })
        } finally {
            setCreateOrgLoading(false)
        }
    }

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return
        }
        setLoading(true)
        const file = e.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${user?.id}-${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file)

        if (uploadError) {
            setMessage({ text: `Error al subir imagen: ${uploadError.message}`, type: 'error' })
            setLoading(false)
            return
        }

        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
        setAvatarUrl(data.publicUrl)
        setLoading(false)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Configuración del Perfil</h1>
                <p className="text-muted-foreground">Administra tu cuenta, seguridad y preferencias de la aplicación.</p>
            </div>

            {message && (
                <div className={`flex items-center gap-2 p-4 rounded-xl text-sm font-medium border animate-in slide-in-from-top-2 duration-300 ${message.type === "error"
                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                    : "bg-primary/10 text-primary border-primary/20"
                    }`}>
                    {message.type === "error" ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    {message.text}
                </div>
            )}

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="flex flex-wrap w-full p-1 bg-muted/50 backdrop-blur-sm h-auto gap-1">
                    <TabsTrigger value="general" className="flex-1 gap-2 min-w-[100px]">
                        <User className="w-4 h-4" />
                        <span className="hidden sm:inline">General</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex-1 gap-2 min-w-[100px]">
                        <Shield className="w-4 h-4" />
                        <span className="hidden sm:inline">Seguridad</span>
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="flex-1 gap-2 min-w-[100px]">
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Preferencias</span>
                    </TabsTrigger>
                    <TabsTrigger value="organization" className="flex-1 gap-2 text-lime-500 min-w-[120px]">
                        <Building2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Organización</span>
                    </TabsTrigger>
                </TabsList>

                {/* --- Tab: General --- */}
                <TabsContent value="general" className="mt-6">
                    <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle>Información Personal</CardTitle>
                            <CardDescription>Actualiza tu nombre y foto de perfil.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleUpdateProfile}>
                            <CardContent className="space-y-8">
                                <div className="flex flex-col items-center sm:flex-row gap-6">
                                    <div className="relative group">
                                        <Avatar className="w-28 h-28 border-4 border-background shadow-2xl">
                                            <AvatarImage src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
                                            <AvatarFallback className="text-2xl">{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                                            <Camera className="w-5 h-5" />
                                        </label>
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarUpload}
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="space-y-1 text-center sm:text-left">
                                        <h3 className="font-semibold text-lg">{fullName || "Usuario"}</h3>
                                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                                        <div className="mt-2 text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block">
                                            Miembro desde {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : '---'}
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-border/20" />

                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullname">Nombre Completo</Label>
                                        <Input
                                            id="fullname"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Tu nombre real"
                                            className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Correo Electrónico</Label>
                                        <div className="relative">
                                            <Input
                                                id="email"
                                                value={user?.email || ""}
                                                disabled
                                                className="bg-muted/50 text-muted-foreground border-border/50 flex-1 pl-10"
                                            />
                                            <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground italic flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            El correo electrónico no se puede cambiar por seguridad.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end bg-muted/20 border-t border-border/10 px-6 py-4">
                                <Button type="submit" disabled={loading} className="gap-2 group shadow-lg shadow-primary/20">
                                    {loading ? "Guardando..." : "Guardar Cambios"}
                                    {!loading && <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                {/* --- Tab: Security --- */}
                <TabsContent value="security" className="mt-6">
                    <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle>Seguridad de la Cuenta</CardTitle>
                            <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleUpdatePassword}>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">Nueva Contraseña</Label>
                                        <div className="relative">
                                            <Input
                                                id="new-password"
                                                type={showNewPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="bg-background/50 border-border/50 pl-10 pr-10"
                                                required
                                            />
                                            <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                                        <div className="relative">
                                            <Input
                                                id="confirm-password"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="bg-background/50 border-border/50 pl-10 pr-10"
                                                required
                                            />
                                            <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 space-y-2">
                                    <h4 className="text-xs font-bold uppercase text-orange-500 flex items-center gap-2">
                                        <AlertCircle className="w-3 h-3" />
                                        Recomendación
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        Usa una contraseña de al menos 8 caracteres con letras, números y símbolos.
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end bg-muted/20 border-t border-border/10 px-6 py-4">
                                <Button type="submit" disabled={passwordLoading} className="gap-2 shadow-lg">
                                    <Shield className="w-4 h-4" />
                                    {passwordLoading ? "Actualizando..." : "Actualizar Contraseña"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                {/* --- Tab: Preferences --- */}
                <TabsContent value="preferences" className="mt-6">
                    <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle>Preferencias de Aplicación</CardTitle>
                            <CardDescription>Personaliza cómo se ve y siente la aplicación.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/30">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Modo Oscuro</Label>
                                        <p className="text-sm text-muted-foreground">Cambia entre tema claro y oscuro.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Sun className={`w-4 h-4 ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
                                        <Switch
                                            checked={theme === "dark"}
                                            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                                        />
                                        <Moon className={`w-4 h-4 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/30">
                                    <div className="space-y-0.5">
                                        <Label className="text-base italic opacity-50">Sincronización Automática</Label>
                                        <p className="text-sm text-muted-foreground">Mantiene tus datos al día en tiempo real.</p>
                                    </div>
                                    <Switch checked disabled />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/30">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Idioma</Label>
                                        <p className="text-sm text-muted-foreground">Actualmente sólo disponible en Español.</p>
                                    </div>
                                    <div className="text-sm font-medium px-3 py-1 bg-muted rounded-md cursor-not-allowed">
                                        Español (ES)
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/30">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Zona Horaria</Label>
                                        <p className="text-sm text-muted-foreground">Utilizado para los reportes y registros.</p>
                                    </div>
                                    <div className="text-sm font-medium px-3 py-1 bg-muted rounded-md">
                                        {Intl.DateTimeFormat().resolvedOptions().timeZone}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- Tab: Organization --- */}
                <TabsContent value="organization" className="mt-6">
                    <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-lime-500" /> Mi Organización
                            </CardTitle>
                            <CardDescription>
                                Estás en <strong>{organization?.name || "Cargando..."}</strong> como <strong>{userRole === 'owner' ? 'Propietario' : userRole === 'admin' ? 'Administrador' : 'Miembro'}</strong>.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-6 rounded-2xl bg-muted/30 border border-border space-y-4">
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-foreground">Unirse a una organización</h4>
                                    <p className="text-sm text-muted-foreground">Si tu jefe o administrador te ha dado un código, introdúcelo aquí.</p>
                                </div>
                                <form onSubmit={handleJoinOrganization} className="flex gap-2">
                                    <Input
                                        placeholder="Pegar código de organización aquí (UUID)"
                                        className="bg-background border-zinc-700 font-mono"
                                        value={joinCode}
                                        onChange={(e) => setJoinCode(e.target.value)}
                                    />
                                    <Button type="submit" disabled={joinLoading || !joinCode} className="bg-lime-500 hover:bg-lime-600 text-black px-6">
                                        {joinLoading ? "Uniendo..." : "Unirme"}
                                        {!joinLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                                    </Button>
                                </form>
                            </div>

                            <Separator className="bg-border" />

                            <div className="p-6 rounded-2xl bg-muted/30 border border-border space-y-4">
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-lime-500" /> Crear Nueva Organizacion
                                    </h4>
                                    <p className="text-sm text-muted-foreground">Crea una nueva organizacion para tu equipo o negocio.</p>
                                </div>
                                <form onSubmit={handleCreateOrganization} className="flex gap-2">
                                    <Input
                                        placeholder="Nombre de tu empresa (ej. Acme Corp)"
                                        className="bg-background border-zinc-700"
                                        value={newOrgName}
                                        onChange={(e) => setNewOrgName(e.target.value)}
                                    />
                                    <Button type="submit" disabled={createOrgLoading || !newOrgName} className="bg-zinc-800 hover:bg-zinc-700 text-white px-6">
                                        {createOrgLoading ? "Creando..." : "Crear"}
                                        {!createOrgLoading && <PlusCircle className="ml-2 w-4 h-4" />}
                                    </Button>
                                </form>
                            </div>

                            <Separator className="bg-border" />

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/20">
                                    <div className="w-10 h-10 rounded-full bg-lime-500/10 flex items-center justify-center text-lime-500">
                                        <UsersIcon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold">Gestionar Equipo</div>
                                        <p className="text-xs text-muted-foreground">Añade o cambia roles a tus compañeros.</p>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href="/team">Ir a Equipo</a>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
