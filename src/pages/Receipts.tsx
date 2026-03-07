/**
 * Receipts Page - Phase 5
 * Displays all receipts with CRUD functionality
 */

import { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ReceiptsPage() {
  const [showNewReceiptDialog, setShowNewReceiptDialog] = useState(false);

  const handleNewReceipt = () => {
    setShowNewReceiptDialog(true);
  };

  return (
    <MainLayout>
      <DashboardHeader
        title="Receipts"
        description="Create, manage, and track your receipts and invoices"
      />

      <div className="space-y-6">
        {/* Header with Action Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            All Receipts
          </h2>
          <Button
            onClick={handleNewReceipt}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Receipt
          </Button>
        </div>

        {/* Placeholder Content */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Receipts feature coming soon in Phase 5
          </p>
        </div>

        {/* New Receipt Dialog Placeholder */}
        {showNewReceiptDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                New Receipt
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Receipt creation form coming soon in Phase 5
              </p>
              <Button
                onClick={() => setShowNewReceiptDialog(false)}
                variant="outline"
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
