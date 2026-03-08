/**
 * Receipt Services - Firebase CRUD Operations
 */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  orderBy,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  Receipt,
  NewReceiptInput,
  ReceiptFilter,
  ReceiptStats,
} from "@/types/receipt";
import { ReceiptStatus, ReceiptPaymentMethod } from "@/types/receipt";

// Add a new receipt
export async function addReceipt(
  userId: string,
  receiptData: NewReceiptInput
): Promise<Receipt> {
  try {
    const docRef = await addDoc(collection(db, "receipts"), {
      ...receiptData,
      userId,
      issueDate:
        receiptData.issueDate instanceof Date
          ? Timestamp.fromDate(receiptData.issueDate)
          : receiptData.issueDate,
      dueDate:
        receiptData.dueDate instanceof Date
          ? Timestamp.fromDate(receiptData.dueDate)
          : receiptData.dueDate || null,
      paymentDate:
        receiptData.paymentDate instanceof Date
          ? Timestamp.fromDate(receiptData.paymentDate)
          : receiptData.paymentDate || null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: receiptData.status || ReceiptStatus.DRAFT,
    });

    const receipt = await getReceiptById(docRef.id, userId);
    if (!receipt) throw new Error("Failed to retrieve created receipt");
    return receipt;
  } catch (error) {
    console.error("Error adding receipt:", error);
    throw error;
  }
}

// Update a receipt
export async function updateReceipt(
  receiptId: string,
  userId: string,
  updates: Partial<NewReceiptInput>
): Promise<Receipt> {
  try {
    const receiptRef = doc(db, "receipts", receiptId);
    
    // Create a clean object without undefined values
    const cleanUpdates: Record<string, unknown> = {};
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    });

    const updatedData: Record<string, unknown> = {
      ...cleanUpdates,
      updatedAt: Timestamp.now(),
    };

    // Convert date fields to Timestamps
    if (cleanUpdates.issueDate !== undefined) {
      updatedData.issueDate =
        cleanUpdates.issueDate instanceof Date
          ? Timestamp.fromDate(cleanUpdates.issueDate as Date)
          : cleanUpdates.issueDate;
    }
    if (cleanUpdates.dueDate !== undefined) {
      updatedData.dueDate =
        cleanUpdates.dueDate instanceof Date
          ? Timestamp.fromDate(cleanUpdates.dueDate as Date)
          : cleanUpdates.dueDate;
    }
    if (cleanUpdates.paymentDate !== undefined) {
      updatedData.paymentDate =
        cleanUpdates.paymentDate instanceof Date
          ? Timestamp.fromDate(cleanUpdates.paymentDate as Date)
          : cleanUpdates.paymentDate;
    }

    await updateDoc(receiptRef, updatedData);
    const receipt = await getReceiptById(receiptId, userId);
    if (!receipt) throw new Error("Failed to retrieve updated receipt");
    return receipt;
  } catch (error) {
    console.error("Error updating receipt:", error);
    throw error;
  }
}

// Delete a receipt
export async function deleteReceipt(
  receiptId: string,
  userId: string
): Promise<void> {
  try {
    const receiptRef = doc(db, "receipts", receiptId);
    // Verify ownership before deleting
    const receipt = await getReceiptById(receiptId, userId);
    if (!receipt) {
      throw new Error("Receipt not found or access denied");
    }
    await deleteDoc(receiptRef);
  } catch (error) {
    console.error("Error deleting receipt:", error);
    throw error;
  }
}

// Get receipt by ID
export async function getReceiptById(
  receiptId: string,
  userId: string
): Promise<Receipt | null> {
  try {
    const docRef = doc(db, "receipts", receiptId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    if (data.userId !== userId) return null; // Ownership check

    return formatReceipt({ ...data, id: docSnap.id });
  } catch (error) {
    console.error("Error getting receipt:", error);
    throw error;
  }
}

// Get all receipts for a user
export async function getReceiptsByUser(userId: string): Promise<Receipt[]> {
  try {
    const constraints: QueryConstraint[] = [
      where("userId", "==", userId),
      orderBy("issueDate", "desc"),
    ];

    const q = query(collection(db, "receipts"), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) =>
      formatReceipt({ ...doc.data(), id: doc.id })
    );
  } catch (error) {
    console.error("Error getting receipts by user:", error);
    throw error;
  }
}

// Generate next receipt number
export async function getNextReceiptNumber(userId: string): Promise<string> {
  try {
    const receipts = await getReceiptsByUser(userId);
    
    if (receipts.length === 0) {
      return "RCP-001";
    }

    // Find the highest receipt number
    let maxNumber = 0;
    receipts.forEach((receipt) => {
      const match = receipt.receiptNumber.match(/RCP-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) {
          maxNumber = num;
        }
      }
    });

    // Increment and format
    const nextNumber = maxNumber + 1;
    return `RCP-${String(nextNumber).padStart(3, "0")}`;
  } catch (error) {
    console.error("Error generating next receipt number:", error);
    return "RCP-001";
  }
}

// Get receipts by client
export async function getReceiptsByClient(
  userId: string,
  clientId: string
): Promise<Receipt[]> {
  try {
    const constraints: QueryConstraint[] = [
      where("userId", "==", userId),
      where("clientId", "==", clientId),
      orderBy("issueDate", "desc"),
    ];

    const q = query(collection(db, "receipts"), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) =>
      formatReceipt({ ...doc.data(), id: doc.id })
    );
  } catch (error) {
    console.error("Error getting receipts by client:", error);
    throw error;
  }
}

// Search receipts
export async function searchReceipts(
  userId: string,
  searchTerm: string
): Promise<Receipt[]> {
  try {
    const constraints: QueryConstraint[] = [where("userId", "==", userId)];

    const q = query(collection(db, "receipts"), ...constraints);
    const querySnapshot = await getDocs(q);

    const receipts = querySnapshot.docs.map((doc) =>
      formatReceipt({ ...doc.data(), id: doc.id })
    );

    // Client-side filtering for search
    const searchLower = searchTerm.toLowerCase();
    return receipts.filter(
      (r) =>
        r.receiptNumber.toLowerCase().includes(searchLower) ||
        r.clientName.toLowerCase().includes(searchLower) ||
        r.clientEmail?.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error("Error searching receipts:", error);
    throw error;
  }
}

// Filter receipts
export async function filterReceipts(
  userId: string,
  filter: ReceiptFilter
): Promise<Receipt[]> {
  try {
    const constraints: QueryConstraint[] = [where("userId", "==", userId)];

    if (filter.status) {
      constraints.push(where("status", "==", filter.status));
    }
    if (filter.clientId) {
      constraints.push(where("clientId", "==", filter.clientId));
    }
    if (filter.paymentMethod) {
      constraints.push(where("paymentMethod", "==", filter.paymentMethod));
    }

    const q = query(collection(db, "receipts"), ...constraints);
    let receipts = await getDocs(q).then((snapshot) =>
      snapshot.docs.map((doc) => formatReceipt({ ...doc.data(), id: doc.id }))
    );

    // Client-side date filtering
    if (filter.startDate) {
      receipts = receipts.filter((r) => r.issueDate >= filter.startDate!);
    }
    if (filter.endDate) {
      receipts = receipts.filter((r) => r.issueDate <= filter.endDate!);
    }

    // Client-side search filtering
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      receipts = receipts.filter(
        (r) =>
          r.receiptNumber.toLowerCase().includes(searchLower) ||
          r.clientName.toLowerCase().includes(searchLower)
      );
    }

    return receipts;
  } catch (error) {
    console.error("Error filtering receipts:", error);
    throw error;
  }
}

// Update receipt status
export async function updateReceiptStatus(
  receiptId: string,
  userId: string,
  status: ReceiptStatus
): Promise<Receipt> {
  try {
    return await updateReceipt(receiptId, userId, { status } as NewReceiptInput);
  } catch (error) {
    console.error("Error updating receipt status:", error);
    throw error;
  }
}

// Get receipt statistics
export async function getReceiptStats(userId: string): Promise<ReceiptStats> {
  try {
    const receipts = await getReceiptsByUser(userId);

    const stats: ReceiptStats = {
      totalReceipts: receipts.length,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      draftCount: 0,
      issuedCount: 0,
    };

    receipts.forEach((receipt) => {
      stats.totalAmount += receipt.total;

      if (receipt.status === ReceiptStatus.PAID) {
        stats.paidAmount += receipt.total;
      } else if (receipt.status === ReceiptStatus.PENDING) {
        stats.pendingAmount += receipt.total;
      }

      if (receipt.status === ReceiptStatus.DRAFT) {
        stats.draftCount += 1;
      }
      if (receipt.status === ReceiptStatus.ISSUED) {
        stats.issuedCount += 1;
      }
    });

    return stats;
  } catch (error) {
    console.error("Error getting receipt stats:", error);
    throw error;
  }
}

// Helper function to format receipt data
function formatReceipt(data: Record<string, unknown>): Receipt {
  const toDate = (value: unknown): Date | undefined => {
    if (!value) return undefined;
    if (value instanceof Timestamp) return value.toDate();
    if (value instanceof Date) return value;
    if (typeof value === "string") return new Date(value);
    return undefined;
  };

  return {
    id: String(data.id),
    receiptNumber: String(data.receiptNumber),
    userId: String(data.userId),
    clientId: String(data.clientId),
    clientName: String(data.clientName),
    clientEmail: data.clientEmail ? String(data.clientEmail) : undefined,
    items: Array.isArray(data.items) ? data.items : [],
    subtotal: Number(data.subtotal) || 0,
    tax: Number(data.tax) || 0,
    taxRate: Number(data.taxRate) || 0,
    total: Number(data.total) || 0,
    status: (data.status as ReceiptStatus) || ReceiptStatus.DRAFT,
    paymentMethod: data.paymentMethod as ReceiptPaymentMethod,
    paymentDate: toDate(data.paymentDate),
    issueDate: toDate(data.issueDate) || new Date(),
    dueDate: toDate(data.dueDate),
    notes: data.notes ? String(data.notes) : undefined,
    internalNotes: data.internalNotes ? String(data.internalNotes) : undefined,
    attachments: Array.isArray(data.attachments) ? data.attachments : [],
    createdAt: toDate(data.createdAt) || new Date(),
    updatedAt: toDate(data.updatedAt) || new Date(),
  };
}
