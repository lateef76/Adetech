import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

interface SalesTrendData {
  week: string;
  sales: number;
  target: number;
}

interface SalesTrendChartData {
  data: SalesTrendData[];
  loading: boolean;
  error: string | null;
}

export function useSalesTrendData(): SalesTrendChartData {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<SalesTrendChartData>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchSalesTrend = async () => {
      if (!user) return;

      try {
        setChartData((prev) => ({ ...prev, loading: true, error: null }));

        // Get current date and calculate 8 weeks back
        const today = new Date();
        const eightWeeksAgo = new Date(today.getTime() - 8 * 7 * 24 * 60 * 60 * 1000);

        // Fetch invoices for current user from last 8 weeks
        const invoicesQuery = query(
          collection(db, "invoices"),
          where("userId", "==", user.uid)
        );
        const invoicesDocs = await getDocs(invoicesQuery);

        // Calculate sales by week
        const weeklySales: Record<number, number> = {};
        const weeks: string[] = [];

        // Initialize weeks
        for (let i = 0; i < 8; i++) {
          weeks.push(`W${i + 1}`);
          weeklySales[i] = 0;
        }

        // Calculate sales for each week
        invoicesDocs.forEach((doc) => {
          const data = doc.data();
          const invoiceDate = data.date ? new Date(data.date.toDate()) : new Date();

          if (invoiceDate >= eightWeeksAgo && invoiceDate <= today) {
            const weeksAgo = Math.floor(
              (today.getTime() - invoiceDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
            );

            if (weeksAgo < 8) {
              weeklySales[7 - weeksAgo] += data.total || 0;
            }
          }
        });

        // Create target data (20% higher than average sales or 200 default)
        const avgSales =
          Object.values(weeklySales).reduce((a, b) => a + b, 0) / 8 || 0;
        const targetPerWeek = Math.max(avgSales * 1.2, 200);

        const formattedData = weeks.map((week, index) => ({
          week,
          sales: weeklySales[index],
          target: targetPerWeek,
        }));

        setChartData({
          data: formattedData,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching sales trend:", error);
        setChartData({
          data: [],
          loading: false,
          error: error instanceof Error ? error.message : "Failed to fetch data",
        });
      }
    };

    fetchSalesTrend();
  }, [user]);

  return chartData;
}
