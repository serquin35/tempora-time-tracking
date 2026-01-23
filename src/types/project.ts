export type Project = {
    id: string
    organization_id: string
    name: string
    color: string
    hourly_rate: number
    status: 'active' | 'archived'
    created_at: string
}
