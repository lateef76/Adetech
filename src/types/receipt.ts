/**
 * Receipt Type Definitions - Phase 5
 */

export const ReceiptStatus = {
  DRAFT: "draft",
  ISSUED: "issued",
  PAID: "paid",
  CANCELLED: "cancelled",
  PENDING: "pending",
} as const;

export type ReceiptStatus = (typeof ReceiptStatus)[keyof typeof ReceiptStatus];

export const ReceiptPaymentMethod = {
  CASH: "cash",
  CARD: "card",
  BANK_TRANSFER: "bank_transfer",
  CHECK: "check",
  OTHER: "other",
} as const;

export type ReceiptPaymentMethod =
  (typeof ReceiptPaymentMethod)[keyof typeof ReceiptPaymentMethod];

export interface ReceiptItem {
  itemId: string;
  productId?: string;
  productName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  userId: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  status: ReceiptStatus;
  paymentMethod: ReceiptPaymentMethod;
  paymentDate?: Date;
  issueDate: Date;
  dueDate?: Date;
  notes?: string;
  internalNotes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NewReceiptInput {
  receiptNumber: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  items: Omit<ReceiptItem, "itemId">[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  status?: ReceiptStatus;
  paymentMethod: ReceiptPaymentMethod;
  paymentDate?: Date;
  issueDate: Date;
  dueDate?: Date;
  notes?: string;
  internalNotes?: string;
  attachments?: string[];
}

export interface ReceiptFilter {
  status?: ReceiptStatus;
  clientId?: string;
  paymentMethod?: ReceiptPaymentMethod;
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
}

export interface ReceiptStats {
  totalReceipts: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  draftCount: number;
  issuedCount: number;
}
