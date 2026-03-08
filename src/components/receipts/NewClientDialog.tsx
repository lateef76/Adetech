/**
 * NewClientDialog Component - Quick add client from receipt form
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated: (clientName: string) => void;
  isLoading?: boolean;
}

export function NewClientDialog({
  open,
  onOpenChange,
  onClientCreated,
  isLoading = false,
}: NewClientDialogProps) {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientType, setClientType] = useState<"individual" | "professional">(
    "individual",
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    setIsSaving(true);
    try {
      // This will be handled by the parent component
      onClientCreated(clientName);
      // Reset form
      setClientName("");
      setClientPhone("");
      setClientEmail("");
      setClientType("individual");
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newClientName">Client Name *</Label>
            <Input
              id="newClientName"
              placeholder="Enter client name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="bg-white!"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newClientPhone">Phone</Label>
            <Input
              id="newClientPhone"
              placeholder="Phone number"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="bg-white!"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newClientEmail">Email</Label>
            <Input
              id="newClientEmail"
              type="email"
              placeholder="Email address"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="bg-white!"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newClientType">Client Type</Label>
            <select
              id="newClientType"
              value={clientType}
              onChange={(e) =>
                setClientType(e.target.value as "individual" | "professional")
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-900"
            >
              <option value="individual">Individual</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving || isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!clientName.trim() || isSaving || isLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isSaving || isLoading ? "Creating..." : "Create Client"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
