import { useParams, useNavigate, Link } from 'react-router-dom'
import { getArticle, categoryMetadata, helpArticles } from '@/lib/help-content'
import { ArticleViewer } from '@/components/help/ArticleViewer'
import { TableOfContents } from '@/components/help/TableOfContents'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, ThumbsUp, ThumbsDown } from 'lucide-react'
import { useState } from 'react'

export default function HelpArticle() {
    const { category, articleId } = useParams<{ category: string; articleId: string }>()
    const navigate = useNavigate()
    const [feedbackGiven, setFeedbackGiven] = useState(false)

    // Early return if params missing
    if (!category || !articleId) return null

    const article = getArticle(category, articleId)
    const meta = categoryMetadata[category]

    // Check amount of articles in category to decide back navigation
    const articlesInCategory = helpArticles[category] || []
    const isSingleArticleCategory = articlesInCategory.length === 1

    const handleFeedback = (helpful: boolean) => {
        // En el futuro, esto puede enviar a analytics o Supabase
        console.log(`Feedback for ${articleId}:`, helpful ? 'helpful' : 'not helpful')
        setFeedbackGiven(true)
    }

    if (!article || !meta) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold mb-4">Artículo no encontrado</h1>
                <p className="text-muted-foreground mb-6">
                    El artículo que buscas no existe o ha sido movido.
                </p>
                <Button onClick={() => navigate('/help')}>
                    <Home className="mr-2 h-4 w-4" />
                    Volver al Centro de Ayuda
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link to="/help" className="hover:text-foreground transition-colors">
                    Ayuda
                </Link>
                {!isSingleArticleCategory && (
                    <>
                        <span>/</span>
                        <Link to={`/help/${category}`} className="hover:text-foreground transition-colors">
                            {meta.title}
                        </Link>
                    </>
                )}
                <span>/</span>
                <span className="text-foreground font-medium line-clamp-1">{article.title}</span>
            </nav>

            {/* Back Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(isSingleArticleCategory ? '/help' : `/help/${category}`)}
                className="mb-4"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {isSingleArticleCategory ? 'Volver al Centro de Ayuda' : `Volver a ${meta.title}`}
            </Button>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
                {/* Main Content */}
                <div className="min-w-0">
                    <ArticleViewer content={article.content} title={article.title} />

                    {/* Feedback Section */}
                    <div className="mt-8 p-6 border rounded-2xl bg-muted/20">
                        <h3 className="font-semibold mb-3">¿Te fue útil este artículo?</h3>
                        {!feedbackGiven ? (
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => handleFeedback(true)}
                                    variant="outline"
                                    size="sm"
                                >
                                    <ThumbsUp className="mr-2 h-4 w-4" />
                                    Sí, me ayudó
                                </Button>
                                <Button
                                    onClick={() => handleFeedback(false)}
                                    variant="outline"
                                    size="sm"
                                >
                                    <ThumbsDown className="mr-2 h-4 w-4" />
                                    No mucho
                                </Button>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                ✓ Gracias por tu feedback
                            </p>
                        )}
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-6 p-6 rounded-2xl bg-primary/5 border border-primary/20">
                        <h3 className="font-semibold mb-2">¿Necesitas más ayuda?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Nuestro equipo de soporte está disponible para responder cualquier duda adicional.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button variant="outline" size="sm" asChild>
                                <a href="mailto:soporte@tempora.app">
                                    Contactar Soporte
                                </a>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => navigate('/help')}>
                                Ver más artículos
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Sidebar with TOC */}
                <aside className="hidden lg:block">
                    <TableOfContents content={article.content} />
                </aside>
            </div>
        </div>
    )
}
