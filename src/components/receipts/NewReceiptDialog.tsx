/**
 * NewReceiptDialog Component - Form to create a new receipt (Modal)
 */

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import type { NewReceiptInput } from "@/types/receipt";
import {
  ReceiptPaymentMethod,
  ReceiptStatus as ReceiptStatusValues,
} from "@/types/receipt";
import { useClients } from "@/hooks/useClients";
import { useAuth } from "@/hooks/useAuth";
import { getNextReceiptNumber } from "@/services/receipts";

const receiptItemSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be non-negative"),
});

const newReceiptSchema = z.object({
  receiptNumber: z.string().min(1, "Receipt number is required"),
  clientId: z.string().min(1, "Client is required"),
  taxRate: z.number().min(0).max(100),
  paymentMethod: z.string(),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(receiptItemSchema).min(1, "Add at least one item"),
} as const);

type ReceiptFormData = z.infer<typeof newReceiptSchema>;

interface NewReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NewReceiptInput) => Promise<void>;
  isLoading?: boolean;
}

export function NewReceiptDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: NewReceiptDialogProps) {
  const { clients } = useClients();
  const { user } = useAuth();
  const [selectedClientId, setSelectedClientId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, getValues, reset, setValue } =
    useForm<ReceiptFormData>({
      resolver: zodResolver(newReceiptSchema),
      defaultValues: {
        receiptNumber: "RCP-001",
        items: [{ productName: "", quantity: 1, unitPrice: 0 }],
        taxRate: 0,
        paymentMethod: ReceiptPaymentMethod.CASH,
        issueDate: new Date().toISOString().split("T")[0],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Auto-generate receipt number on component mount
  useEffect(() => {
    if (user?.uid) {
      getNextReceiptNumber(user.uid).then((nextNumber) => {
        setValue("receiptNumber", nextNumber);
      });
    }
  }, [user?.uid, setValue]);

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleFormSubmit = async (data: ReceiptFormData) => {
    if (!selectedClientId) return;

    const client = clients.find((c) => c.id === selectedClientId);
    if (!client) return;

    const items = getValues("items");
    const taxRate = getValues("taxRate");

    const subtotal = items.reduce(
      (sum, item) => sum + (item.quantity * item.unitPrice || 0),
      0,
    );
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax;

    const receiptData: NewReceiptInput = {
      receiptNumber: data.receiptNumber,
      clientId: data.clientId,
      clientName: client.name,
      clientEmail: client.email,
      taxRate: data.taxRate,
      paymentMethod: data.paymentMethod as ReceiptPaymentMethod,
      status: ReceiptStatusValues.DRAFT,
      issueDate: new Date(data.issueDate),
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      notes: data.notes,
      subtotal,
      tax,
      total,
      items: items.map((item) => ({
        ...item,
        itemId: Math.random().toString(36).substr(2, 9),
        total: item.quantity * item.unitPrice,
      })),
    };

    setIsSubmitting(true);
    try {
      await onSubmit(receiptData);
      reset();
      setSelectedClientId("");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-90vh overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Create New Receipt</DialogTitle>
          <DialogDescription>Add receipt details and items</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="receiptNumber">Receipt Number *</Label>
              <Input
                id="receiptNumber"
                placeholder="RC-001"
                className="bg-white!"
                {...register("receiptNumber")}
              />
            </div>
            <div>
              <Label htmlFor="client">Client *</Label>
              <select
                value={selectedClientId}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900"
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="issueDate">Issue Date *</Label>
              <Input
                id="issueDate"
                type="date"
                className="bg-white!"
                {...register("issueDate")}
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                className="bg-white!"
                {...register("dueDate")}
              />
            </div>
            <div>
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <select
                defaultValue={ReceiptPaymentMethod.CASH}
                {...register("paymentMethod")}
                className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900"
              >
                <option value={ReceiptPaymentMethod.CASH}>Cash</option>
                <option value={ReceiptPaymentMethod.CARD}>Card</option>
                <option value={ReceiptPaymentMethod.BANK_TRANSFER}>
                  Bank Transfer
                </option>
                <option value={ReceiptPaymentMethod.CHECK}>Check</option>
                <option value={ReceiptPaymentMethod.OTHER}>Other</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Items *</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  append({
                    productName: "",
                    quantity: 1,
                    unitPrice: 0,
                  })
                }
              >
                <Plus size={16} className="mr-1" />
                Add Item
              </Button>
            </div>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-5 gap-2 items-end"
                >
                  <Input
                    placeholder="Product"
                    className="bg-white!"
                    {...register(`items.${index}.productName`)}
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    className="bg-white!"
                    {...register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    step="0.01"
                    className="bg-white!"
                    {...register(`items.${index}.unitPrice`, {
                      valueAsNumber: true,
                    })}
                  />
                  <div className="text-sm font-semibold text-right">
                    {new Intl.NumberFormat("fr-SN", {
                      style: "currency",
                      currency: "XOF",
                      minimumFractionDigits: 0,
                    }).format(
                      (getValues(`items.${index}.quantity`) || 0) *
                        (getValues(`items.${index}.unitPrice`) || 0),
                    )}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => remove(index)}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Card className="p-3 bg-white border border-gray-200">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat("fr-SN", {
                    style: "currency",
                    currency: "XOF",
                    minimumFractionDigits: 0,
                  }).format(
                    getValues("items").reduce(
                      (sum, item) =>
                        sum + (item.quantity * item.unitPrice || 0),
                      0,
                    ),
                  )}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <Label className="text-xs">Tax (%):</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  className="w-16 h-7 text-xs bg-white!"
                  {...register("taxRate", { valueAsNumber: true })}
                />
                <span className="font-semibold">
                  {new Intl.NumberFormat("fr-SN", {
                    style: "currency",
                    currency: "XOF",
                    minimumFractionDigits: 0,
                  }).format(
                    (getValues("items").reduce(
                      (sum, item) =>
                        sum + (item.quantity * item.unitPrice || 0),
                      0,
                    ) *
                      getValues("taxRate")) /
                      100,
                  )}
                </span>
              </div>
              <div className="border-t pt-1 flex justify-between font-bold">
                <span>Total:</span>
                <span>
                  $
                  {(
                    getValues("items").reduce(
                      (sum, item) =>
                        sum + (item.quantity * item.unitPrice || 0),
                      0,
                    ) *
                    (1 + getValues("taxRate") / 100)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSubmitting || isLoading ? "Creating..." : "Create Receipt"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
