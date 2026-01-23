export type Organization = {
    id: string
    name: string
    slug: string
    owner_id: string
    created_at: string
}

export type OrganizationMember = {
    id: string
    organization_id: string
    user_id: string
    role: 'owner' | 'admin' | 'member'
    created_at: string
}
