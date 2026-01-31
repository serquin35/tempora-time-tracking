import { Clock } from 'lucide-react'

interface ArticleMetaProps {
    content: string
}

export function ArticleMeta({ content }: ArticleMetaProps) {
    // Calcular tiempo de lectura estimado (200 palabras por minuto)
    const wordCount = content.trim().split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 border-b border-border pb-8">
            <Clock className="w-4 h-4" />
            <span>{readingTime} min read</span>
        </div>
    )
}
