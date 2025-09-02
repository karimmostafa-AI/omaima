"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Category } from "@/types/category"
import slugify from "slugify"

// Form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
  description: z.string().optional(),
})

export type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
  category?: Category;
  onSubmit: (values: CategoryFormValues) => void;
  isSubmitting?: boolean;
}

export function CategoryForm({ category, onSubmit, isSubmitting = false }: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      description: category?.description || "",
    },
  })

  const nameValue = form.watch("name")

  React.useEffect(() => {
    if (nameValue && !category) { // Only auto-slug for new categories
      form.setValue("slug", slugify(nameValue, { lower: true, strict: true }))
    }
  }, [nameValue, form, category])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Formal Suits" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. formal-suits" {...field} />
                </FormControl>
                <FormDescription>
                  This is the URL-friendly version of the name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe this category..." 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Optional description to help customers understand this category.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? "Saving..." : (category ? "Save Changes" : "Create Category")}
          </Button>
        </div>
      </form>
    </Form>
  )
}