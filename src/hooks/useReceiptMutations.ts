/**
 * useReceiptMutations Hook - Handle receipt mutations with toast notifications
 */

import { useState } from "react";
import { useAuth } from "./useAuth";
import {
  addReceipt,
  updateReceipt,
  deleteReceipt,
  updateReceiptStatus,
} from "@/services/receipts";
import type { NewReceiptInput, ReceiptStatus } from "@/types/receipt";
import { toast } from "sonner";

export function useReceiptMutations() {
  const { user } = useAuth();
  const [addingReceipt, setAddingReceipt] = useState(false);
  const [updatingReceipt, setUpdatingReceipt] = useState(false);
  const [deletingReceipt, setDeletingReceipt] = useState(false);

  const handleAddReceipt = async (receiptData: NewReceiptInput) => {
    if (!user) {
      toast.error("Not authenticated");
      return null;
    }

    try {
      setAddingReceipt(true);
      const newReceipt = await addReceipt(user.uid, receiptData);
      toast.success("Receipt created successfully");
      return newReceipt;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create receipt";
      toast.error(message);
      console.error("Error adding receipt:", error);
      return null;
    } finally {
      setAddingReceipt(false);
    }
  };

  const handleUpdateReceipt = async (
    receiptId: string,
    updates: Partial<NewReceiptInput>
  ) => {
    if (!user) {
      toast.error("Not authenticated");
      return null;
    }

    try {
      setUpdatingReceipt(true);
      const updatedReceipt = await updateReceipt(receiptId, user.uid, updates);
      toast.success("Receipt updated successfully");
      return updatedReceipt;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update receipt";
      toast.error(message);
      console.error("Error updating receipt:", error);
      return null;
    } finally {
      setUpdatingReceipt(false);
    }
  };

  const handleDeleteReceipt = async (receiptId: string) => {
    if (!user) {
      toast.error("Not authenticated");
      return false;
    }

    try {
      setDeletingReceipt(true);
      await deleteReceipt(receiptId, user.uid);
      toast.success("Receipt deleted successfully");
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete receipt";
      toast.error(message);
      console.error("Error deleting receipt:", error);
      return false;
    } finally {
      setDeletingReceipt(false);
    }
  };

  const handleUpdateReceiptStatus = async (
    receiptId: string,
    status: ReceiptStatus
  ) => {
    if (!user) {
      toast.error("Not authenticated");
      return null;
    }

    try {
      setUpdatingReceipt(true);
      const updatedReceipt = await updateReceiptStatus(
        receiptId,
        user.uid,
        status
      );
      toast.success(`Receipt marked as ${status}`);
      return updatedReceipt;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update receipt";
      toast.error(message);
      console.error("Error updating receipt status:", error);
      return null;
    } finally {
      setUpdatingReceipt(false);
    }
  };

  return {
    handleAddReceipt,
    handleUpdateReceipt,
    handleDeleteReceipt,
    handleUpdateReceiptStatus,
    addingReceipt,
    updatingReceipt,
    deletingReceipt,
  };
}
