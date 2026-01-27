import { supabase } from "@/lib/supabase"
import type { ChatMessage } from "@/types/chat"

// Fallback URL for development if env var is missing
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "https://n8n.cheosdesign.info/webhook/tempora"

export const chatService = {
    async getChatHistory(userId: string, conversationId: string): Promise<ChatMessage[]> {
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('user_id', userId)
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true })

            if (error) throw error

            return data.map(m => ({
                id: m.id,
                text: m.text,
                sender: m.sender as 'user' | 'bot',
                timestamp: new Date(m.created_at)
            }))
        } catch (error) {
            console.error("Error fetching chat history:", error)
            return []
        }
    },

    async sendMessage(text: string, userId: string, conversationId: string): Promise<ChatMessage> {
        try {
            // 1. Save user message to Supabase
            await supabase.from('chat_messages').insert({
                user_id: userId,
                sender: 'user',
                text: text.trim(),
                conversation_id: conversationId
            })

            // 2. Send to n8n
            const response = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    userId: userId,
                    conversationId: conversationId,
                    timestamp: new Date().toISOString(),
                    context: {
                        page: window.location.pathname,
                        platform: "web"
                    }
                }),
            })

            if (!response.ok) throw new Error("Error connecting to support")

            const data = await response.json()

            // Handle both object and array response from n8n
            const responseData = Array.isArray(data) ? data[0] : data
            const botResponse = responseData?.output || responseData?.text || "Lo siento, no he recibido una respuesta válida."

            // 3. Save bot response to Supabase
            const { data: savedBotMsg, error: saveError } = await supabase
                .from('chat_messages')
                .insert({
                    user_id: userId,
                    sender: 'bot',
                    text: botResponse,
                    conversation_id: conversationId
                })
                .select()
                .single()

            if (saveError) throw saveError

            return {
                id: savedBotMsg.id,
                text: botResponse,
                sender: 'bot',
                timestamp: new Date(savedBotMsg.created_at),
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
    },

    async clearChatHistory(userId: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('chat_messages')
                .delete()
                .eq('user_id', userId)

            if (error) throw error
            return true
        } catch (error) {
            console.error("Error clearing chat history:", error)
            return false
        }
    }
}
