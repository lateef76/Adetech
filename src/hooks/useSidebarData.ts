import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

interface SidebarCounts {
  invoices: number;
  products: number;
  orders: number;
  notifications: number;
  loading: boolean;
  error: string | null;
}

export function useSidebarData(): SidebarCounts {
  const { user } = useAuth();
  const [counts, setCounts] = useState<SidebarCounts>({
    invoices: 0,
    products: 0,
    orders: 0,
    notifications: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      if (!user) return;

      try {
        setCounts((prev) => ({ ...prev, loading: true, error: null }));

        // Fetch invoices count (for current user)
        const invoicesQuery = query(
          collection(db, "invoices"),
          where("userId", "==", user.uid)
        );
        const invoicesDocs = await getDocs(invoicesQuery);
        const invoiceCount = invoicesDocs.size;

        // Fetch products count (admin-only data)
        const productsQuery = query(collection(db, "products"));
        const productsDocs = await getDocs(productsQuery);
        const productCount = productsDocs.size;

        // Fetch orders count (for current user)
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        const ordersDocs = await getDocs(ordersQuery);
        const orderCount = ordersDocs.size;

        // Fetch notifications count (for current user - unread)
        const notificationsQuery = query(
          collection(db, "notifications"),
          where("userId", "==", user.uid),
          where("read", "==", false)
        );
        const notificationsDocs = await getDocs(notificationsQuery);
        const notificationCount = notificationsDocs.size;

        setCounts({
          invoices: invoiceCount,
          products: productCount,
          orders: orderCount,
          notifications: notificationCount,
          loading: false,
          error: null,
        });
      } catch (error) {
        setCounts((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to fetch data",
        }));
      }
    };

    fetchCounts();
  }, [user]);

  return counts;
}
