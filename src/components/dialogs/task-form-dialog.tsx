import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Task } from "@/hooks/use-tasks"

// Esquema para validación del formulario (valores de entrada desde UI)
const taskFormSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().optional(),
    estimated_hours: z.union([z.string(), z.number()]).transform((val) => val === "" ? 0 : Number(val)).pipe(z.number().min(0)).optional(),
    status: z.enum(["active", "completed", "archived"]).default("active")
})

// Tipo inferido para uso interno del form (que maneja strings en inputs)
type TaskFormInput = z.input<typeof taskFormSchema>
// Tipo de salida (ya transformado a números)
export type TaskFormValues = z.output<typeof taskFormSchema>

interface TaskFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: TaskFormValues, taskId?: string) => Promise<void>
    initialData?: Task | null
}

export function TaskFormDialog({ open, onOpenChange, onSubmit, initialData }: TaskFormDialogProps) {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<TaskFormInput>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            name: "",
            description: "",
            estimated_hours: 0,
            status: "active"
        }
    })

    useEffect(() => {
        if (open) {
            if (initialData) {
                setValue("name", initialData.name)
                setValue("description", initialData.description || "")
                setValue("estimated_hours", initialData.estimated_hours || 0)
                setValue("status", initialData.status)
            } else {
                reset({
                    name: "",
                    description: "",
                    estimated_hours: 0,
                    status: "active"
                })
            }
        }
    }, [open, initialData, setValue, reset])

    const handleFormSubmit = async (data: TaskFormInput) => {
        // Zod resolver ya transforma los datos, pero react-hook-form pasa 'data' como input type
        // Hacemos el cast seguro aquí porque sabemos que pasó la validación
        const parsedData = taskFormSchema.parse(data)
        await onSubmit(parsedData, initialData?.id)
        onOpenChange(false)
    }

    const watchStatus = watch("status")

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-50">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {initialData ? "Modifica los detalles de la tarea existente." : "Crea una nueva tarea para este proyecto."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-zinc-200">Nombre</Label>
                        <Input
                            id="name"
                            className="bg-zinc-900 border-zinc-800 focus-visible:ring-lime-500"
                            placeholder="Ej. Diseño de Homepage"
                            {...register("name")}
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-zinc-200">Descripción (Opcional)</Label>
                        <Textarea
                            id="description"
                            className="bg-zinc-900 border-zinc-800 min-h-[80px] focus-visible:ring-lime-500"
                            placeholder="Detalles adicionales..."
                            {...register("description")}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="estimated_hours" className="text-zinc-200">Horas Estimadas</Label>
                            <Input
                                id="estimated_hours"
                                type="number"
                                step="0.5"
                                min="0"
                                className="bg-zinc-900 border-zinc-800 focus-visible:ring-lime-500"
                                {...register("estimated_hours")}
                            />
                        </div>

                        {initialData && (
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-zinc-200">Estado</Label>
                                <Select
                                    value={watchStatus}
                                    onValueChange={(val: "active" | "completed" | "archived") => setValue("status", val)}
                                >
                                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        <SelectItem value="active">Activa</SelectItem>
                                        <SelectItem value="completed">Completada</SelectItem>
                                        <SelectItem value="archived">Archivada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-lime-500 hover:bg-lime-600 text-black font-medium"
                        >
                            {isSubmitting ? "Guardando..." : initialData ? "Actualizar" : "Crear Tarea"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
