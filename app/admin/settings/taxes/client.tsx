"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tax } from "@/types/tax"

interface TaxesClientProps {
  taxes: Tax[]
}

export default function TaxesClient({ taxes }: TaxesClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Taxes</h1>
        <Button asChild>
          <Link href="/admin/settings/taxes/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Tax
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taxes.map(tax => (
              <TableRow key={tax.id}>
                <TableCell className="font-medium">{tax.name}</TableCell>
                <TableCell>{tax.rate}%</TableCell>
                <TableCell>{tax.type}</TableCell>
                <TableCell>
                  <Badge variant={tax.is_active ? 'default' : 'secondary'}>
                    {tax.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/settings/taxes/${tax.id}/edit`}>Edit</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {taxes.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          No taxes found.
        </div>
      )}
    </div>
  )
}
