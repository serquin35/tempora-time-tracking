export interface Feedback {
    id: string
    user_id: string
    type: 'bug' | 'feature' | 'other'
    message: string
    created_at: string
    status: 'pending' | 'reviewed' | 'resolved'
}
