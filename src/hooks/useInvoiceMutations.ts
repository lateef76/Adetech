import { useCallback, useState } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useAuth } from "./useAuth";
import type { Invoice } from "./useInvoices";

export function useInvoiceMutations() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate invoice number (format: INV-YYYYMMDD-XXX)
  const generateInvoiceNumber = useCallback(() => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `INV-${date}-${random}`;
  }, []);

  const addInvoice = useCallback(
    async (formData: Partial<Invoice>) => {
      if (!user) throw new Error("User not authenticated");

      try {
        setIsLoading(true);
        setError(null);

        const invoiceData = {
          invoiceNumber: generateInvoiceNumber(),
          clientId: formData.clientId,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          date: Timestamp.fromDate(formData.date || new Date()),
          dueDate: Timestamp.fromDate(formData.dueDate || new Date()),
          status: "draft" as const,
          lineItems: formData.lineItems || [],
          subtotal: formData.subtotal || 0,
          taxRate: formData.taxRate || 0,
          taxAmount: formData.taxAmount || 0,
          discountAmount: formData.discountAmount || 0,
          total: formData.total || 0,
          notes: formData.notes || "",
          userId: user.uid,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        await addDoc(collection(db, "invoices"), invoiceData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create invoice";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user, generateInvoiceNumber]
  );

  const updateInvoice = useCallback(
    async (invoiceId: string, formData: Partial<Invoice>) => {
      if (!user) throw new Error("User not authenticated");

      try {
        setIsLoading(true);
        setError(null);

        const invoiceRef = doc(db, "invoices", invoiceId);
        const updateData = {
          clientId: formData.clientId,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          date: formData.date ? Timestamp.fromDate(formData.date) : undefined,
          dueDate: formData.dueDate ? Timestamp.fromDate(formData.dueDate) : undefined,
          status: formData.status,
          lineItems: formData.lineItems,
          subtotal: formData.subtotal,
          taxRate: formData.taxRate,
          taxAmount: formData.taxAmount,
          discountAmount: formData.discountAmount,
          total: formData.total,
          notes: formData.notes,
          updatedAt: Timestamp.now(),
        };

        // Remove undefined values
        Object.keys(updateData).forEach((key) => {
          if (updateData[key as keyof typeof updateData] === undefined) {
            delete updateData[key as keyof typeof updateData];
          }
        });

        await updateDoc(invoiceRef, updateData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update invoice";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const deleteInvoice = useCallback(
    async (invoiceId: string) => {
      if (!user) throw new Error("User not authenticated");

      try {
        setIsLoading(true);
        setError(null);

        const invoiceRef = doc(db, "invoices", invoiceId);
        await deleteDoc(invoiceRef);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete invoice";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  return { addInvoice, updateInvoice, deleteInvoice, isLoading, error };
}
