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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Page } from "@/types/page"
import slugify from "slugify"

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
  content: z.string().optional(),
  is_published: z.boolean().default(false),
})

export type PageFormValues = z.infer<typeof formSchema>

interface StaticPageFormProps {
  page?: Page;
  onSubmit: (values: PageFormValues) => void;
  isSubmitting: boolean;
}

export function StaticPageForm({ page, onSubmit, isSubmitting }: StaticPageFormProps) {
  const form = useForm<PageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: page?.title || "",
      slug: page?.slug || "",
      content: page?.content || "",
      is_published: page?.is_published ?? false,
    },
  })

  const titleValue = form.watch("title")

  React.useEffect(() => {
    if (titleValue && !page) { // Only auto-slug for new pages
      form.setValue("slug", slugify(titleValue, { lower: true, strict: true }))
    }
  }, [titleValue, form, page])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. About Us" {...field} />
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
                    <Input placeholder="e.g. about-us" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your page content here..." {...field} rows={15} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="is_published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Published</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
          {isSubmitting ? "Saving..." : (page ? "Save Changes" : "Create Page")}
        </Button>
      </form>
    </Form>
  )
}
