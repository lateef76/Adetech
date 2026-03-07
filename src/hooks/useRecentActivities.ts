import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

interface RecentActivity {
  id: string;
  action: string;
  item: string;
  time: string;
  type: "product" | "invoice" | "client" | "stock" | "order";
}

interface UseRecentActivitiesReturn {
  activities: RecentActivity[];
  loading: boolean;
  error: string | null;
}

export function useRecentActivities(): UseRecentActivitiesReturn {
  const { user } = useAuth();
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch recent invoices
        const invoicesQuery = query(
          collection(db, "invoices"),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const invoicesDocs = await getDocs(invoicesQuery);

        // Fetch recent products
        const productsQuery = query(
          collection(db, "products"),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const productsDocs = await getDocs(productsQuery);

        // Fetch recent clients
        const clientsQuery = query(
          collection(db, "clients"),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const clientsDocs = await getDocs(clientsQuery);

        const activitiesList: RecentActivity[] = [];

        // Add invoices
        invoicesDocs.forEach((doc) => {
          const data = doc.data();
          activitiesList.push({
            id: doc.id,
            action: "Invoice generated",
            item: data.invoiceNumber || `INV-${doc.id.slice(0, 6)}`,
            time: data.createdAt ? formatTime(data.createdAt) : "Just now",
            type: "invoice",
          });
        });

        // Add products
        productsDocs.forEach((doc) => {
          const data = doc.data();
          activitiesList.push({
            id: doc.id,
            action: "Product added",
            item: data.name || "New Product",
            time: data.createdAt ? formatTime(data.createdAt) : "Just now",
            type: "product",
          });
        });

        // Add clients
        clientsDocs.forEach((doc) => {
          const data = doc.data();
          activitiesList.push({
            id: doc.id,
            action: "New client registered",
            item: data.name || "New Client",
            time: data.createdAt ? formatTime(data.createdAt) : "Just now",
            type: "client",
          });
        });

        // Sort by time and limit to 5
        activitiesList.sort((a, b) => {
          const timeA = parseTime(a.time);
          const timeB = parseTime(b.time);
          return timeB - timeA;
        });

        setActivities(activitiesList.slice(0, 5));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  return { activities, loading, error };
}

function formatTime(timestamp: Record<string, unknown> | undefined): string {
  if (!timestamp) return "Just now";

  let date: Date;
  if (typeof timestamp === "object" && "toDate" in timestamp) {
    date = (timestamp.toDate as () => Date)();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    return "Just now";
  }

  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

function parseTime(timeStr: string): number {
  const now = new Date().getTime();

  if (timeStr.includes("min ago")) {
    const mins = parseInt(timeStr);
    return now - mins * 60000;
  }
  if (timeStr.includes("h ago")) {
    const hours = parseInt(timeStr);
    return now - hours * 3600000;
  }
  if (timeStr.includes("d ago")) {
    const days = parseInt(timeStr);
    return now - days * 86400000;
  }

  return now;
}
