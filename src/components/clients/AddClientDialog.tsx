/**
 * Add Client Dialog Component
 * Form for adding a new client
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useClientMutations } from "@/hooks/useClientMutations";
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
import { Loader2 } from "lucide-react";

const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  client_type: z.enum(["professional", "individual"]),
  tax_id: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AddClientDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddClientDialogProps) {
  const { handleAddClient, addingClient } = useClientMutations();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      client_type: "individual",
    },
  });

  const clientType = getValues("client_type");

  const onSubmit = async (data: ClientFormData) => {
    const result = await handleAddClient(data);
    if (result) {
      reset();
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Fill in the client information below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name - Required */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="Client name"
              {...register("name")}
              disabled={addingClient}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Client Type - Required */}
          <div className="space-y-2">
            <Label htmlFor="client_type">Client Type *</Label>
            <select
              id="client_type"
              {...register("client_type")}
              disabled={addingClient}
              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.client_type ? "border-destructive" : ""}`}
            >
              <option value="individual">👤 Individual</option>
              <option value="professional">👔 Professional</option>
            </select>
            {errors.client_type && (
              <p className="text-sm text-destructive">
                {errors.client_type.message}
              </p>
            )}
          </div>

          {/* Tax ID - For Professionals */}
          {clientType === "professional" && (
            <div className="space-y-2">
              <Label htmlFor="tax_id">Tax ID / IFU</Label>
              <Input
                id="tax_id"
                placeholder="Tax ID or IFU number"
                {...register("tax_id")}
                disabled={addingClient}
              />
              {errors.tax_id && (
                <p className="text-sm text-destructive">
                  {errors.tax_id.message}
                </p>
              )}
            </div>
          )}

          {/* Email - Optional */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="client@example.com"
              {...register("email")}
              disabled={addingClient}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Phone - Optional */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="+221 77 XXX XX XX"
              {...register("phone")}
              disabled={addingClient}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Address - Optional */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Street address"
              {...register("address")}
              disabled={addingClient}
            />
            {errors.address && (
              <p className="text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* City - Optional */}
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="City name"
              {...register("city")}
              disabled={addingClient}
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={addingClient}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={addingClient}>
              {addingClient && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {addingClient ? "Adding..." : "Add Client"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
