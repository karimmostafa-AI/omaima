"use client"

import * as React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/ui/image-upload"
import { Product, ColorImageMapping } from "@/types/product"
import { Category } from "@/types/category"
import { X, Plus, Palette } from "lucide-react"
import slugify from "slugify"

// Predefined color palette with hex values
const COLOR_PALETTE = [
  { name: "Black", hex: "#000000" },
  { name: "Navy Blue", hex: "#000080" },
  { name: "Charcoal Grey", hex: "#36454F" },
  { name: "Brown", hex: "#8B4513" },
  { name: "Burgundy", hex: "#800020" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Cream", hex: "#F5F5DC" },
  { name: "Light Grey", hex: "#D3D3D3" },
  { name: "Dark Green", hex: "#006400" },
  { name: "Royal Blue", hex: "#4169E1" },
  { name: "Maroon", hex: "#800000" },
  { name: "Beige", hex: "#F5F5DC" },
]

// Predefined size options
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]

// Form schema using Zod
const variantSchema = z.object({
  id: z.string().optional(),
  size: z.string(),
  color: z.string(),
  price_adjustment: z.coerce.number().default(0),
  stock: z.coerce.number().int().min(0).default(0),
  sku: z.string().optional(),
  is_active: z.boolean().default(true),
});

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
  description: z.string().optional(),
  base_price: z.coerce.number().positive("Base price must be a positive number."),
  category_id: z.coerce.number({ required_error: "Please select a category." }),
  images: z.string().optional(), // Legacy fallback images
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  color_images: z.record(z.array(z.string())).default({}),
  variants: z.array(variantSchema).default([]),
})

export type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSubmit: (values: ProductFormValues) => void;
  isSubmitting: boolean;
}

export function ProductForm({ product, categories, onSubmit, isSubmitting }: ProductFormProps) {
  const [selectedColors, setSelectedColors] = React.useState<string[]>(product?.colors || [])
  const [selectedSizes, setSelectedSizes] = React.useState<string[]>(product?.sizes || [])
  const [colorImages, setColorImages] = React.useState<ColorImageMapping>(product?.color_images || {})
  const [activeColorTab, setActiveColorTab] = React.useState<string>(selectedColors[0] || "")

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      base_price: product?.base_price || 0,
      category_id: product?.category_id || undefined,
      images: product?.images?.join(", ") || "",
      sizes: product?.sizes || [],
      colors: product?.colors || [],
      color_images: product?.color_images || {},
    },
  })

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const generateVariants = () => {
    const newVariants = [];
    for (const color of selectedColors) {
      for (const size of selectedSizes) {
        const existingVariant = fields.find(
          (v) => v.color === color && v.size === size
        );
        if (existingVariant) {
          newVariants.push(existingVariant);
        } else {
          newVariants.push({
            color,
            size,
            price_adjustment: 0,
            stock: 0,
            sku: "",
            is_active: true,
          });
        }
      }
    }
    replace(newVariants);
  };

  const nameValue = form.watch("name")

  React.useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        slug: product.slug,
        description: product.description,
        base_price: product.base_price || 0,
        category_id: product.category_id,
        images: product.images?.join(", "),
        sizes: product.sizes || [],
        colors: product.colors || [],
        color_images: product.color_images || {},
        variants: product.variants || [],
      });
      setSelectedColors(product.colors || []);
      setSelectedSizes(product.sizes || []);
      setColorImages(product.color_images || {});
    }
  }, [product, form]);

  React.useEffect(() => {
    if (nameValue && !product) { // Only auto-slug for new products
      form.setValue("slug", slugify(nameValue, { lower: true, strict: true }))
    }
  }, [nameValue, form, product])

  React.useEffect(() => {
    form.setValue("colors", selectedColors)
    form.setValue("sizes", selectedSizes)
    form.setValue("color_images", colorImages)
  }, [selectedColors, selectedSizes, colorImages, form])

  const handleColorToggle = (colorName: string) => {
    const newColors = selectedColors.includes(colorName)
      ? selectedColors.filter(c => c !== colorName)
      : [...selectedColors, colorName]
    
    setSelectedColors(newColors)
    
    // Remove color images if color is deselected
    if (!newColors.includes(colorName)) {
      const newColorImages = { ...colorImages }
      delete newColorImages[colorName]
      setColorImages(newColorImages)
    }
    
    // Set active tab to first color if current tab was removed
    if (!newColors.includes(activeColorTab)) {
      setActiveColorTab(newColors[0] || "")
    }
  }

  const handleSizeToggle = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size]
    
    setSelectedSizes(newSizes)
  }

  const handleColorImageChange = (colorName: string, imageUrls: string) => {
    const urls = imageUrls.split(',').map(url => url.trim()).filter(Boolean)
    setColorImages(prev => ({
      ...prev,
      [colorName]: urls
    }))
  }

  const handleFormSubmit = (values: ProductFormValues) => {
    // Transform the data for submission
    const submitData = {
      ...values,
      images: values.images?.split(',').map(url => url.trim()).filter(Boolean).join(', ') || "",
      colors: selectedColors,
      sizes: selectedSizes,
      color_images: colorImages,
    }
    onSubmit(submitData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Elegant Blazer" {...field} />
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
                    <Input placeholder="e.g. elegant-blazer" {...field} />
                  </FormControl>
                  <FormDescription>This is the URL-friendly version of the name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the product..." {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-8">
             <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="base_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>This is the base price. Variants can have price adjustments.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Color and Size Selection */}
        <div className="space-y-8 border-t pt-8">
          {/* Size Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Sizes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {SIZE_OPTIONS.map(size => (
                  <Button
                    key={size}
                    type="button"
                    variant={selectedSizes.includes(size) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSizeToggle(size)}
                    className="min-w-[50px]"
                  >
                    {size}
                  </Button>
                ))}
              </div>
              {selectedSizes.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Selected sizes:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedSizes.map(size => (
                      <Badge key={size} variant="secondary">
                        {size}
                        <X 
                          className="ml-1 h-3 w-3 cursor-pointer" 
                          onClick={() => handleSizeToggle(size)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Color Palette Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Palette
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {COLOR_PALETTE.map(color => (
                  <div key={color.name} className="text-center">
                    <button
                      type="button"
                      onClick={() => handleColorToggle(color.name)}
                      className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                        selectedColors.includes(color.name)
                          ? 'border-primary ring-2 ring-primary/50 scale-110'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                    <p className="text-xs mt-1 truncate">{color.name}</p>
                  </div>
                ))}
              </div>
              {selectedColors.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-3">Selected colors:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedColors.map(colorName => {
                      const color = COLOR_PALETTE.find(c => c.name === colorName)
                      return (
                        <Badge key={colorName} variant="secondary" className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full border" 
                            style={{ backgroundColor: color?.hex || '#000' }}
                          />
                          {colorName}
                          <X 
                            className="ml-1 h-3 w-3 cursor-pointer" 
                            onClick={() => handleColorToggle(colorName)}
                          />
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Variant Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Variants</CardTitle>
              <p className="text-sm text-muted-foreground">
                Generate variants based on selected sizes and colors.
              </p>
            </CardHeader>
            <CardContent>
              <Button type="button" onClick={generateVariants} disabled={selectedColors.length === 0 || selectedSizes.length === 0}>
                Generate Variants
              </Button>
            </CardContent>
          </Card>

          {/* Variants Table */}
          {fields.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generated Variants</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Color</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Price Adj.</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>{field.color}</TableCell>
                        <TableCell>{field.size}</TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`variants.${index}.price_adjustment`}
                            render={({ field }) => (
                              <Input type="number" step="0.01" {...field} />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`variants.${index}.stock`}
                            render={({ field }) => (
                              <Input type="number" {...field} />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`variants.${index}.sku`}
                            render={({ field }) => (
                              <Input {...field} />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`variants.${index}.is_active`}
                            render={({ field }) => (
                              <input type="checkbox" {...field} checked={field.value} />
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Color-Specific Images */}
          {selectedColors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Color-Specific Images</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload images for each color variant. These will be shown when customers select different colors.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Color Tabs */}
                <div className="flex flex-wrap gap-2 border-b">
                  {selectedColors.map(colorName => {
                    const color = COLOR_PALETTE.find(c => c.name === colorName)
                    return (
                      <button
                        key={colorName}
                        type="button"
                        onClick={() => setActiveColorTab(colorName)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                          activeColorTab === colorName
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div 
                          className="w-3 h-3 rounded-full border" 
                          style={{ backgroundColor: color?.hex || '#000' }}
                        />
                        {colorName}
                        {colorImages[colorName]?.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {colorImages[colorName].length}
                          </Badge>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Image Upload for Active Color */}
                {activeColorTab && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border" 
                        style={{ backgroundColor: COLOR_PALETTE.find(c => c.name === activeColorTab)?.hex || '#000' }}
                      />
                      <h3 className="font-medium">Images for {activeColorTab}</h3>
                    </div>
                    <div className="border rounded-lg p-4">
                      <FormField
                        name={`color_image_${activeColorTab}`}
                        render={() => (
                          <FormItem>
                            <FormControl>
                              <ImageUpload
                                value={colorImages[activeColorTab]?.join(', ') || ''}
                                onChange={(value) => handleColorImageChange(activeColorTab, value)}
                                maxImages={10}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormDescription>
                              Upload multiple images for the {activeColorTab} variant. Customers will see these when they select this color.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Legacy Images (fallback) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">General Product Images</CardTitle>
              <p className="text-sm text-muted-foreground">
                These images will be used as fallback when no color-specific images are available.
              </p>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        value={field.value || ""}
                        onChange={field.onChange}
                        maxImages={5}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
          {isSubmitting ? "Saving..." : (product ? "Save Changes" : "Create Product")}
        </Button>
      </form>
    </Form>
  )
}
