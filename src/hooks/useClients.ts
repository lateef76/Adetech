/**
 * Hook: useClients
 * Fetches all clients for the authenticated user
 */

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import { getClientsByUser } from '../services/clients'
import type { Client } from '../types/client'

interface UseClientsState {
  clients: Client[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useClients = (): UseClientsState => {
  const { user } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchClients = useCallback(async () => {
    if (!user?.uid) {
      setClients([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await getClientsByUser(user.uid)
      setClients(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch clients'))
      console.error('Error fetching clients:', err)
    } finally {
      setLoading(false)
    }
  }, [user?.uid])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  return {
    clients,
    loading,
    error,
    refetch: fetchClients,
  }
}
