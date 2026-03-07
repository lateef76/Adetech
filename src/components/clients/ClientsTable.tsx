/**
 * Clients Table Component
 * Displays clients in a table with actions
 */

import { useState } from "react";
import type { Client } from "@/types/client";
import { useClientMutations } from "@/hooks/useClientMutations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import EditClientDialog from "@/components/clients/EditClientDialog";
import ClientDetailsDialog from "@/components/clients/ClientDetailsDialog";

interface ClientsTableProps {
  clients: Client[];
  onClientAdded: () => void;
}

export default function ClientsTable({
  clients,
  onClientAdded,
}: ClientsTableProps) {
  const { handleDeleteClient } = useClientMutations();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (clientId: string) => {
    setDeletingId(clientId);
    const success = await handleDeleteClient(clientId);
    setDeletingId(null);
    if (success) {
      setDeleteDialogOpen(false);
      onClientAdded();
    }
  };

  const openDeleteDialog = (client: Client) => {
    setSelectedClient(client);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (client: Client) => {
    setSelectedClient(client);
    setEditDialogOpen(true);
  };

  const openDetailsDialog = (client: Client) => {
    setSelectedClient(client);
    setDetailsDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    onClientAdded();
  };

  const typeLabel = (type: string) => {
    return type === "professional" ? "👔 Professional" : "👤 Individual";
  };

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                    {typeLabel(client.client_type)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {client.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {client.email}
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {client.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {client.city && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3" />
                      {client.city}
                    </div>
                  )}
                  {!client.city && (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {client.total_purchases
                    ? `CFA ${(client.total_purchases || 0).toLocaleString()}`
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => openDetailsDialog(client)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(client)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => openDeleteDialog(client)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedClient?.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedClient && handleDelete(selectedClient.id)}
              disabled={deletingId !== null}
              variant="destructive"
            >
              {deletingId ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      {selectedClient && (
        <EditClientDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          client={selectedClient}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Client Details Dialog */}
      {selectedClient && (
        <ClientDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          client={selectedClient}
        />
      )}
    </>
  );
}
