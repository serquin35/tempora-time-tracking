import type { ChatMessage, N8nResponse } from "@/types/chat"

// Fallback URL for development if env var is missing
// In production, this should be set in Vercel/Netlify
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "https://n8n.cheosdesign.info/webhook/tempora"

export const chatService = {
    async sendMessage(text: string, userId?: string): Promise<ChatMessage> {
        try {
            const response = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: text,
                    userId: userId || "anonymous",
                    timestamp: new Date().toISOString(),
                    context: {
                        page: window.location.pathname,
                        platform: "web"
                    }
                }),
            })

            if (!response.ok) {
                throw new Error("Error connecting to support")
            }

            const data: N8nResponse = await response.json()

            return {
                id: crypto.randomUUID(),
                text: data.text || "Lo siento, no he recibido una respuesta válida.",
                sender: 'bot',
                timestamp: new Date(),
                isError: false
            }

        } catch (error) {
            console.error("Chat Error:", error)
            return {
                id: crypto.randomUUID(),
                text: "Lo siento, no puedo conectar con el servidor de soporte en este momento. Por favor, intenta más tarde o contáctanos por email.",
                sender: 'bot',
                timestamp: new Date(),
                isError: true
            }
        }
    }
}
