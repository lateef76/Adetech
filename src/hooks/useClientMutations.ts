/**
 * Hook: useClientMutations
 * Handles add, update, delete operations for clients
 */

import { useState } from 'react'
import { useAuth } from './useAuth'
import { addClient, updateClient, deleteClient } from '../services/clients'
import type { NewClientInput } from '../types/client'
import { toast } from 'sonner'

interface UseClientMutationsState {
  addingClient: boolean
  updatingClient: boolean
  deletingClient: boolean
  error: Error | null
  handleAddClient: (data: NewClientInput) => Promise<string | null>
  handleUpdateClient: (clientId: string, data: Partial<NewClientInput>) => Promise<boolean>
  handleDeleteClient: (clientId: string) => Promise<boolean>
}

export const useClientMutations = (): UseClientMutationsState => {
  const { user } = useAuth()
  const [addingClient, setAddingClient] = useState(false)
  const [updatingClient, setUpdatingClient] = useState(false)
  const [deletingClient, setDeletingClient] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleAddClient = async (data: NewClientInput): Promise<string | null> => {
    if (!user?.uid) {
      toast.error('User not authenticated')
      return null
    }

    try {
      setAddingClient(true)
      setError(null)
      const clientId = await addClient(user.uid, data)
      toast.success('Client added successfully')
      return clientId
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add client'
      setError(err instanceof Error ? err : new Error(errorMsg))
      toast.error(errorMsg)
      console.error('Error adding client:', err)
      return null
    } finally {
      setAddingClient(false)
    }
  }

  const handleUpdateClient = async (clientId: string, data: Partial<NewClientInput>): Promise<boolean> => {
    try {
      setUpdatingClient(true)
      setError(null)
      await updateClient(clientId, data)
      toast.success('Client updated successfully')
      return true
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update client'
      setError(err instanceof Error ? err : new Error(errorMsg))
      toast.error(errorMsg)
      console.error('Error updating client:', err)
      return false
    } finally {
      setUpdatingClient(false)
    }
  }

  const handleDeleteClient = async (clientId: string): Promise<boolean> => {
    try {
      setDeletingClient(true)
      setError(null)
      await deleteClient(clientId)
      toast.success('Client deleted successfully')
      return true
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete client'
      setError(err instanceof Error ? err : new Error(errorMsg))
      toast.error(errorMsg)
      console.error('Error deleting client:', err)
      return false
    } finally {
      setDeletingClient(false)
    }
  }

  return {
    addingClient,
    updatingClient,
    deletingClient,
    error,
    handleAddClient,
    handleUpdateClient,
    handleDeleteClient,
  }
}
