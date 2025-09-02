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
import { Role } from "@/types/role"

interface RolesClientProps {
  roles: Role[]
}

export default function RolesClient({ roles }: RolesClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Roles</h1>
        <Button asChild>
          <Link href="/admin/roles/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Role
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map(role => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>
                  {role.permissions?.map(p => p.name).join(', ')}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/roles/${role.id}/edit`}>Edit</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {roles.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          No roles found.
        </div>
      )}
    </div>
  )
}
