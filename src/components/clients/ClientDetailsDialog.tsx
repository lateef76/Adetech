/**
 * Client Details Dialog Component
 * Shows client information and purchase history
 */

import type { Client } from "@/types/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin, Home, Calendar, UserCheck } from "lucide-react";
import { format } from "date-fns";

interface ClientDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
}

export default function ClientDetailsDialog({
  open,
  onOpenChange,
  client,
}: ClientDetailsDialogProps) {
  const typeLabel =
    client.client_type === "professional" ? "👔 Professional" : "👤 Individual";
  const createdDate = new Date(client.created_at);
  const lastPurchaseDate = client.last_purchase_date
    ? new Date(client.last_purchase_date)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{client.name}</DialogTitle>
          <DialogDescription>
            <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm mt-2">
              {typeLabel}
            </span>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="history">Purchase History</TabsTrigger>
          </TabsList>

          {/* Information Tab */}
          <TabsContent value="info" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                  Contact
                </h3>

                {client.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{client.email}</p>
                    </div>
                  </div>
                )}

                {client.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{client.phone}</p>
                    </div>
                  </div>
                )}

                {!client.email && !client.phone && (
                  <p className="text-sm text-muted-foreground italic">
                    No contact information
                  </p>
                )}
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                  Address
                </h3>

                {client.address && (
                  <div className="flex items-start gap-3">
                    <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{client.address}</p>
                    </div>
                  </div>
                )}

                {client.city && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">City</p>
                      <p className="font-medium">{client.city}</p>
                    </div>
                  </div>
                )}

                {!client.address && !client.city && (
                  <p className="text-sm text-muted-foreground italic">
                    No address information
                  </p>
                )}
              </div>
            </div>

            {/* Professional Information */}
            {client.client_type === "professional" && (
              <div className="pt-4 border-t space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                  Professional
                </h3>
                {client.tax_id && (
                  <div className="flex items-start gap-3">
                    <UserCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tax ID / IFU
                      </p>
                      <p className="font-medium">{client.tax_id}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dates Information */}
            <div className="pt-4 border-t space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                Dates
              </h3>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Client Since</p>
                  <p className="font-medium">{format(createdDate, "PPP")}</p>
                </div>
              </div>

              {lastPurchaseDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Last Purchase
                    </p>
                    <p className="font-medium">
                      {format(lastPurchaseDate, "PPP")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Purchase History Tab */}
          <TabsContent value="history" className="space-y-4 mt-4">
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <p className="text-muted-foreground">
                Purchase history will be displayed here
              </p>
              {client.total_purchases && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold mt-2">
                    CFA {(client.total_purchases || 0).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
