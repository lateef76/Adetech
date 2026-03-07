import { useCallback, useEffect, useState } from "react";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useAuth } from "./useAuth";

export interface LineItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  date: Date;
  dueDate: Date;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  notes: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useInvoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    if (!user) {
      setInvoices([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const invoicesRef = collection(db, "invoices");
      const q = query(invoicesRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const fetchedInvoices: Invoice[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          invoiceNumber: data.invoiceNumber,
          clientId: data.clientId,
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
          dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate() : new Date(data.dueDate),
          status: data.status,
          lineItems: data.lineItems || [],
          subtotal: data.subtotal,
          taxRate: data.taxRate,
          taxAmount: data.taxAmount,
          discountAmount: data.discountAmount,
          total: data.total,
          notes: data.notes || "",
          userId: data.userId,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
        } as Invoice;
      });

      setInvoices(fetchedInvoices);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch invoices";
      setError(errorMessage);
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return { invoices, loading, error, refetch: fetchInvoices };
}
