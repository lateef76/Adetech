/**
 * NewReceipt Page - Create a new receipt in its own page
 */

import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { useAuth } from "@/hooks/useAuth";
import { useReceiptMutations } from "@/hooks/useReceiptMutations";
import { NewReceiptForm } from "@/components/receipts/NewReceiptForm";
import type { NewReceiptInput } from "@/types/receipt";

export function NewReceiptPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { handleAddReceipt } = useReceiptMutations();

  const handleSubmitReceipt = async (data: NewReceiptInput) => {
    const result = await handleAddReceipt(data);
    if (result) {
      // Navigate to the receipt details/preview page
      navigate(`/receipts/${result.id}`);
    }
  };

  const handleCancel = () => {
    navigate("/receipts");
  };

  return (
    <MainLayout>
      <DashboardHeader
        title="Create Receipt"
        description="Fill in the details below to create a new receipt"
        userName={user?.displayName || user?.email || "User"}
      />

      <NewReceiptForm onSubmit={handleSubmitReceipt} onCancel={handleCancel} />
    </MainLayout>
  );
}
