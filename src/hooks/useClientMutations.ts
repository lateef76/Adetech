import { useState, useCallback } from "react";
import { db } from "@/services/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "./useAuth";
import type { Client } from "./useClients";

export function useClientMutations() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addClient = useCallback(
    async (formData: Partial<Client>) => {
      if (!user) throw new Error("User not authenticated");

      setIsLoading(true);
      setError(null);

      try {
        // Add client to Firestore
        const docRef = await addDoc(collection(db, "clients"), {
          ...formData,
          userId: user.uid,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        return docRef.id;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to add client";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const updateClient = useCallback(
    async (clientId: string, formData: Partial<Client>) => {
      if (!user) throw new Error("User not authenticated");

      setIsLoading(true);
      setError(null);

      try {
        // Update client in Firestore
        const clientRef = doc(db, "clients", clientId);
        await updateDoc(clientRef, {
          ...formData,
          updatedAt: Timestamp.now(),
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update client";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const deleteClient = useCallback(
    async (clientId: string) => {
      if (!user) throw new Error("User not authenticated");

      setIsLoading(true);
      setError(null);

      try {
        // Delete Firestore document
        const clientRef = doc(db, "clients", clientId);
        await deleteDoc(clientRef);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete client";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  return {
    addClient,
    updateClient,
    deleteClient,
    isLoading,
    error,
  };
}
