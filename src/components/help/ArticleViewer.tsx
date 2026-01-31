import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { ArticleMeta } from './ArticleMeta'
import { Lightbulb } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface ArticleViewerProps {
    content: string
    title: string
}

// Helper para extraer texto plano de elementos React anidados
const extractText = (children: any): string => {
    if (typeof children === 'string') return children
    if (typeof children === 'number') return children.toString()
    if (Array.isArray(children)) return children.map(extractText).join('')
    if (children && typeof children === 'object' && 'props' in children) {
        return extractText(children.props.children)
    }
    return ''
}

export function ArticleViewer({ content, title }: ArticleViewerProps) {
    return (
        <Card className="bg-card border-border shadow-sm overflow-hidden">
            <article className="prose prose-zinc dark:prose-invert max-w-none px-6 md:px-12 lg:px-16 py-12
        prose-headings:scroll-mt-20 prose-headings:font-semibold
        
        /* H1: Título principal muy grande */
        prose-h1:text-4xl md:prose-h1:text-5xl prose-h1:font-bold 
        prose-h1:mb-4 prose-h1:mt-0 prose-h1:leading-tight
        prose-h1:tracking-tight prose-h1:text-foreground
        
        /* H2: Secciones principales con mucho espacio arriba */
        prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:font-semibold 
        prose-h2:mt-16 prose-h2:mb-6 
        prose-h2:text-foreground prose-h2:scroll-mt-20
        
        /* H3: Subsecciones */
        prose-h3:text-xl md:prose-h3:text-2xl prose-h3:font-semibold 
        prose-h3:mt-12 prose-h3:mb-4
        prose-h3:text-foreground
        
        /* H4 */
        prose-h4:text-lg md:prose-h4:text-xl prose-h4:font-semibold 
        prose-h4:mt-10 prose-h4:mb-3
        prose-h4:text-foreground
        
        /* Párrafos: Mucho más espacio */
        prose-p:text-base prose-p:leading-relaxed prose-p:my-6
        prose-p:text-muted-foreground
        
        /* Primer párrafo: Introducción destacada */
        [&>p:first-of-type]:text-lg [&>p:first-of-type]:leading-relaxed
        [&>p:first-of-type]:text-foreground/90 [&>p:first-of-type]:mb-10
        [&>p:first-of-type]:font-normal
        
        /* Links */
        prose-a:text-primary prose-a:font-medium prose-a:no-underline 
        hover:prose-a:underline prose-a:transition-colors
        
        /* Strong/Bold */
        prose-strong:text-foreground prose-strong:font-semibold
        
        /* Inline code */
        prose-code:text-sm prose-code:bg-muted prose-code:text-foreground
        prose-code:px-2 prose-code:py-0.5 prose-code:rounded 
        prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
        prose-code:border prose-code:border-border
        
        /* Code blocks */
        prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-950 
        prose-pre:border prose-pre:border-zinc-800
        prose-pre:rounded-lg prose-pre:p-6 prose-pre:my-8
        prose-pre:overflow-x-auto prose-pre:text-sm
        
        /* Listas: Muy espaciadas */
        prose-ul:my-8 prose-ul:list-disc prose-ul:pl-6
        prose-ul:space-y-4
        
        prose-ol:my-8 prose-ol:list-decimal prose-ol:pl-6
        prose-ol:space-y-4
        
        prose-li:my-2 prose-li:text-muted-foreground
        prose-li:leading-relaxed
        
        /* Nested lists */
        prose-li>prose-ul:mt-4 prose-li>prose-ol:mt-4
        
        /* Blockquotes: Eliminado, usar componente custom */
        prose-blockquote:not-italic
        
        /* Imágenes */
        prose-img:rounded-lg prose-img:shadow-lg prose-img:my-12
        prose-img:border prose-img:border-border prose-img:w-full
        
        /* HR */
        prose-hr:my-16 prose-hr:border-border
        
        /* Tablas */
        prose-table:my-10 prose-table:border prose-table:border-border
        prose-table:rounded-lg prose-table:overflow-hidden
        prose-table:text-sm
        
        prose-thead:bg-muted
        
        prose-th:bg-muted prose-th:px-4 prose-th:py-3 
        prose-th:text-left prose-th:font-semibold prose-th:text-foreground
        prose-th:border-b prose-th:border-border
        
        prose-td:px-4 prose-td:py-3 prose-td:border-t prose-td:border-border
        prose-td:text-muted-foreground
        
        prose-tr:border-b prose-tr:border-border last:prose-tr:border-0
      ">
                <h1 className="!mb-4 !mt-0">{title}</h1>

                <ArticleMeta content={content} />

                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        // Blockquotes como cajas de nota amarillas (estilo Clockify)
                        blockquote: ({ node, children, ...props }) => (
                            <div className="flex gap-4 bg-yellow-50 dark:bg-yellow-950/20 
                border-l-4 border-yellow-500 px-6 py-4 my-8 rounded-r-lg
                not-italic shadow-sm">
                                <div className="flex-shrink-0 mt-0.5">
                                    <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                                </div>
                                <div className="flex-1 prose prose-sm prose-yellow max-w-none
                  prose-p:my-2 prose-p:text-foreground/90 prose-p:leading-relaxed
                  prose-strong:text-foreground">
                                    {children}
                                </div>
                            </div>
                        ),

                        // Imágenes con figura y caption
                        img: ({ node, alt, src, ...props }) => (
                            <figure className="my-12 not-prose">
                                <img
                                    src={src}
                                    alt={alt || ''}
                                    loading="lazy"
                                    className="rounded-lg border border-border w-full shadow-lg"
                                    {...props}
                                />
                                {alt && (
                                    <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
                                        {alt}
                                    </figcaption>
                                )}
                            </figure>
                        ),

                        // Links externos abren en nueva pestaña
                        a: ({ node, href, children, ...props }) => {
                            const isExternal = href?.startsWith('http')
                            return (
                                <a
                                    href={href}
                                    target={isExternal ? '_blank' : undefined}
                                    rel={isExternal ? 'noopener noreferrer' : undefined}
                                    {...props}
                                >
                                    {children}
                                </a>
                            )
                        },

                        // Listas con mejor spacing
                        ul: ({ node, ...props }) => (
                            <ul className="space-y-3 my-8" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                            <ol className="space-y-3 my-8" {...props} />
                        ),

                        // Headings con IDs para anchors
                        h2: ({ node, children, ...props }) => {
                            // Extraer solo el texto plano de los children (ignorando sub-elementos si los hubiera)
                            const text = extractText(children)
                            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                            return (
                                <h2 id={id} className="group relative pr-8 inline-block" {...props}>
                                    {children}
                                    <a
                                        href={`#${id}`}
                                        className="absolute -right-6 top-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity no-underline p-1"
                                        aria-label="Link to this section"
                                    >
                                        #
                                    </a>
                                </h2>
                            )
                        },
                        h3: ({ node, children, ...props }) => {
                            const text = extractText(children)
                            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                            return (
                                <h3 id={id} className="group relative pr-8 inline-block" {...props}>
                                    {children}
                                    <a
                                        href={`#${id}`}
                                        className="absolute -right-6 top-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity no-underline p-1"
                                        aria-label="Link to this section"
                                    >
                                        #
                                    </a>
                                </h3>
                            )
                        }
                    }}
                >
                    {content}
                </ReactMarkdown>
            </article>
        </Card>
    )
}
