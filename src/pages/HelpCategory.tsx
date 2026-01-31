import { useParams, useNavigate, Link } from 'react-router-dom'
import { helpArticles, categoryMetadata } from '@/lib/help-content'
import { ArticleCard } from '@/components/help/ArticleCard'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'

export default function HelpCategory() {
    const { category } = useParams<{ category: string }>()
    const navigate = useNavigate()

    const articles = category ? helpArticles[category] || [] : []
    const meta = category ? categoryMetadata[category] : null

    if (!category || !meta || articles.length === 0) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold mb-4">Categoría no encontrada</h1>
                <p className="text-muted-foreground mb-6">
                    La categoría que buscas no existe o no tiene artículos disponibles.
                </p>
                <Button onClick={() => navigate('/help')}>
                    <Home className="mr-2 h-4 w-4" />
                    Volver al Centro de Ayuda
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link to="/help" className="hover:text-foreground transition-colors">
                    Ayuda
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">{meta.title}</span>
            </nav>

            {/* Header */}
            <div className="space-y-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/help')}
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Button>

                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                        {meta.title}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl">
                        {meta.description}
                    </p>
                </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article) => (
                    <ArticleCard
                        key={article.id}
                        article={article}
                        onClick={() => navigate(`/help/${category}/${article.id}`)}
                    />
                ))}
            </div>

            {/* Footer CTA */}
            <div className="mt-12 p-6 rounded-2xl bg-muted/30 border border-border text-center">
                <h3 className="text-lg font-semibold mb-2">¿No encontraste lo que buscabas?</h3>
                <p className="text-muted-foreground mb-4">
                    Prueba buscando en otras categorías o contacta con nuestro equipo de soporte.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="outline" onClick={() => navigate('/help')}>
                        Ver todas las categorías
                    </Button>
                    <Button asChild>
                        <a href="mailto:soporte@tempora.app">Contactar Soporte</a>
                    </Button>
                </div>
            </div>
        </div>
    )
}
