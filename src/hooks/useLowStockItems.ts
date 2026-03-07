import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

interface LowStockItem {
  id: string;
  name: string;
  stock: number;
  threshold: number;
  sku?: string;
}

interface UseLowStockItemsReturn {
  items: LowStockItem[];
  loading: boolean;
  error: string | null;
}

export function useLowStockItems(): UseLowStockItemsReturn {
  const { user } = useAuth();
  const [items, setItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLowStockItems = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch all products
        const productsQuery = query(collection(db, "products"));
        const productsDocs = await getDocs(productsQuery);

        const lowStockList: LowStockItem[] = [];

        productsDocs.forEach((doc) => {
          const data = doc.data();
          const stock = Number(data.stock) || 0;
          const threshold = Number(data.reorderLevel) || Number(data.threshold) || 20;

          // Add to low stock list if stock is below threshold
          if (stock < threshold) {
            lowStockList.push({
              id: doc.id,
              name: data.name || "Unknown Product",
              stock: stock,
              threshold: threshold,
              sku: data.sku,
            });
          }
        });

        // Sort by stock level (lowest first)
        lowStockList.sort((a, b) => a.stock - b.stock);

        setItems(lowStockList.slice(0, 4)); // Show top 4 low stock items
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch low stock items");
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockItems();
  }, [user]);

  return { items, loading, error };
}
