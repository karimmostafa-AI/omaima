"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Download } from "lucide-react"
import { Order } from "@/types/order"
interface SalesReportsClientProps {
  salesData: Order[]
}

const generateCsv = (data: Order[]) => {
  const headers = ['Order ID', 'Date', 'Customer', 'Total', 'Status'];
  const rows = data.map(order => {
    const customerName = order.shipping_address?.full_name || 'N/A';
    return [
      order.id,
      new Date(order.created_at).toLocaleDateString(),
      customerName,
      order.total_price.toFixed(2),
      order.status
    ].join(',');
  });
  return [headers.join(','), ...rows].join('\n');
};


export default function SalesReportsClient({ salesData }: SalesReportsClientProps) {
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  const filteredSalesData = useMemo(() => {
    return salesData.filter(order => {
      const orderDate = new Date(order.created_at)
      if (startDate && orderDate < new Date(startDate)) {
        return false
      }
      if (endDate && orderDate > new Date(endDate)) {
        return false
      }
      return true
    })
  }, [salesData, startDate, endDate])

  const handleExport = () => {
    const csvString = generateCsv(filteredSalesData);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sales-report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sales Reports</h1>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="border rounded-lg bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSalesData.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{order.customer?.first_name} {order.customer?.last_name}</TableCell>
                <TableCell className="text-right">${order.total_price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
