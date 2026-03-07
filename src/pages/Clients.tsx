/**
 * Clients Page - Phase 4
 * Displays all clients with CRUD functionality
 */

import { useState } from "react";
import { useClients } from "@/hooks/useClients";
import { MainLayout } from "@/layouts/MainLayout";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, User } from "lucide-react";
import ClientsTable from "@/components/clients/ClientsTable";
import AddClientDialog from "@/components/clients/AddClientDialog";
import type { ClientFilter } from "@/types/client";
import { Skeleton } from "@/components/ui/skeleton";

export function ClientsPage() {
  const { clients, loading, refetch } = useClients();

  const [openDialog, setOpenDialog] = useState(false);
  const [filters, setFilters] = useState<ClientFilter>({
    search: "",
    type: "all",
    sortBy: "recent",
  });

  // Apply filters and search
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      !filters.search ||
      client.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      client.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
      client.phone?.includes(filters.search);

    const matchesType =
      filters.type === "all" || client.client_type === filters.type;

    return matchesSearch && matchesType;
  });

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (filters.sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "purchases":
        return (b.total_purchases || 0) - (a.total_purchases || 0);
      case "recent":
      default:
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  });

  const handleAddClientSuccess = async () => {
    setOpenDialog(false);
    await refetch();
  };

  const stats = {
    total: clients.length,
    professionals: clients.filter((c) => c.client_type === "professional")
      .length,
    individuals: clients.filter((c) => c.client_type === "individual").length,
  };

  return (
    <MainLayout>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <DashboardHeader
          title="Clients"
          description="Manage your professional and individual clients"
        />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
            <p className="text-muted-foreground mt-1">
              Manage your clients and view their purchase history
            </p>
          </div>
          <Button
            onClick={() => setOpenDialog(true)}
            className="gap-2"
            size="lg"
          >
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </div>

        {/* Stats Cards */}
        {!loading && (
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Total Clients" value={stats.total} icon="💼" />
            <StatCard
              label="Professionals"
              value={stats.professionals}
              icon="👔"
            />
            <StatCard label="Individuals" value={stats.individuals} icon="👤" />
          </div>
        )}

        {/* Filters Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">
              Search clients
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                className="pl-10"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>
          </div>

          <div className="w-full sm:w-48">
            <label
              htmlFor="type-filter"
              className="text-sm font-medium mb-2 block"
            >
              Type
            </label>
            <select
              id="type-filter"
              value={filters.type || "all"}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  type: (e.target.value === "all"
                    ? "all"
                    : e.target.value) as ClientFilter["type"],
                })
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Types</option>
              <option value="professional">Professionals</option>
              <option value="individual">Individuals</option>
            </select>
          </div>

          <div className="w-full sm:w-48">
            <label
              htmlFor="sort-filter"
              className="text-sm font-medium mb-2 block"
            >
              Sort by
            </label>
            <select
              id="sort-filter"
              value={filters.sortBy || "recent"}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  sortBy: e.target.value as ClientFilter["sortBy"],
                })
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
              <option value="purchases">Top Purchases</option>
            </select>
          </div>
        </div>

        {/* Clients Table or Loading */}
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-96 w-full" />
          </div>
        ) : sortedClients.length > 0 ? (
          <ClientsTable clients={sortedClients} onClientAdded={refetch} />
        ) : (
          <div className="rounded-lg border border-dashed py-12 text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-medium">No clients yet</h3>
            <p className="mt-1 text-muted-foreground">
              Start by adding your first client
            </p>
            <Button
              onClick={() => setOpenDialog(true)}
              variant="outline"
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </div>
        )}
      </div>

      {/* Add Client Dialog */}
      <AddClientDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onSuccess={handleAddClientSuccess}
      />
    </MainLayout>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}
