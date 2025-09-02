"use client"

import { useTransition } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateOrderStatus } from "./actions"

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'ready_for_pickup' | 'on_the_way' | 'delivered' | 'cancelled' | 'returned'

export function UpdateOrderStatus({
  orderId,
  currentStatus
}: {
  orderId: number,
  currentStatus: OrderStatus
}) {
  const [isPending, startTransition] = useTransition()
  const statuses: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'ready_for_pickup', 'on_the_way', 'delivered', 'cancelled', 'returned']

  const onStatusChange = (newStatus: OrderStatus) => {
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus)
      // We can add toast notifications here for success/error
    })
  }

  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={(value) => onStatusChange(value as OrderStatus)}
      disabled={isPending}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Change status..." />
      </SelectTrigger>
      <SelectContent>
        {statuses.map(status => (
          <SelectItem key={status} value={status}>
            <span className="capitalize">{status}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
