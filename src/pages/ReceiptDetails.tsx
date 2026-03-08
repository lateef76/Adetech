/**
 * Receipt Details Page - Preview and Actions
 * Modern & Classic White Paper Style Receipt Display
 */

import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Printer,
  Download,
  Share2,
  Mail,
  Check,
  FileDown,
} from "lucide-react";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useReceipts } from "@/hooks/useReceipts";
import { useReceiptMutations } from "@/hooks/useReceiptMutations";
import {
  printReceipt,
  downloadReceiptPDF,
  sendReceiptEmail,
} from "@/utils/receipt-utils";

export function ReceiptDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { settings } = useCompanySettings();
  const { receipts, loading } = useReceipts();
  const { handleUpdateReceiptStatus } = useReceiptMutations();
  const [copied, setCopied] = useState(false);
  const [showPaidOption, setShowPaidOption] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showStampPreview, setShowStampPreview] = useState(false);

  // Find the receipt
  const receipt = receipts.find((r) => r.id === id);

  const handlePrint = () => {
    if (receipt) {
      printReceipt(receipt, showStampPreview);
    }
  };

  const handleDownload = () => {
    if (receipt) {
      downloadReceiptPDF(receipt, false);
    }
  };

  const handleDownloadPaid = async () => {
    if (receipt) {
      setDownloading(true);
      try {
        // Download with paid stamp
        await downloadReceiptPDF(receipt, true);
        setShowPaidOption(false);
      } catch (error) {
        console.error("Error downloading:", error);
      } finally {
        setDownloading(false);
      }
    }
  };

  const handleMarkAsPaid = async () => {
    if (receipt) {
      try {
        await handleUpdateReceiptStatus(receipt.id, "paid");
        setShowPaidOption(false);
      } catch (error) {
        console.error("Error marking receipt as paid:", error);
      }
    }
  };

  const handleSendEmail = () => {
    if (receipt) {
      sendReceiptEmail(receipt);
    }
  };

  const handleShare = () => {
    const shareText = `Receipt #${receipt?.receiptNumber} - ${receipt?.clientName}`;
    if (navigator.share) {
      navigator.share({
        title: "Receipt",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (!receipt) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => navigate("/receipts")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Receipts
          </Button>
          <div className="text-center py-12">
            <p className="text-slate-500">Receipt not found</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    issued: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-SN", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <MainLayout>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header with Back Button */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/receipts")}
            className="bg-white hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Receipts
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              {receipt.receiptNumber}
            </h1>
            <Badge className={statusColors[receipt.status]}>
              {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Action Buttons - Dark Bar */}
        <div className="bg-linear-to-r from-slate-900 to-slate-800 rounded-lg p-4 flex flex-wrap gap-3 relative">
          <Button
            onClick={async () => {
              if (showStampPreview) {
                setShowStampPreview(false);
              } else {
                if (receipt.status !== "paid") {
                  await handleMarkAsPaid();
                }
                setShowStampPreview(true);
              }
            }}
            className={`gap-2 font-medium ${
              showStampPreview
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-white text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Check className="w-4 h-4" />
            {showStampPreview ? "Remove Stamp" : "Apply Stamp"}
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-white text-slate-900 hover:bg-slate-100 gap-2 font-medium"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10 gap-2 font-medium"
              onClick={() => setShowPaidOption(!showPaidOption)}
            >
              <Download className="w-4 h-4" />
              Download
            </Button>

            {/* Dropdown for Download Options */}
            {showPaidOption && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border border-slate-200 z-50 min-w-56"
              >
                <div className="p-2 space-y-1">
                  <Button
                    onClick={handleDownload}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-slate-900 hover:bg-slate-100 gap-2"
                    disabled={downloading}
                  >
                    <FileDown className="w-4 h-4" />
                    Download PDF
                  </Button>
                  {receipt?.status !== "paid" && (
                    <>
                      <Separator />
                      <Button
                        onClick={async () => {
                          setDownloading(true);
                          await handleMarkAsPaid();
                          setDownloading(false);
                        }}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-green-600 hover:bg-green-50 gap-2"
                        disabled={downloading}
                      >
                        <Check className="w-4 h-4" />
                        Mark as Paid & Download
                      </Button>
                    </>
                  )}
                  {receipt?.status === "paid" && (
                    <>
                      <Separator />
                      <Button
                        onClick={handleDownloadPaid}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-red-600 hover:bg-red-50 gap-2"
                        disabled={downloading}
                      >
                        <Check className="w-4 h-4" />
                        Download with PAID Stamp
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          <Button
            onClick={handleSendEmail}
            variant="outline"
            className="border-white text-white hover:bg-white/10 gap-2 font-medium"
          >
            <Mail className="w-4 h-4" />
            Send Email
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="border-white text-white hover:bg-white/10 gap-2 font-medium"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Share
              </>
            )}
          </Button>
        </div>

        {/* Receipt Preview - White Paper Style */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 relative">
          {/* Paid Stamp Overlay */}
          {showStampPreview && (
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: -15 }}
              className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center"
            >
              <div className="relative w-64 h-64">
                {/* Outer Circle */}
                <div className="absolute inset-0 rounded-full border-[6px] border-red-600 opacity-80" />
                {/* Inner Circle */}
                <div className="absolute inset-4 rounded-full border-[3px] border-red-600 opacity-80" />
                {/* PAID Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-black text-red-600 tracking-[0.2em] opacity-80">
                    PAID
                  </span>
                  <span className="text-sm text-red-600 mt-3 font-bold tracking-wide opacity-80">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
          {/* Receipt Content */}
          <div className="relative z-10 overflow-hidden rounded-xl">
            {/* Receipt Header Section */}
            <div className="p-10 border-b-2 border-slate-200 bg-linear-to-br from-slate-50 to-white">
              <div className="grid grid-cols-3 gap-8">
                {/* Company Info */}
                <div className="col-span-2">
                  <div className="mb-8">
                    <h2 className="text-4xl font-bold text-slate-900 mb-3">
                      {settings?.companyName || "AdeTech Business Solutions"}
                    </h2>
                    <div className="space-y-1">
                      {settings?.companyAddress && (
                        <p className="text-sm text-slate-600">
                          {settings.companyAddress}
                        </p>
                      )}
                      {settings?.companyPhone && (
                        <p className="text-sm text-slate-600">
                          {settings.companyPhone}
                        </p>
                      )}
                      {settings?.companyEmail && (
                        <p className="text-sm text-slate-600">
                          {settings.companyEmail}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Receipt Title & Number */}
                <div className="text-right">
                  <div className="text-5xl font-bold text-purple-600 mb-3 tracking-tight">
                    RECEIPT
                  </div>
                  <div className="text-lg font-semibold text-slate-900">
                    {receipt.receiptNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt Content */}
            <div className="p-10 space-y-8">
              {/* Receipt Info Grid */}
              <div className="grid grid-cols-2 gap-12">
                {/* Left Column - Dates & Payment */}
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Issue Date
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      {formatDate(receipt.issueDate)}
                    </p>
                  </div>
                  {receipt.dueDate && (
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Due Date
                      </p>
                      <p className="text-lg font-semibold text-slate-900">
                        {formatDate(receipt.dueDate)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column - Bill To */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    Bill To
                  </p>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-slate-900">
                      {receipt.clientName}
                    </p>
                    {receipt.clientEmail && (
                      <p className="text-sm text-slate-600">
                        {receipt.clientEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-200" />

              {/* Items Table */}
              <div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-300">
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipt.items.map((item) => (
                      <tr
                        key={item.itemId}
                        className="border-b border-slate-200"
                      >
                        <td className="py-4 px-4">
                          <p className="font-medium text-slate-900">
                            {item.productName}
                          </p>
                          {item.description && (
                            <p className="text-sm text-slate-500 mt-1">
                              {item.description}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right text-slate-900 font-medium">
                          {item.quantity}
                        </td>
                        <td className="py-4 px-4 text-right text-slate-900 font-medium">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-4 px-4 text-right text-slate-900 font-semibold">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Separator className="bg-slate-200" />

              {/* Totals Section */}
              <div className="flex justify-end">
                <div className="w-80">
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-slate-600 text-sm">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(receipt.subtotal)}
                      </span>
                    </div>
                    {receipt.taxRate > 0 && (
                      <div className="flex justify-between text-slate-600 text-sm">
                        <span>Tax ({receipt.taxRate}%)</span>
                        <span className="font-semibold text-slate-800">
                          {formatCurrency(receipt.tax)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-linear-to-r from-purple-600 to-indigo-600 p-5 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-purple-100 uppercase tracking-widest">
                        Total Amount Due
                      </span>
                      <span className="text-3xl font-extrabold text-white">
                        {formatCurrency(receipt.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <Separator className="bg-slate-200 mb-6" />
                <div className="grid grid-cols-2 gap-8 text-sm">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Payment Method
                    </p>
                    <p className="text-slate-900 font-medium capitalize">
                      {receipt.paymentMethod.replace("_", " ")}
                    </p>
                  </div>
                  {receipt.paymentDate && (
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Payment Date
                      </p>
                      <p className="text-slate-900 font-medium">
                        {formatDate(receipt.paymentDate)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes Section */}
              {receipt.notes && (
                <div>
                  <Separator className="bg-slate-200 mb-4" />
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                      Notes
                    </p>
                    <p className="text-slate-700 whitespace-pre-wrap text-sm">
                      {receipt.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-10 py-6 text-center text-xs text-slate-500">
              <p>Created on {formatDate(receipt.createdAt)}</p>
              <p className="mt-2 text-slate-400">
                Thank you for your business!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
}
