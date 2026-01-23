import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TaskDeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => Promise<void>
    taskName: string
    isDeleting: boolean
}

export function TaskDeleteDialog({ open, onOpenChange, onConfirm, taskName, isDeleting }: TaskDeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50">
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-400">
                        Esta acción no se puede deshacer. Se eliminará permanentemente la tarea <span className="font-semibold text-zinc-200">"{taskName}"</span>.
                        Las entradas de tiempo asociadas perderán su referencia a esta tarea.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={isDeleting}
                        className="bg-transparent border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                    >
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            onConfirm()
                        }}
                        disabled={isDeleting}
                        className="bg-red-500 hover:bg-red-600 text-white border-none"
                    >
                        {isDeleting ? "Eliminando..." : "Eliminar Tarea"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
