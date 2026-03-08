/**
 * useReceipts Hook - Fetch receipts with caching
 */

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { getReceiptsByUser, getReceiptStats } from "@/services/receipts";
import type { Receipt, ReceiptStats } from "@/types/receipt";

export function useReceipts() {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [stats, setStats] = useState<ReceiptStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReceipts = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [fetchedReceipts, fetchedStats] = await Promise.all([
        getReceiptsByUser(user.uid),
        getReceiptStats(user.uid),
      ]);
      setReceipts(fetchedReceipts);
      setStats(fetchedStats);
      setError(null);
    } catch (err) {
      console.error("Error fetching receipts:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch receipts");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  return {
    receipts,
    stats,
    loading,
    error,
    refetch: fetchReceipts,
  };
}
