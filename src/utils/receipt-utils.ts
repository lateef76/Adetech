/**
 * Receipt Utility Functions
 * Export, Print, Download, and Send receipt operations
 */

import type { Receipt } from "@/types/receipt";

/**
 * Export receipts to CSV format
 */
export function exportReceiptsToCSV(receipts: Receipt[]): void {
  if (receipts.length === 0) {
    alert("No receipts to export");
    return;
  }

  // Prepare CSV headers
  const headers = [
    "Receipt #",
    "Client Name",
    "Amount",
    "Total Tax",
    "Subtotal",
    "Status",
    "Date",
    "Payment Method",
    "Items Count",
  ];

  // Prepare CSV rows
  const rows = receipts.map((receipt) => [
    receipt.receiptNumber,
    receipt.clientName,
    receipt.total.toString(),
    receipt.tax.toString(),
    receipt.subtotal.toString(),
    receipt.status,
    new Date(receipt.issueDate).toLocaleDateString(),
    receipt.paymentMethod,
    receipt.items.length.toString(),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) => `"${cell.replace(/"/g, '""')}"`) // Escape quotes
        .join(",")
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `receipts-export-${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Print a single receipt
 */
export function printReceipt(receipt: Receipt, withStamp: boolean = false): void {
  try {
    // Ensure items array exists
    const items = Array.isArray(receipt.items) ? receipt.items : [];
    
    const printWindow = window.open("", "", "height=600,width=800");
    if (!printWindow) {
      alert("Unable to open print window. Please check your browser settings.");
      return;
    }

    const itemsHTML = items
      .map(
        (item) => `
    <tr>
      <td style="padding: 8px; text-align: left; border-bottom: 1px solid #e5e7eb;">${item.productName || "N/A"}</td>
      <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e5e7eb;">${item.quantity || 0}</td>
      <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb;">${(item.unitPrice || 0).toLocaleString()} XOF</td>
      <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb;">${(item.total || 0).toLocaleString()} XOF</td>
    </tr>
  `
      )
      .join("");

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt ${receipt.receiptNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #1f2937;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #7c3aed;
            padding-bottom: 15px;
          }
          .header h1 {
            margin: 0;
            color: #7c3aed;
            font-size: 24px;
          }
          .receipt-number {
            color: #6b7280;
            font-size: 14px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-weight: bold;
            color: #374151;
            margin-bottom: 8px;
            font-size: 12px;
            text-transform: uppercase;
          }
          .client-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .info-block {
            flex: 1;
          }
          .info-block p {
            margin: 4px 0;
            font-size: 14px;
          }
          .info-label {
            color: #6b7280;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .info-value {
            color: #1f2937;
            margin-top: 2px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th {
            background-color: #f3f4f6;
            padding: 10px;
            text-align: left;
            font-weight: bold;
            font-size: 12px;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
          }
          .totals {
            display: flex;
            justify-content: flex-end;
            gap: 40px;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            min-width: 250px;
            margin-bottom: 8px;
            font-size: 14px;
          }
          .total-row .label {
            color: #6b7280;
          }
          .total-row .value {
            font-weight: bold;
            color: #1f2937;
          }
          .grand-total {
            display: flex;
            justify-content: space-between;
            min-width: 250px;
            padding: 12px 0;
            border-top: 2px solid #7c3aed;
            border-bottom: 2px solid #7c3aed;
            font-size: 16px;
            margin-top: 12px;
          }
          .grand-total .label {
            font-weight: bold;
            color: #7c3aed;
          }
          .grand-total .value {
            font-weight: bold;
            color: #7c3aed;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .status-paid {
            background-color: #d1fae5;
            color: #065f46;
          }
          .status-pending {
            background-color: #fef3c7;
            color: #b45309;
          }
          .status-draft {
            background-color: #f3f4f6;
            color: #374151;
          }
          .status-issued {
            background-color: #dbeafe;
            color: #0c4a6e;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
          }
          .paid-stamp {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-15deg);
            width: 220px;
            height: 220px;
            border: 6px solid rgba(220, 38, 38, 0.8);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            pointer-events: none;
            z-index: 9999;
          }
          .paid-stamp-inner {
            width: 196px;
            height: 196px;
            border: 3px solid rgba(220, 38, 38, 0.8);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
          }
          .paid-stamp-text {
            font-size: 48px;
            font-weight: 900;
            color: rgba(220, 38, 38, 0.8);
            letter-spacing: 0.2em;
            line-height: 1;
          }
          .paid-stamp-date {
            font-size: 12px;
            font-weight: 700;
            color: rgba(220, 38, 38, 0.8);
            margin-top: 8px;
          }
          @media print {
            body { margin: 0; }
            .paid-stamp { position: fixed; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Receipt</h1>
          <div class="receipt-number">${receipt.receiptNumber}</div>
        </div>

        <div class="client-info">
          <div class="info-block">
            <div class="section-title">From</div>
            <p class="info-value">Adetech Solutions</p>
          </div>
          <div class="info-block">
            <div class="section-title">Bill To</div>
            <p class="info-value">${receipt.clientName || "N/A"}</p>
            ${receipt.clientEmail ? `<p class="info-value">${receipt.clientEmail}</p>` : ""}
          </div>
          <div class="info-block">
            <div class="info-label">Receipt Date</div>
            <p class="info-value">${receipt.issueDate ? new Date(receipt.issueDate).toLocaleDateString() : "N/A"}</p>
            <div class="info-label" style="margin-top: 8px;">Status</div>
            <div class="status-badge status-${receipt.status}">${(receipt.status || "draft").toUpperCase()}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: center; width: 80px;">Qty</th>
              <th style="text-align: right; width: 120px;">Unit Price</th>
              <th style="text-align: right; width: 120px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML || '<tr><td colspan="4" style="padding: 8px; text-align: center; color: #6b7280;">No items</td></tr>'}
          </tbody>
        </table>

        <div class="totals">
          <div>
            <div class="total-row">
              <span class="label">Subtotal:</span>
              <span class="value">${(receipt.subtotal || 0).toLocaleString()} XOF</span>
            </div>
            ${
              (receipt.tax || 0) > 0
                ? `
              <div class="total-row">
                <span class="label">Tax (${((receipt.taxRate || 0) * 100).toFixed(0)}%):</span>
                <span class="value">${(receipt.tax || 0).toLocaleString()} XOF</span>
              </div>
            `
                : ""
            }
            <div class="grand-total">
              <span class="label">Total Due:</span>
              <span class="value">${(receipt.total || 0).toLocaleString()} XOF</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for your business!</p>
          <p style="margin-top: 10px; font-size: 11px;">This is a computer-generated receipt. No signature is required.</p>
        </div>

        ${withStamp ? `
        <div class="paid-stamp">
          <div class="paid-stamp-inner">
            <div class="paid-stamp-text">PAID</div>
            <div class="paid-stamp-date">${new Date().toLocaleDateString()}</div>
          </div>
        </div>
        ` : ''}
      </body>
    </html>
  `;

    printWindow.document.write(html);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 250);
  } catch (error) {
    console.error("Error printing receipt:", error);
    alert("Failed to print receipt. Check console for details.");
  }
}

/**
 * Download receipt as proper PDF with optional paid stamp
 */
export async function downloadReceiptPDF(receipt: Receipt, withPaidStamp: boolean = false): Promise<void> {
  try {
    const { jsPDF } = await import("jspdf");
    
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 15;

    // Header - Company Info
    doc.setFontSize(24);
    doc.setTextColor(124, 58, 237); // Purple
    doc.text("RECEIPT", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(receipt.receiptNumber, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 12;

    // Horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPosition, pageWidth - 15, yPosition);
    yPosition += 8;

    // Company & Client Info
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128); // Gray
    doc.text("FROM", 15, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.text("Adetech Business Solutions", 15, yPosition + 5);
    yPosition += 12;

    doc.setTextColor(107, 114, 128);
    doc.text("BILL TO", 15, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.text(receipt.clientName, 15, yPosition + 5);
    if (receipt.clientEmail) {
      doc.setFontSize(9);
      doc.text(receipt.clientEmail, 15, yPosition + 10);
      yPosition += 15;
    } else {
      yPosition += 12;
    }

    // Date info
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(`Issue Date: ${new Date(receipt.issueDate).toLocaleDateString()}`, pageWidth - 15, yPosition, { align: "right" });
    if (receipt.dueDate) {
      doc.text(`Due Date: ${new Date(receipt.dueDate).toLocaleDateString()}`, pageWidth - 15, yPosition + 5, { align: "right" });
    }
    yPosition += 12;

    // Items Table
    doc.setDrawColor(0, 0, 0);
    doc.line(15, yPosition, pageWidth - 15, yPosition);
    yPosition += 6;

    // Table headers
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81); // Dark gray
    doc.setFont("helvetica", "bold");
    doc.text("Description", 15, yPosition);
    doc.text("Qty", pageWidth - 60, yPosition);
    doc.text("Unit Price", pageWidth - 45, yPosition);
    doc.text("Amount", pageWidth - 15, yPosition, { align: "right" });

    yPosition += 6;
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPosition, pageWidth - 15, yPosition);
    yPosition += 5;

    // Table rows
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);

    const items = Array.isArray(receipt.items) ? receipt.items : [];
    items.forEach((item) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 15;
      }
      
      doc.text(item.productName || "N/A", 15, yPosition);
      doc.text(item.quantity.toString(), pageWidth - 60, yPosition);
      doc.text(`${item.unitPrice.toLocaleString()} XOF`, pageWidth - 45, yPosition);
      doc.text(`${item.total.toLocaleString()} XOF`, pageWidth - 15, yPosition, { align: "right" });
      yPosition += 5;
    });

    yPosition += 5;
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPosition, pageWidth - 15, yPosition);
    yPosition += 8;

    // Totals
    const totalStartX = pageWidth - 60;
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);

    doc.text("Subtotal:", totalStartX, yPosition);
    doc.text(`${receipt.subtotal.toLocaleString()} XOF`, pageWidth - 15, yPosition, { align: "right" });
    yPosition += 6;

    if (receipt.tax > 0) {
      doc.text(`Tax (${receipt.taxRate}%):`, totalStartX, yPosition);
      doc.text(`${receipt.tax.toLocaleString()} XOF`, pageWidth - 15, yPosition, { align: "right" });
      yPosition += 6;
    }

    // Grand Total
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(124, 58, 237); // Purple
    doc.setDrawColor(124, 58, 237);
    doc.line(totalStartX, yPosition, pageWidth - 15, yPosition);
    yPosition += 6;
    doc.text("TOTAL:", totalStartX, yPosition);
    doc.text(`${receipt.total.toLocaleString()} XOF`, pageWidth - 15, yPosition, { align: "right" });
    yPosition += 6;
    doc.line(totalStartX, yPosition, pageWidth - 15, yPosition);

    yPosition += 12;

    // Payment Info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(`Payment Method: ${receipt.paymentMethod.replace("_", " ").toUpperCase()}`, 15, yPosition);
    if (receipt.paymentDate) {
      doc.text(`Paid Date: ${new Date(receipt.paymentDate).toLocaleDateString()}`, 15, yPosition + 5);
    }

    // Add Paid Stamp if requested
    if (withPaidStamp && receipt.status === "paid") {
      const stampX = pageWidth - 40;
      const stampY = 40;
      const stampRadius = 22;
      
      // Save the current state and apply rotation
      doc.saveGraphicsState();
      
      // Move to stamp position
      doc.setDrawColor(220, 38, 38); // Red
      doc.setLineWidth(1.2);
      
      // Draw outer circle
      doc.circle(stampX, stampY, stampRadius, "S");
      
      // Draw inner circle for depth
      doc.circle(stampX, stampY, stampRadius - 3, "S");
      
      // Add PAID text - bold and larger
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(220, 38, 38);
      doc.text("PAID", stampX, stampY - 2, { align: "center" });

      // Add date inside stamp - below PAID
      doc.setFontSize(7);
      doc.setTextColor(220, 38, 38);
      doc.text(new Date().toLocaleDateString(), stampX, stampY + 6, { align: "center" });
      
      // Restore graphics state
      doc.restoreGraphicsState();
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text("Thank you for your business!", pageWidth / 2, pageHeight - 10, { align: "center" });
    doc.text("This is a computer-generated receipt.", pageWidth / 2, pageHeight - 5, { align: "center" });

    // Save PDF
    doc.save(`receipt-${receipt.receiptNumber}-${new Date().toISOString().split("T")[0]}.pdf`);
  } catch (error) {
    console.error("Error downloading receipt as PDF:", error);
    alert("Failed to download receipt as PDF");
  }
}

/**
 * Send receipt via email
 */
export async function sendReceiptEmail(receipt: Receipt): Promise<void> {
  try {
    // In a production app, this would call a backend API to send email
    // For now, we'll show a modal to copy email info

    const emailSubject = `Receipt ${receipt.receiptNumber} - ${receipt.clientName}`;
    const emailBody = `
Dear ${receipt.clientName},

Please find your receipt details below:

Receipt Number: ${receipt.receiptNumber}
Date: ${new Date(receipt.issueDate).toLocaleDateString()}
Status: ${receipt.status}

Items:
${receipt.items.map((item) => `- ${item.productName}: ${item.quantity} x ${item.unitPrice} XOF = ${item.total} XOF`).join("\n")}

Subtotal: ${receipt.subtotal.toLocaleString()} XOF
${receipt.tax > 0 ? `Tax: ${receipt.tax.toLocaleString()} XOF` : ""}
Total: ${receipt.total.toLocaleString()} XOF

Thank you for your business!

Best regards,
Adetech Solutions
    `.trim();

    // Create mailto link
    const mailtoLink = `mailto:${receipt.clientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Open default email client
    window.location.href = mailtoLink;

    // Show confirmation
    alert(`Email client opened for ${receipt.clientEmail}`);
  } catch (error) {
    console.error("Error sending receipt:", error);
    alert("Failed to send receipt email");
  }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-SN", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(amount);
}
