import { useState, useEffect } from "react";
import { db } from "@/services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

interface RevenueData {
  month: string;
  revenue: number;
}

interface RevenueChartData {
  data: RevenueData[];
  loading: boolean;
  error: string | null;
}

export function useRevenueData(): RevenueChartData {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<RevenueChartData>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchRevenueData = async () => {
      if (!user) return;

      try {
        setChartData((prev) => ({ ...prev, loading: true, error: null }));

        // Fetch invoices for current user
        const invoicesQuery = query(
          collection(db, "invoices"),
          where("userId", "==", user.uid)
        );
        const invoicesDocs = await getDocs(invoicesQuery);

        // Group revenue by month
        const monthlyRevenue: Record<string, number> = {};
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        // Initialize all months with 0
        months.forEach((month) => {
          monthlyRevenue[month] = 0;
        });

        // Calculate revenue by month
        invoicesDocs.forEach((doc) => {
          const data = doc.data();
          const date = data.date ? new Date(data.date.toDate()) : new Date();
          const month = months[date.getMonth()];
          monthlyRevenue[month] += data.total || 0;
        });

        const formattedData = months.map((month) => ({
          month,
          revenue: monthlyRevenue[month],
        }));

        setChartData({
          data: formattedData,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setChartData({
          data: [],
          loading: false,
          error: error instanceof Error ? error.message : "Failed to fetch data",
        });
      }
    };

    fetchRevenueData();
  }, [user]);

  return chartData;
}
