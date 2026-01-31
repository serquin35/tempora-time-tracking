import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TOCItem {
    id: string
    text: string
    level: number
}

interface TableOfContentsProps {
    content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<TOCItem[]>([])
    const [activeId, setActiveId] = useState<string>('')
    const [isExpanded, setIsExpanded] = useState(true)

    useEffect(() => {
        // Extraer headings del contenido markdown
        const lines = content.split('\n')
        const extractedHeadings: TOCItem[] = []

        lines.forEach((line) => {
            const h2Match = line.match(/^## (.+)/)
            const h3Match = line.match(/^### (.+)/)

            if (h2Match) {
                const text = h2Match[1]
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                extractedHeadings.push({ id, text, level: 2 })
            } else if (h3Match) {
                const text = h3Match[1]
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                extractedHeadings.push({ id, text, level: 3 })
            }
        })

        setHeadings(extractedHeadings)
    }, [content])

    useEffect(() => {
        // Observer options refinadas
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80% 0px', // Detectar cuando está cerca del top
            threshold: 0.1
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id)
                }
            })
        }, observerOptions)

        // Observar todos los headings
        const headingElements = document.querySelectorAll('h2, h3')
        headingElements.forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, [headings])

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            setActiveId(id) // Sets active immediately on click
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    if (headings.length === 0) return null

    return (
        <Card className="sticky top-24 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">En esta página</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="h-6 w-6 p-0"
                >
                    {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {isExpanded && (
                <nav className="space-y-1">
                    {headings.map((heading) => (
                        <button
                            key={heading.id}
                            onClick={() => scrollToHeading(heading.id)}
                            className={cn(
                                "block w-full text-left text-sm py-1.5 px-2 rounded transition-colors",
                                heading.level === 3 && "pl-4",
                                activeId === heading.id
                                    ? "text-primary bg-primary/10 font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            {heading.text}
                        </button>
                    ))}
                </nav>
            )}
        </Card>
    )
}
