/**
 * CompanySettingsForm Component - Manage company information
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader, Check } from "lucide-react";
import type { NewCompanySettings } from "@/types/companySettings";
import { useState } from "react";

const companySettingsSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyAddress: z.string().min(1, "Company address is required"),
  companyPhone: z.string().min(1, "Company phone is required"),
  companyEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  companyWebsite: z.string().url("Invalid URL").optional().or(z.literal("")),
  taxId: z.string().optional().or(z.literal("")),
  registrationNumber: z.string().optional().or(z.literal("")),
  currency: z.string().optional().or(z.literal("CFA")),
});

type CompanySettingsFormData = z.infer<typeof companySettingsSchema>;

interface CompanySettingsFormProps {
  initialSettings?: {
    companyName?: string;
    companyAddress?: string;
    companyPhone?: string;
    companyEmail?: string;
    companyWebsite?: string;
    taxId?: string;
    registrationNumber?: string;
    currency?: string;
  };
  onSubmit: (data: NewCompanySettings) => Promise<boolean>;
  isLoading?: boolean;
}

export function CompanySettingsForm({
  initialSettings,
  onSubmit,
  isLoading = false,
}: CompanySettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanySettingsFormData>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      companyName: initialSettings?.companyName || "AdeTech Business Solutions",
      companyAddress:
        initialSettings?.companyAddress ||
        "123 Business Street, City, Country 12345",
      companyPhone: initialSettings?.companyPhone || "+1 (555) 123-4567",
      companyEmail: initialSettings?.companyEmail || "",
      companyWebsite: initialSettings?.companyWebsite || "",
      taxId: initialSettings?.taxId || "",
      registrationNumber: initialSettings?.registrationNumber || "",
      currency: initialSettings?.currency || "CFA",
    },
  });

  const handleFormSubmit = async (data: CompanySettingsFormData) => {
    setIsSaving(true);
    try {
      const success = await onSubmit(data as NewCompanySettings);
      if (!success) {
        console.error("Failed to save settings");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6 bg-white border border-slate-200">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Company Information
          </h2>
          <p className="text-sm text-slate-600">
            Set up your company details. These will be used as defaults for all
            receipts.
          </p>
        </div>

        {/* Basic Company Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              placeholder="Your Company Name"
              className="bg-white!"
              {...register("companyName")}
            />
            {errors.companyName && (
              <p className="text-sm text-red-500">
                {errors.companyName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyPhone">Phone *</Label>
            <Input
              id="companyPhone"
              placeholder="+1 (555) 123-4567"
              className="bg-white!"
              {...register("companyPhone")}
            />
            {errors.companyPhone && (
              <p className="text-sm text-red-500">
                {errors.companyPhone.message}
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="companyAddress">Address *</Label>
          <Input
            id="companyAddress"
            placeholder="Street, City, Country, ZIP"
            className="bg-white!"
            {...register("companyAddress")}
          />
          {errors.companyAddress && (
            <p className="text-sm text-red-500">
              {errors.companyAddress.message}
            </p>
          )}
        </div>

        {/* Contact & Website */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyEmail">Email</Label>
            <Input
              id="companyEmail"
              type="email"
              placeholder="info@company.com"
              className="bg-white!"
              {...register("companyEmail")}
            />
            {errors.companyEmail && (
              <p className="text-sm text-red-500">
                {errors.companyEmail.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyWebsite">Website</Label>
            <Input
              id="companyWebsite"
              placeholder="https://www.company.com"
              className="bg-white!"
              {...register("companyWebsite")}
            />
            {errors.companyWebsite && (
              <p className="text-sm text-red-500">
                {errors.companyWebsite.message}
              </p>
            )}
          </div>
        </div>

        {/* Tax & Registration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID / VAT Number</Label>
            <Input
              id="taxId"
              placeholder="e.g., 12-3456789"
              className="bg-white!"
              {...register("taxId")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input
              id="registrationNumber"
              placeholder="Business registration number"
              className="bg-white!"
              {...register("registrationNumber")}
            />
          </div>
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <select
            id="currency"
            className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900"
            {...register("currency")}
          >
            <option value="XOF">CFA (Fr) - West Africa</option>
            <option value="EUR">EUR (€) - Euro</option>
            <option value="USD">USD ($) - US Dollar</option>
            <option value="GBP">GBP (£) - British Pound</option>
            <option value="CAD">CAD ($) - Canadian Dollar</option>
            <option value="AUD">AUD ($) - Australian Dollar</option>
            <option value="JPY">JPY (¥)</option>
            <option value="CHF">CHF (₣)</option>
            <option value="CNY">CNY (¥)</option>
            <option value="INR">INR (₹)</option>
            <option value="MXN">MXN ($)</option>
          </select>
        </div>

        {/* Save Button */}
        <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
          <Button
            type="submit"
            disabled={isSaving || isLoading}
            className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
          >
            {isSaving || isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save Company Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
