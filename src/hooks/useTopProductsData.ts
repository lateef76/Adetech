import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

interface ProductSalesData {
  name: string;
  sales: number;
}

interface TopProductsChartData {
  data: ProductSalesData[];
  loading: boolean;
  error: string | null;
}

export function useTopProductsData(): TopProductsChartData {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<TopProductsChartData>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchTopProducts = async () => {
      if (!user) return;

      try {
        setChartData((prev) => ({ ...prev, loading: true, error: null }));

        // Fetch invoices with line items for current user
        const invoicesQuery = query(
          collection(db, "invoices"),
          where("userId", "==", user.uid)
        );
        const invoicesDocs = await getDocs(invoicesQuery);

        // Calculate sales by product
        const productSales: Record<string, number> = {};

        invoicesDocs.forEach((doc) => {
          const data = doc.data();
          const items = data.items || [];

          items.forEach(
            (item: { productName: string; quantity: number; price: number }) => {
              const productName = item.productName || "Unknown";
              const quantity = item.quantity || 0;

              if (!productSales[productName]) {
                productSales[productName] = 0;
              }
              productSales[productName] += quantity;
            }
          );
        });

        // Convert to array and sort by sales (descending)
        const sortedProducts = Object.entries(productSales)
          .map(([name, sales]) => ({ name, sales }))
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 6); // Top 6 products

        setChartData({
          data: sortedProducts,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching top products:", error);
        setChartData({
          data: [],
          loading: false,
          error: error instanceof Error ? error.message : "Failed to fetch data",
        });
      }
    };

    fetchTopProducts();
  }, [user]);

  return chartData;
}
