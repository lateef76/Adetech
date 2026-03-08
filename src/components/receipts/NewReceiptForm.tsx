/**
 * NewReceiptForm Component - Form to create a new receipt with paper-like design
 */

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Stamp,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import type { NewReceiptInput } from "@/types/receipt";
import {
  ReceiptPaymentMethod,
  ReceiptStatus as ReceiptStatusValues,
} from "@/types/receipt";
import { useClients } from "@/hooks/useClients";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { useAuth } from "@/hooks/useAuth";
import { addClient } from "@/services/clients";
import { getNextReceiptNumber } from "@/services/receipts";
import { useState, useEffect, useCallback, useMemo } from "react";

const receiptItemSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  quantity: z
    .number()
    .min(1, "Quantity must be at least 1")
    .max(999999, "Quantity too large"),
  unitPrice: z
    .number()
    .min(0, "Unit price cannot be negative")
    .max(999999.99, "Price too large"),
});

const newReceiptSchema = z.object({
  receiptNumber: z.string().min(1, "Receipt number is required"),
  clientTitle: z.string().optional(),
  clientName: z.string().min(1, "Client name is required"),
  taxRate: z.number().min(0).max(100),
  paymentMethod: z.string(),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  companyName: z.string().min(1, "Company name is required"),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
  items: z.array(receiptItemSchema).min(1, "Add at least one item"),
} as const);

type ReceiptFormData = z.infer<typeof newReceiptSchema>;

interface NewReceiptFormProps {
  onSubmit: (data: NewReceiptInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function NewReceiptForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: NewReceiptFormProps) {
  const { user } = useAuth();
  const { clients } = useClients();
  const { settings: companySettings } = useCompanySettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currency, setCurrency] = useState<string>("CFA");

  // Undo/Redo history state
  const [formHistory, setFormHistory] = useState<
    Array<{ productName: string; quantity: number; unitPrice: number }[]>
  >([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const { register, handleSubmit, control, getValues, reset, setValue } =
    useForm<ReceiptFormData>({
      resolver: zodResolver(newReceiptSchema),
      mode: "onChange",
      defaultValues: {
        receiptNumber: "RCP-001",
        items: [{ productName: "", quantity: 1, unitPrice: 0 }],
        taxRate: 0,
        paymentMethod: ReceiptPaymentMethod.CASH,
        issueDate: new Date().toISOString().split("T")[0],
        companyName: "AdeTech Business Solutions",
        companyAddress: "123 Business Street, City, Country 12345",
        companyPhone: "+1 (555) 123-4567",
      },
    });

  // Watch the entire items array for any changes (this is the raw watched value)
  const watchedItemsRaw = useWatch({
    control,
    name: "items",
  });

  // Memoize watchedItems to ensure stable reference and fix dependency warnings
  const watchedItems = useMemo(
    () =>
      watchedItemsRaw && watchedItemsRaw.length > 0 ? watchedItemsRaw : [],
    [watchedItemsRaw],
  );

  // Watch individual fields for granular control (quantity & unitPrice changes)
  const watchAllFields = useWatch({ control });

  // Extract tax rate from watched fields
  const watchedTaxRate = watchAllFields?.taxRate || 0;

  const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 });

  // Memoize calculation function to ensure it's stable
  const calculateTotals = useCallback(() => {
    if (!watchedItems || watchedItems.length === 0) {
      setTotals({ subtotal: 0, tax: 0, total: 0 });
      return;
    }

    try {
      let calculatedSubtotal = 0;

      // Loop through each item and calculate subtotal
      for (let i = 0; i < watchedItems.length; i++) {
        const item = watchedItems[i];
        if (item) {
          const qty = parseFloat(String(item.quantity)) || 0;
          const price = parseFloat(String(item.unitPrice)) || 0;
          if (qty > 0 && price > 0) {
            calculatedSubtotal += qty * price;
          }
        }
      }

      const taxRate = parseFloat(String(watchedTaxRate)) || 0;
      const calculatedTax = (calculatedSubtotal * taxRate) / 100;
      const calculatedTotal = calculatedSubtotal + calculatedTax;

      setTotals({
        subtotal: Number(calculatedSubtotal.toFixed(2)),
        tax: Number(calculatedTax.toFixed(2)),
        total: Number(calculatedTotal.toFixed(2)),
      });
    } catch (error) {
      console.error("Calculation error:", error);
      setTotals({ subtotal: 0, tax: 0, total: 0 });
    }
  }, [watchedItems, watchedTaxRate]);

  // Trigger calculation whenever items or tax rate changes
  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  // Update form values when company settings are loaded
  useEffect(() => {
    if (companySettings) {
      // Use company settings if available, otherwise use defaults
      setValue(
        "companyName",
        companySettings.companyName || "AdeTech Business Solutions",
      );
      setValue(
        "companyAddress",
        companySettings.companyAddress ||
          "123 Business Street, City, Country 12345",
      );
      setValue(
        "companyPhone",
        companySettings.companyPhone || "+1 (555) 123-4567",
      );
      setCurrency(companySettings.currency || "CFA");
    }
  }, [companySettings, setValue]);

  // Auto-generate receipt number on component mount
  useEffect(() => {
    if (user?.uid) {
      getNextReceiptNumber(user.uid).then((nextNumber) => {
        setValue("receiptNumber", nextNumber);
      });
    }
  }, [user?.uid, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Save current state to history
  const addToHistory = useCallback(() => {
    const currentState = getValues("items");
    const newHistory = formHistory.slice(0, historyIndex + 1);
    newHistory.push(currentState);
    setFormHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [formHistory, historyIndex, getValues]);

  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const previousState = formHistory[newIndex];

      // Remove excess items
      while (fields.length > previousState.length) {
        remove(fields.length - 1);
      }

      // Add missing items
      for (let i = fields.length; i < previousState.length; i++) {
        append(previousState[i]);
      }

      // Update all items
      previousState.forEach(
        (
          item: { productName: string; quantity: number; unitPrice: number },
          index: number,
        ) => {
          setValue(`items.${index}.productName`, item.productName);
          setValue(`items.${index}.quantity`, item.quantity);
          setValue(`items.${index}.unitPrice`, item.unitPrice);
        },
      );
    }
  }, [historyIndex, formHistory, fields.length, remove, append, setValue]);

  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndex < formHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextState = formHistory[newIndex];

      // Remove excess items
      while (fields.length > nextState.length) {
        remove(fields.length - 1);
      }

      // Add missing items
      for (let i = fields.length; i < nextState.length; i++) {
        append(nextState[i]);
      }

      // Update all items
      nextState.forEach(
        (
          item: { productName: string; quantity: number; unitPrice: number },
          index: number,
        ) => {
          setValue(`items.${index}.productName`, item.productName);
          setValue(`items.${index}.quantity`, item.quantity);
          setValue(`items.${index}.unitPrice`, item.unitPrice);
        },
      );
    }
  }, [historyIndex, formHistory, fields.length, remove, append, setValue]);

  // Quick add multiple fields
  const handleQuickAddFields = useCallback(
    (count: number) => {
      addToHistory();
      for (let i = 0; i < count; i++) {
        append({
          productName: "",
          quantity: 1,
          unitPrice: 0,
        });
      }
    },
    [append, addToHistory],
  );

  // Save history when items change
  useEffect(() => {
    const timer = setTimeout(() => {
      addToHistory();
    }, 500);
    return () => clearTimeout(timer);
  }, [watchedItems, addToHistory]);

  const handleFormSubmit = async (data: ReceiptFormData) => {
    if (!user?.uid || !data.clientName.trim()) return;

    setIsSubmitting(true);
    try {
      // Build full client name with title
      const fullClientName = data.clientTitle
        ? `${data.clientTitle} ${data.clientName}`
        : data.clientName;

      // Check if client already exists
      let clientId: string;
      const existingClient = clients.find(
        (c) => c.name.toLowerCase() === fullClientName.toLowerCase(),
      );

      if (existingClient) {
        // Use existing client
        clientId = existingClient.id;
      } else {
        // Create new client with full name
        try {
          clientId = await addClient(user.uid, {
            name: fullClientName,
            client_type: "individual",
          });
        } catch (err) {
          console.error("Error creating client:", err);
          return;
        }
      }

      const items = getValues("items");

      const receiptData: NewReceiptInput = {
        receiptNumber: data.receiptNumber,
        clientId: clientId,
        clientName: fullClientName,
        clientEmail: "", // Will be updated in Firebase if needed
        taxRate: data.taxRate,
        paymentMethod: data.paymentMethod as ReceiptPaymentMethod,
        status: ReceiptStatusValues.DRAFT,
        issueDate: new Date(data.issueDate),
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        notes: data.notes,
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
        items: items.map((item) => ({
          ...item,
          itemId: Math.random().toString(36).substr(2, 9),
          total: item.quantity * item.unitPrice,
        })),
      };

      await onSubmit(receiptData);
      reset();
    } catch (error) {
      console.error("Error creating receipt:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 to-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation & History Controls */}
        <div className="mb-6 flex justify-between items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="bg-white hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Receipts
          </Button>

          {/* Undo/Redo Buttons */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="bg-white hover:bg-slate-50 border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRedo}
              disabled={historyIndex >= formHistory.length - 1}
              className="bg-white hover:bg-slate-50 border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Redo (Ctrl+Y)"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Receipt Paper Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
          {/* Receipt Header with Stamp Area */}
          <div className="relative p-8 border-b-2 border-slate-200">
            <div className="grid grid-cols-3 gap-4">
              {/* Left: Company Info - Editable */}
              <div className="col-span-2">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  RECEIPT
                </h1>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">
                      Company Name
                    </Label>
                    <Input
                      placeholder="AdeTech Business Solutions"
                      className="bg-white! border-0 border-b-2 border-slate-300 rounded-none px-0 font-semibold text-sm focus:border-orange-500 focus:ring-0"
                      {...register("companyName")}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">
                      Address
                    </Label>
                    <Input
                      placeholder="123 Business Street, City, Country 12345"
                      className="bg-white! border-0 border-b-2 border-slate-300 rounded-none px-0 text-sm focus:border-orange-500 focus:ring-0"
                      {...register("companyAddress")}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">
                      Phone
                    </Label>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      className="bg-white! border-0 border-b-2 border-slate-300 rounded-none px-0 text-sm focus:border-orange-500 focus:ring-0"
                      {...register("companyPhone")}
                    />
                  </div>
                </div>
              </div>

              {/* Right: Stamp Area */}
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32 border-4 border-dashed border-orange-300 rounded-full flex items-center justify-center bg-linear-to-br from-orange-50 to-transparent">
                  <div className="text-center">
                    <Stamp className="w-10 h-10 text-orange-400 mx-auto mb-1 opacity-50" />
                    <p className="text-xs text-orange-600 font-semibold">
                      ADMIN STAMP
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="p-8 space-y-8"
          >
            {/* Receipt Details Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-6 border-b border-slate-200">
              <div>
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Receipt No.
                </Label>
                <Input
                  id="receiptNumber"
                  placeholder="RC-001"
                  className="bg-white! mt-1 font-semibold text-lg border-0 border-b-2 border-slate-300 rounded-none px-0 focus:border-orange-500 focus:ring-0"
                  {...register("receiptNumber")}
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Issue Date
                </Label>
                <Input
                  id="issueDate"
                  type="date"
                  className="bg-white! mt-1 border-0 border-b-2 border-slate-300 rounded-none px-0 focus:border-orange-500 focus:ring-0"
                  {...register("issueDate")}
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  className="bg-white! mt-1 border-0 border-b-2 border-slate-300 rounded-none px-0 focus:border-orange-500 focus:ring-0"
                  {...register("dueDate")}
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Payment Method
                </Label>
                <select
                  defaultValue={ReceiptPaymentMethod.CASH}
                  {...register("paymentMethod")}
                  className="w-full mt-1 px-0 py-1 border-0 border-b-2 border-slate-300 bg-white text-slate-900 rounded-none focus:border-orange-500 focus:ring-0 text-sm"
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

            {/* Client Information */}
            <div className="pb-6 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">
                Bill To
              </h3>
              <div className="flex gap-3 items-end">
                <div className="shrink-0 w-24">
                  <Label htmlFor="clientTitle" className="text-xs">
                    Title
                  </Label>
                  <select
                    id="clientTitle"
                    className="w-full px-2 py-2 border border-slate-300 rounded-md bg-white text-slate-900 text-sm mt-1"
                    {...register("clientTitle")}
                  >
                    <option value="">None</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                    <option value="Sir">Sir</option>
                    <option value="Madam">Madam</option>
                  </select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="clientName" className="text-xs">
                    Client Name *
                  </Label>
                  <Input
                    id="clientName"
                    placeholder="Enter client name"
                    className="bg-white! mt-1"
                    {...register("clientName")}
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                💡 Tip: Enter an existing client name or a new one. New clients
                will be created automatically.
              </p>
            </div>

            {/* Line Items Table */}
            <div className="pb-6">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Line Items ({fields.length})
                </h3>

                {/* Quick Add Buttons */}
                <div className="flex gap-1 items-center">
                  <span className="text-xs text-slate-600 mr-1">
                    Quick add:
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAddFields(2)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 text-xs h-8 px-2 transition-all duration-200"
                    title="Add 2 items"
                  >
                    +2
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAddFields(4)}
                    className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300 text-xs h-8 px-2 transition-all duration-200"
                    title="Add 4 items"
                  >
                    +4
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAddFields(8)}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-300 text-xs h-8 px-2 transition-all duration-200"
                    title="Add 8 items"
                  >
                    +8
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAddFields(10)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-300 text-xs h-8 px-2 transition-all duration-200"
                    title="Add 10 items"
                  >
                    +10
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      addToHistory();
                      append({
                        productName: "",
                        quantity: 1,
                        unitPrice: 0,
                      });
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white border-0 h-8 px-3 transition-all duration-200"
                    title="Add single item"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-slate-900 text-white rounded-t font-semibold text-sm mb-0">
                <div className="col-span-4">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-3 text-right">Unit Price</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-1"></div>
              </div>

              {/* Table Rows */}
              <div className="divide-y border border-t-0 border-slate-200 rounded-b mb-6">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-12 gap-3 p-4 items-center hover:bg-orange-50 transition duration-200"
                  >
                    {/* Product Description */}
                    <Input
                      placeholder="Product description"
                      className="col-span-4 bg-white! border border-slate-300 h-10 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition-all duration-200"
                      {...register(`items.${index}.productName`)}
                    />

                    {/* Quantity - Real-time update */}
                    <Input
                      type="number"
                      placeholder="0"
                      min="1"
                      max="999999"
                      className="col-span-2 bg-white! border border-slate-300 h-10 text-center text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-500 font-semibold"
                      {...register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                        onChange: () => {
                          // Trigger immediate recalculation
                          calculateTotals();
                        },
                      })}
                    />

                    {/* Unit Price - Real-time update */}
                    <Input
                      type="number"
                      placeholder="0.00"
                      min="0"
                      max="999999.99"
                      step="0.01"
                      className="col-span-3 bg-white! border border-slate-300 h-10 text-right text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-500 font-semibold"
                      {...register(`items.${index}.unitPrice`, {
                        valueAsNumber: true,
                        onChange: () => {
                          // Trigger immediate recalculation
                          calculateTotals();
                        },
                      })}
                    />

                    {/* Line Item Total - Instant feedback */}
                    <div className="col-span-2 text-right font-bold text-slate-900 h-10 flex items-center justify-end bg-orange-50 px-3 rounded-md transition-all duration-200 hover:bg-orange-100">
                      {currency}
                      <span className="text-orange-600 ml-1">
                        {(
                          (watchedItems[index]?.quantity || 0) *
                          (watchedItems[index]?.unitPrice || 0)
                        ).toFixed(2)}
                      </span>
                    </div>

                    {/* Delete Button */}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        remove(index);
                        // Recalculate after removing item
                        setTimeout(() => calculateTotals(), 0);
                      }}
                      className="col-span-1 h-10 hover:bg-red-50 transition duration-200"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Add Item Button Below Table */}
              <div className="flex justify-center pt-3 pb-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    addToHistory();
                    append({
                      productName: "",
                      quantity: 1,
                      unitPrice: 0,
                    });
                  }}
                  className="w-10 h-10 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 hover:text-orange-700 flex items-center justify-center transition-all duration-200 shadow-sm"
                  title="Add new line item"
                >
                  <Plus size={20} />
                </Button>
              </div>
            </div>

            {/* Totals Section */}
            <div className="flex justify-end">
              <div className="w-full md:w-80">
                <div className="bg-linear-to-br from-orange-50 to-slate-50 rounded-lg p-6 space-y-3 border-2 border-orange-200 shadow-sm transition-all duration-300">
                  {/* Subtotal */}
                  <div className="flex justify-between text-sm hover:bg-white p-2 rounded transition-colors duration-200">
                    <span className="text-slate-700 font-medium">
                      Subtotal:
                    </span>
                    <span className="font-bold text-slate-900">
                      {new Intl.NumberFormat("fr-SN", {
                        style: "currency",
                        currency: "XOF",
                        minimumFractionDigits: 0,
                      }).format(totals.subtotal)}
                    </span>
                  </div>

                  {/* Tax Rate and Amount */}
                  <div className="flex justify-between items-center text-sm border-t border-orange-200 pt-3 hover:bg-white p-2 rounded transition-colors duration-200">
                    <label className="text-slate-700 font-medium">
                      Tax ({watchedTaxRate}%):
                    </label>
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-16 bg-white! border border-slate-300 h-8 text-right focus:ring-2 focus:ring-orange-400 focus:border-orange-500"
                        {...register("taxRate", {
                          valueAsNumber: true,
                          onChange: () => {
                            // Trigger immediate recalculation
                            calculateTotals();
                          },
                        })}
                      />
                      <span className="font-bold text-slate-900 min-w-fit">
                        {new Intl.NumberFormat("fr-SN", {
                          style: "currency",
                          currency: "XOF",
                          minimumFractionDigits: 0,
                        }).format(totals.tax)}
                      </span>
                    </div>
                  </div>

                  {/* Total - Prominent Display */}
                  <div className="border-t-2 border-orange-300 pt-3 flex justify-between items-center bg-white px-3 py-2 rounded-lg shadow-sm transition-all duration-200">
                    <span className="font-bold text-lg text-slate-900">
                      TOTAL:
                    </span>
                    <span className="font-bold text-2xl text-orange-600">
                      {new Intl.NumberFormat("fr-SN", {
                        style: "currency",
                        currency: "XOF",
                        minimumFractionDigits: 0,
                      }).format(totals.total)}
                    </span>
                  </div>

                  {/* Real-time indicator */}
                  <div className="text-xs text-slate-500 text-center mt-2 flex items-center justify-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>Calculating in real-time...</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="pt-6 border-t border-slate-200">
              <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 block">
                Notes / Terms
              </Label>
              <div className="p-4 bg-slate-50 rounded border border-slate-200 min-h-20">
                <textarea
                  className="w-full bg-transparent text-slate-700 text-sm resize-none focus:outline-none"
                  placeholder="Add any additional notes or payment terms..."
                  {...register("notes")}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="bg-white hover:bg-slate-50 border-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8"
              >
                {isSubmitting || isLoading ? "Creating..." : "Create Receipt"}
              </Button>
            </div>
          </form>

          {/* Receipt Footer */}
          <div className="bg-slate-50 px-8 py-6 border-t border-slate-200 text-center text-xs text-slate-600">
            <p>Thank you for your business!</p>
            <p className="mt-2">
              Receipt printed on {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
