export interface ChatMessage {
    id: string
    text: string
    sender: 'user' | 'bot'
    timestamp: Date
    isError?: boolean
}

export interface ChatState {
    messages: ChatMessage[]
    isOpen: boolean
    isTyping: boolean
}

export interface N8nResponse {
    text?: string
    output?: string
    action?: string
    metadata?: any
}
