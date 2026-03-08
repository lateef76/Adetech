/**
 * ReceiptsTable Component - Display receipts in a table
 */

import type { Receipt } from "@/types/receipt";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  Download,
  FileText,
  Send,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReceiptsTableProps {
  receipts: Receipt[];
  onView?: (receipt: Receipt) => void;
  onEdit?: (receipt: Receipt) => void;
  onDelete?: (receiptId: string) => Promise<void>;
  onPrint?: (receipt: Receipt) => void;
  onDownload?: (receipt: Receipt) => void;
  onSend?: (receipt: Receipt) => void;
  isLoading?: boolean;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  issued: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
};

export function ReceiptsTable({
  receipts,
  onView,
  onEdit,
  onDelete,
  onPrint,
  onDownload,
  onSend,
  isLoading,
}: ReceiptsTableProps) {
  if (receipts.length === 0) {
    return (
      <div className="text-center py-8 text-slate-600 dark:text-slate-400">
        No receipts found
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Receipt #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipts.map((receipt) => (
            <TableRow key={receipt.id}>
              <TableCell className="font-semibold">
                {receipt.receiptNumber}
              </TableCell>
              <TableCell>{receipt.clientName}</TableCell>
              <TableCell>
                {new Intl.NumberFormat("fr-SN", {
                  style: "currency",
                  currency: "XOF",
                  minimumFractionDigits: 0,
                }).format(receipt.total)}
              </TableCell>
              <TableCell>
                {new Date(receipt.issueDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    statusColors[receipt.status] || "bg-gray-100 text-gray-800"
                  }
                >
                  {receipt.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView?.(receipt)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(receipt)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDownload?.(receipt)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPrint?.(receipt)}>
                      <FileText className="w-4 h-4 mr-2" />
                      Print
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSend?.(receipt)}>
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDelete?.(receipt.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
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
  );
}
