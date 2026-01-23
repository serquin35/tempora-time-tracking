import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useOrganizationMembers } from "@/hooks/use-organization-members"
import { getProjectMembers, assignUserToProject, removeUserFromProject } from "@/lib/project-members"
import { useAuth } from "@/components/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Save } from "lucide-react"

interface ProjectMembersDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    project: { id: string; name: string } | null
}

export function ProjectMembersDialog({ open, onOpenChange, project }: ProjectMembersDialogProps) {
    const { organization } = useAuth()
    const { members } = useOrganizationMembers()
    const [assignedMemberIds, setAssignedMemberIds] = useState<Set<string>>(new Set())
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (open && project) {
            loadProjectMembers()
        } else {
            setAssignedMemberIds(new Set())
        }
    }, [open, project])

    const loadProjectMembers = async () => {
        if (!project) return
        setIsLoading(true)
        console.log("Cargando miembros para proyecto:", project.id, project.name)

        try {
            const members = await getProjectMembers(project.id)
            console.log("Miembros recuperados de BD:", members)

            const memberIds = new Set(members.map((m: any) => m.user_id))
            console.log("IDs de miembros asignados:", [...memberIds])

            setAssignedMemberIds(memberIds)
        } catch (error) {
            console.error("Error al cargar miembros del proyecto:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const toggleMember = (userId: string) => {
        const newSet = new Set(assignedMemberIds)
        if (newSet.has(userId)) {
            newSet.delete(userId)
        } else {
            newSet.add(userId)
        }
        setAssignedMemberIds(newSet)
    }

    const handleSave = async () => {
        if (!project || !organization) return
        setIsSaving(true)

        try {
            // Obtenemos el estado original para comparar
            const currentMembers = await getProjectMembers(project.id)
            const currentMemberIds = new Set(currentMembers.map((m: any) => m.user_id))

            // Identificar cambios
            const toAdd = [...assignedMemberIds].filter(id => !currentMemberIds.has(id))
            const toRemove = [...currentMemberIds].filter(id => !assignedMemberIds.has(id))

            // Ejecutar cambios
            const promises = [
                ...toAdd.map(id => assignUserToProject(project.id, id, organization.id)),
                ...toRemove.map(id => removeUserFromProject(project.id, id))
            ]

            await Promise.all(promises)
            onOpenChange(false)
        } catch (error) {
            console.error("Error saving project members:", error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        Gestionar Equipo
                    </DialogTitle>
                    <DialogDescription>
                        Selecciona los miembros que trabajarán en <span className="font-semibold text-white">{project?.name}</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">Cargando asignaciones...</div>
                    ) : (
                        <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-4">
                                {members.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id={`member-${member.id}`}
                                                checked={assignedMemberIds.has(member.id)}
                                                onCheckedChange={() => toggleMember(member.id)}
                                            />
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>{member.full_name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="grid gap-0.5">
                                                    <Label htmlFor={`member-${member.id}`} className="font-medium cursor-pointer">
                                                        {member.full_name}
                                                    </Label>
                                                    <span className="text-xs text-muted-foreground capitalize">
                                                        {member.role === 'owner' ? 'Propietario' : member.role === 'admin' ? 'Administrador' : 'Miembro'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {assignedMemberIds.has(member.id) && (
                                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                                Asignado
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving || isLoading} className="bg-blue-600 hover:bg-blue-700">
                        {isSaving ? (
                            <>Guardando...</>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Guardar Cambios
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
