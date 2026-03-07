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
import type { Product } from "./useProducts";

export function useProductMutations() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addProduct = useCallback(
    async (formData: Partial<Product>) => {
      if (!user) throw new Error("User not authenticated");

      setIsLoading(true);
      setError(null);

      try {
        // Add product to Firestore
        const docRef = await addDoc(collection(db, "products"), {
          ...formData,
          userId: user.uid,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        return docRef.id;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to add product";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const updateProduct = useCallback(
    async (productId: string, formData: Partial<Product>) => {
      if (!user) throw new Error("User not authenticated");

      setIsLoading(true);
      setError(null);

      try {
        // Update product in Firestore
        const productRef = doc(db, "products", productId);
        await updateDoc(productRef, {
          ...formData,
          updatedAt: Timestamp.now(),
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update product";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const deleteProduct = useCallback(
    async (productId: string) => {
      if (!user) throw new Error("User not authenticated");

      setIsLoading(true);
      setError(null);

      try {
        // Delete Firestore document
        const productRef = doc(db, "products", productId);
        await deleteDoc(productRef);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete product";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  return {
    addProduct,
    updateProduct,
    deleteProduct,
    isLoading,
    error,
  };
}
