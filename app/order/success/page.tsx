"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Thank you for your order!
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Your order has been placed successfully. You will receive an email confirmation shortly.
      </p>
      <div className="mt-10">
        <Button asChild size="lg">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
