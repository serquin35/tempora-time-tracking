import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Rocket, Wrench, Clock, BarChart3, FolderKanban, Settings, ArrowRight, MessageSquare } from "lucide-react"
import { FeedbackDialog } from "@/components/dialogs/feedback-dialog"

export default function Help() {
    const [searchQuery, setSearchQuery] = useState("")
    const [showFeedback, setShowFeedback] = useState(false)

    const categories = [
        {
            icon: Rocket,
            title: "Primeros Pasos",
            description: "Configura tu cuenta, crea tu organización y empieza a trackear.",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            icon: Clock,
            title: "Tracking de Tiempo",
            description: "Aprende a usar el cronómetro, entradas manuales y atajos.",
            color: "text-lime-500",
            bg: "bg-lime-500/10"
        },
        {
            icon: FolderKanban,
            title: "Gestión de Proyectos",
            description: "Organiza tu trabajo con proyectos, tareas y clientes.",
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            icon: BarChart3,
            title: "Reportes y Análisis",
            description: "Interpreta tus datos, exporta informes y visualiza tu productividad.",
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        },
        {
            icon: Wrench,
            title: "Solución de Problemas",
            description: "Respuestas a preguntas frecuentes y errores comunes.",
            color: "text-red-500",
            bg: "bg-red-500/10"
        },
        {
            icon: Settings,
            title: "Administración",
            description: "Gestiona tu equipo, facturación y configuración del espacio.",
            color: "text-zinc-500",
            bg: "bg-zinc-500/10"
        }
    ]

    const filteredCategories = categories.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="relative py-12 md:py-20 px-6 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 text-center">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lime-900/20 via-zinc-900/0 to-zinc-900/0" />

                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                        ¿Cómo podemos ayudarte?
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Encuentra guías, tutoriales y respuestas a tus preguntas sobre Tempora.
                    </p>

                    <div className="relative max-w-lg mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                        <Input
                            className="pl-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 rounded-2xl text-lg focus:bg-white/10 transition-all font-light"
                            placeholder="Buscar artículos, guías o tutoriales..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category, index) => (
                    <Card key={index} className="group hover:border-lime-500/50 transition-all duration-300 cursor-pointer bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <div className={`w-12 h-12 rounded-2xl ${category.bg} ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <category.icon className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                {category.title}
                            </CardTitle>
                            <CardDescription className="text-base">
                                {category.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                                Ver artículos <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Support CTA */}
            <div className="flex flex-col md:flex-row items-center justify-between p-8 rounded-2xl bg-muted/30 border border-border gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-background rounded-full border shadow-sm">
                        <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">¿No encuentras lo que buscas?</h3>
                        <p className="text-muted-foreground">Nuestro equipo de soporte está listo para ayudarte en cualquier momento.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowFeedback(true)}>
                        Enviar Feedback
                    </Button>
                    <Button asChild>
                        <a href="mailto:soporte@tempora.app">Contactar Soporte</a>
                    </Button>
                </div>
            </div>

            <FeedbackDialog open={showFeedback} onOpenChange={setShowFeedback} />
        </div>
    )
}
