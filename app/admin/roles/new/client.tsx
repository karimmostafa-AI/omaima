"use client"

import { useState } from "react"
import { RoleForm, RoleFormValues } from "@/components/role-form"
import { createRole } from "../actions"
import { Permission } from "@/types/role"

export function NewRolePageClient({ permissions }: { permissions: Permission[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (values: RoleFormValues) => {
    setIsSubmitting(true)
    setError(null)
    const result = await createRole(values)
    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
    }
    // On success, the server action will redirect.
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add New Role</h1>
        <p className="text-muted-foreground">Fill out the form below to add a new role.</p>
      </div>
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive-foreground border border-destructive rounded-md">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      <RoleForm
        permissions={permissions}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
