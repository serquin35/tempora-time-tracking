import { useState } from "react"
import { useAuth } from "@/components/auth-context"
import { useOrganizationMembers } from "@/hooks/use-organization-members"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserMinus, Copy, Check, Info, ArrowRight, Building2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

export default function Team() {
    const { organization, userRole, user } = useAuth()
    const { members, isLoading, updateMemberRole, removeMember } = useOrganizationMembers()
    const [copied, setCopied] = useState(false)
    const [joinCode, setJoinCode] = useState("")
    const [joinLoading, setJoinLoading] = useState(false)

    const copyInviteCode = () => {
        if (!organization) return
        navigator.clipboard.writeText(organization.id)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault()
        const cleanCode = joinCode.trim()
        if (!cleanCode || !user) return
        setJoinLoading(true)

        try {
            // Use secure RPC function to bypass RLS restrictions
            const { data, error } = await supabase.rpc('join_organization', {
                _org_id: cleanCode
            }) as any

            if (error) throw error
            if (!data.success) throw new Error(data.message)

            alert(data.message)
            window.location.reload()
        } catch (err: any) {
            console.error("Join error:", err)
            alert(err.message || "Error al unirse")
        } finally {
            setJoinLoading(false)
        }
    }

    const isPersonal = !organization || organization?.type === 'personal'
    const canManage = userRole === 'owner' || userRole === 'admin'

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mi Equipo</h1>
                    <p className="text-zinc-500">Gestiona los miembros y sus niveles de acceso.</p>
                </div>
            </div>

            {/* Show Invite or Join based on context */}
            {canManage && !isPersonal ? (
                <Card className="bg-card shadow-sm border">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lime-600 dark:text-lime-500 flex items-center gap-2">
                            <Users className="w-5 h-5" /> Invitar Miembros
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Comparte este código con tu equipo para que se unan a tu organización.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 bg-muted/40 p-4 rounded-lg border">
                            <code className="text-emerald-700 dark:text-lime-400 font-mono text-sm flex-1">{organization?.id}</code>
                            <Button size="sm" variant="ghost" className="hover:text-lime-500" onClick={copyInviteCode}>
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : isPersonal && (
                <Card className="bg-blue-500/10 border-blue-500/20">
                    <CardHeader>
                        <CardTitle className="text-blue-500 flex items-center gap-2">
                            <Building2 className="w-5 h-5" /> Unirme a un Equipo
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            ¿Tu administrador te ha dado un código? Introdúcelo aquí para dejar de estar solo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleJoin} className="flex gap-2">
                            <Input
                                placeholder="Pegar código (UUID) aquí..."
                                className="bg-background font-mono"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                            />
                            <Button type="submit" disabled={joinLoading || !joinCode} className="bg-blue-500 hover:bg-blue-600 text-white">
                                {joinLoading ? "Uniendo..." : "Unirme"}
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Members List */}
            <Card className="shadow-sm bg-card">
                <CardHeader>
                    <CardTitle>{isPersonal ? "Tu Espacio Personal" : "Miembros de la Empresa"}</CardTitle>
                    <CardDescription>
                        {isPersonal
                            ? "Estás usando un espacio privado. Únete a una organización para colaborar."
                            : `Hay ${members.length} personas colaborando en esta organización.`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading ? (
                        <div className="text-center py-8 text-zinc-500">Cargando equipo...</div>
                    ) : (
                        <div className="divide-y divide-zinc-800">
                            {members.map((member) => (
                                <div key={member.id} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                                            {member.full_name[0]}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-foreground">
                                                {member.full_name} {member.id === user?.id && <span className="text-xs text-muted-foreground font-normal ml-2">(Tú)</span>}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className={`text-[10px] uppercase ${member.role === 'owner' ? 'border-amber-500/50 text-amber-500 bg-amber-500/5' :
                                                    member.role === 'admin' ? 'border-purple-500/50 text-purple-500 bg-purple-500/5' :
                                                        'border-zinc-700 text-zinc-500'
                                                    }`}>
                                                    {member.role === 'owner' ? 'Propietario' : member.role === 'admin' ? 'Administrador' : 'Miembro'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {canManage && member.role !== 'owner' && member.id !== user?.id && (
                                        <div className="flex items-center gap-3 w-full md:w-auto">
                                            <Select
                                                value={member.role}
                                                onValueChange={(v) => updateMemberRole(member.id, v as any)}
                                            >
                                                <SelectTrigger className="w-[140px] bg-background">
                                                    <SelectValue placeholder="Rol" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="member">Miembro</SelectItem>
                                                    <SelectItem value="admin">Administrador</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
                                                onClick={() => {
                                                    if (confirm(`¿Estás seguro de eliminar a ${member.full_name}?`)) {
                                                        removeMember(member.id)
                                                    }
                                                }}
                                            >
                                                <UserMinus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="bg-muted/40 border rounded-lg p-4 flex gap-3 text-sm text-muted-foreground">
                <Info className="w-5 h-5 text-lime-500 shrink-0" />
                <p>
                    <strong>Nota sobre roles:</strong> Los administradores pueden ver reportes detallados de todo el equipo y gestionar proyectos. Los miembros (empleados) solo pueden registrar su propio tiempo y ver sus reportes personales.
                </p>
            </div>
        </div>
    )
}
