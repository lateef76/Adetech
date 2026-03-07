/**
 * Client Types & Interfaces
 */

export type ClientType = 'professional' | 'individual'

export interface Client {
  id: string
  userId: string
  name: string
  phone?: string
  email?: string
  address?: string
  city?: string
  client_type: ClientType
  tax_id?: string // For professionals
  total_purchases?: number
  last_purchase_date?: Date | string
  created_at: Date | string
  updated_at?: Date | string
}

export interface NewClientInput {
  name: string
  phone?: string
  email?: string
  address?: string
  city?: string
  client_type: ClientType
  tax_id?: string
}

export interface ClientFilter {
  search?: string
  type?: ClientType | 'all'
  sortBy?: 'name' | 'recent' | 'purchases'
}
