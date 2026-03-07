/**
 * Firestore Client Service
 * Handles all client CRUD operations
 */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  getDoc,
  QueryConstraint,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Client, NewClientInput } from '../types/client'

const CLIENTS_COLLECTION = 'clients'

/**
 * Add new client to Firestore
 */
export const addClient = async (userId: string, clientData: NewClientInput): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, CLIENTS_COLLECTION), {
      ...clientData,
      userId,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
      total_purchases: 0,
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding client:', error)
    throw error
  }
}

/**
 * Update existing client
 */
export const updateClient = async (clientId: string, clientData: Partial<NewClientInput>): Promise<void> => {
  try {
    const docRef = doc(db, CLIENTS_COLLECTION, clientId)
    await updateDoc(docRef, {
      ...clientData,
      updated_at: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating client:', error)
    throw error
  }
}

/**
 * Delete client
 */
export const deleteClient = async (clientId: string): Promise<void> => {
  try {
    const docRef = doc(db, CLIENTS_COLLECTION, clientId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting client:', error)
    throw error
  }
}

/**
 * Get all clients for a user
 */
export const getClientsByUser = async (userId: string): Promise<Client[]> => {
  try {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      orderBy('created_at', 'desc'),
    ]
    const q = query(collection(db, CLIENTS_COLLECTION), ...constraints)
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate() || new Date(),
      updated_at: doc.data().updated_at?.toDate() || new Date(),
    })) as Client[]
  } catch (error) {
    console.error('Error fetching clients:', error)
    throw error
  }
}

/**
 * Get single client by ID
 */
export const getClientById = async (clientId: string): Promise<Client | null> => {
  try {
    const docRef = doc(db, CLIENTS_COLLECTION, clientId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return null

    return {
      id: docSnap.id,
      ...docSnap.data(),
      created_at: docSnap.data().created_at?.toDate() || new Date(),
      updated_at: docSnap.data().updated_at?.toDate() || new Date(),
    } as Client
  } catch (error) {
    console.error('Error fetching client:', error)
    throw error
  }
}

/**
 * Search clients by name, email, or phone
 */
export const searchClients = async (userId: string, searchTerm: string): Promise<Client[]> => {
  try {
    const clients = await getClientsByUser(userId)
    const term = searchTerm.toLowerCase()

    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(term) ||
        client.email?.toLowerCase().includes(term) ||
        client.phone?.includes(term)
    )
  } catch (error) {
    console.error('Error searching clients:', error)
    throw error
  }
}

/**
 * Get clients by type (professional/individual)
 */
export const getClientsByType = async (userId: string, type: 'professional' | 'individual'): Promise<Client[]> => {
  try {
    const q = query(
      collection(db, CLIENTS_COLLECTION),
      where('userId', '==', userId),
      where('client_type', '==', type),
      orderBy('created_at', 'desc')
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate() || new Date(),
      updated_at: doc.data().updated_at?.toDate() || new Date(),
    })) as Client[]
  } catch (error) {
    console.error('Error fetching clients by type:', error)
    throw error
  }
}

/**
 * Update client purchase stats
 */
export const updateClientPurchaseStats = async (
  clientId: string,
  totalSpent: number,
  lastPurchaseDate: Date
): Promise<void> => {
  try {
    const docRef = doc(db, CLIENTS_COLLECTION, clientId)
    await updateDoc(docRef, {
      total_purchases: totalSpent,
      last_purchase_date: Timestamp.fromDate(lastPurchaseDate),
      updated_at: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating client purchase stats:', error)
    throw error
  }
}
