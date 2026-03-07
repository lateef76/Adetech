import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

interface DashboardStats {
  products: number;
  clients: number;
  invoices: number;
  revenue: number;
  loading: boolean;
  error: string | null;
}

export function useDashboardStats(): DashboardStats {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    clients: 0,
    invoices: 0,
    revenue: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        setStats((prev) => ({ ...prev, loading: true, error: null }));

        // Fetch products count
        const productsQuery = query(collection(db, "products"));
        const productsDocs = await getDocs(productsQuery);
        const productsCount = productsDocs.size;

        // Fetch clients count (for current user)
        const clientsQuery = query(
          collection(db, "clients"),
          where("userId", "==", user.uid)
        );
        const clientsDocs = await getDocs(clientsQuery);
        const clientsCount = clientsDocs.size;

        // Fetch invoices count and calculate revenue
        const invoicesQuery = query(
          collection(db, "invoices"),
          where("userId", "==", user.uid)
        );
        const invoicesDocs = await getDocs(invoicesQuery);
        const invoicesCount = invoicesDocs.size;

        // Calculate total revenue from invoices
        let totalRevenue = 0;
        invoicesDocs.forEach((doc) => {
          const data = doc.data();
          if (data.totalAmount) {
            totalRevenue += Number(data.totalAmount) || 0;
          }
        });

        setStats({
          products: productsCount,
          clients: clientsCount,
          invoices: invoicesCount,
          revenue: totalRevenue,
          loading: false,
          error: null,
        });
      } catch (error) {
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to fetch stats",
        }));
      }
    };

    fetchStats();
  }, [user]);

  return stats;
}
