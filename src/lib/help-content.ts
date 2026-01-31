// Helper para importar contenido de los archivos markdown
import intro from '../../docs/knowledge-base/01-introduccion-tempora.md?raw'
import guiaTracker from '../../docs/knowledge-base/02-guia-usuario-tracker.md?raw'
import proyectosTareas from '../../docs/knowledge-base/03-gestion-proyectos-tareas.md?raw'
import organizaciones from '../../docs/knowledge-base/04-organizaciones-equipo.md?raw'
import reportes from '../../docs/knowledge-base/05-reportes-facturacion.md?raw'
import configuracion from '../../docs/knowledge-base/06-configuracion-seguridad.md?raw'
import faqs from '../../docs/knowledge-base/07-faq-soporte.md?raw'

export interface HelpArticle {
  id: string
  title: string
  description: string
  icon: string
  content: string
  category: string
}

export interface HelpCategory {
  slug: string
  title: string
  description: string
  articles: HelpArticle[]
}

// Definición de artículos por categoría
export const helpArticles: Record<string, HelpArticle[]> = {
  'primeros-pasos': [
    {
      id: 'introduccion',
      title: 'Visión General de Tempora',
      description: 'Qué es Tempora, su filosofía y cómo puede ayudarte a gestionar tu tiempo de forma efectiva.',
      icon: '🚀',
      content: intro,
      category: 'primeros-pasos'
    }
  ],
  'tracking-tiempo': [
    {
      id: 'usar-timer',
      title: 'Guía del Timer y Tracking',
      description: 'Aprende a usar el cronómetro, atajos de teclado, entradas manuales y sincronización en tiempo real.',
      icon: '⏱️',
      content: guiaTracker,
      category: 'tracking-tiempo'
    }
  ],
  'gestion-proyectos': [
    {
      id: 'proyectos-tareas',
      title: 'Proyectos, Tareas y Clientes',
      description: 'Organiza tu trabajo con proyectos, gestiona presupuestos y controla el alcance de tus entregas.',
      icon: '📁',
      content: proyectosTareas,
      category: 'gestion-proyectos'
    }
  ],
  'reportes-analisis': [
    {
      id: 'reportes-facturacion',
      title: 'Reportes y Facturación',
      description: 'Genera reportes profesionales, exporta datos y crea facturas automáticas para tus clientes.',
      icon: '📊',
      content: reportes,
      category: 'reportes-analisis'
    }
  ],
  'solucion-problemas': [
    {
      id: 'faqs',
      title: 'Preguntas Frecuentes',
      description: 'Respuestas a las dudas más comunes y solución de problemas habituales.',
      icon: '❓',
      content: faqs,
      category: 'solucion-problemas'
    }
  ],
  'administracion': [
    {
      id: 'organizaciones-equipo',
      title: 'Organizaciones y Equipos',
      description: 'Gestiona tu equipo, roles, permisos y configuración de workspaces multi-contexto.',
      icon: '👥',
      content: organizaciones,
      category: 'administracion'
    },
    {
      id: 'configuracion-seguridad',
      title: 'Configuración y Seguridad',
      description: 'Configura tu cuenta, privacidad, seguridad y personalización de la aplicación.',
      icon: '🔒',
      content: configuracion,
      category: 'administracion'
    }
  ]
}

// Mapeo de categorías con metadata
export const categoryMetadata: Record<string, { title: string; description: string }> = {
  'primeros-pasos': {
    title: 'Primeros Pasos',
    description: 'Configura tu cuenta, crea tu organización y empieza a trackear.'
  },
  'tracking-tiempo': {
    title: 'Tracking de Tiempo',
    description: 'Aprende a usar el cronómetro, entradas manuales y atajos.'
  },
  'gestion-proyectos': {
    title: 'Gestión de Proyectos',
    description: 'Organiza tu trabajo con proyectos, tareas y clientes.'
  },
  'reportes-analisis': {
    title: 'Reportes y Análisis',
    description: 'Interpreta tus datos, exporta informes y visualiza tu productividad.'
  },
  'solucion-problemas': {
    title: 'Solución de Problemas',
    description: 'Respuestas a preguntas frecuentes y errores comunes.'
  },
  'administracion': {
    title: 'Administración',
    description: 'Gestiona tu equipo, facturación y configuración del espacio.'
  }
}

// Helper para obtener un artículo específico
export function getArticle(category: string, articleId: string): HelpArticle | null {
  const articles = helpArticles[category]
  if (!articles) return null
  return articles.find(a => a.id === articleId) || null
}

// Helper para obtener todos los artículos
export function getAllArticles(): HelpArticle[] {
  return Object.values(helpArticles).flat()
}

// Helper para buscar artículos por término
export function searchArticles(query: string): HelpArticle[] {
  if (!query.trim()) return []

  const lowerQuery = query.toLowerCase()
  return getAllArticles().filter(article =>
    article.title.toLowerCase().includes(lowerQuery) ||
    article.description.toLowerCase().includes(lowerQuery) ||
    article.content.toLowerCase().includes(lowerQuery)
  )
}
