import { useState, useEffect, useCallback } from "react";
import { db } from "@/services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  country: string;
  type: "individual" | "business";
  status: "active" | "inactive";
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UseClientsReturn {
  clients: Client[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useClients(): UseClientsReturn {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const clientsQuery = query(
        collection(db, "clients"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(clientsQuery);

      const clientsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          address: data.address,
          city: data.city,
          country: data.country,
          type: data.type,
          status: data.status,
          userId: data.userId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Client;
      });

      setClients(clientsData);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    loading,
    error,
    refetch: fetchClients,
  };
}
