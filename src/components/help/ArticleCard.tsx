import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import type { HelpArticle } from '@/lib/help-content'

interface ArticleCardProps {
    article: HelpArticle
    onClick: () => void
}

export function ArticleCard({ article, onClick }: ArticleCardProps) {
    return (
        <Card
            onClick={onClick}
            className="group hover:border-primary/50 transition-all duration-300 cursor-pointer bg-card/50 backdrop-blur-sm hover:shadow-lg"
        >
            <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">{article.icon}</div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                    </CardTitle>
                </div>
                <CardDescription className="text-sm line-clamp-3">
                    {article.description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    Leer artículo
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
            </CardContent>
        </Card>
    )
}
