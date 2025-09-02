"use client"

import React, { useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Link, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  maxImages?: number
  disabled?: boolean
}

export function ImageUpload({ value, onChange, maxImages = 5, disabled = false }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMode, setUploadMode] = useState<"upload" | "url">("upload")
  const [urlInput, setUrlInput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()
  const images = value ? value.split(", ").filter(Boolean) : []

  // Optimize image by resizing
  const optimizeImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = document.createElement("img")

      img.onload = () => {
        // Calculate optimal dimensions (max 800x800, maintain aspect ratio)
        const maxSize = 800
        let { width, height } = img

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }))
            } else {
              resolve(file)
            }
          },
          "image/jpeg",
          0.85 // 85% quality
        )
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const uploadToStorage = async (file: File): Promise<string> => {
    try {
      // Optimize image before upload
      const optimizedFile = await optimizeImage(file)
      
      // Generate unique filename
      const fileExt = optimizedFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `products/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, optimizedFile, {
          cacheControl: "3600",
          upsert: false
        })

      if (error) {
        throw error
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(data.path)

      return publicUrl
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Upload failed")
    }
  }

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    if (images.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed`)
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const uploadPromises = Array.from(files).slice(0, maxImages - images.length).map(file => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not a valid image file`)
        }
        
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is too large. Maximum size is 5MB`)
        }

        return uploadToStorage(file)
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      const newImages = [...images, ...uploadedUrls]
      onChange(newImages.join(", "))
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }, [images, maxImages, onChange])

  const handleUrlAdd = () => {
    if (!urlInput.trim()) return
    if (images.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed`)
      return
    }

    // Basic URL validation
    try {
      new URL(urlInput)
      const newImages = [...images, urlInput.trim()]
      onChange(newImages.join(", "))
      setUrlInput("")
      setError(null)
    } catch {
      setError("Please enter a valid URL")
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages.join(", "))
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (disabled) return
    handleFileUpload(e.dataTransfer.files)
  }, [handleFileUpload, disabled])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Label>Product Images</Label>
        <Badge variant="secondary">{images.length}/{maxImages}</Badge>
      </div>

      {/* Upload Mode Toggle */}
      <div className="flex space-x-2">
        <Button
          type="button"
          variant={uploadMode === "upload" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMode("upload")}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Files
        </Button>
        <Button
          type="button"
          variant={uploadMode === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMode("url")}
        >
          <Link className="h-4 w-4 mr-2" />
          Add URL
        </Button>
      </div>

      {/* Upload Area */}
      {uploadMode === "upload" && (
        <Card
          className={`border-2 border-dashed transition-colors ${
            disabled ? "border-muted" : "border-border hover:border-primary"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            {isUploading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading and optimizing images...</span>
              </div>
            ) : (
              <>
                <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop images here, or click to select files
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Supports: JPG, PNG, WebP (Max 5MB each)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={disabled || images.length >= maxImages}
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <Label htmlFor="image-upload" asChild>
                  <Button 
                    type="button" 
                    disabled={disabled || images.length >= maxImages}
                    className="cursor-pointer"
                  >
                    Select Images
                  </Button>
                </Label>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* URL Input */}
      {uploadMode === "url" && (
        <div className="flex space-x-2">
          <Input
            placeholder="Enter image URL (https://...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            disabled={disabled || images.length >= maxImages}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUrlAdd())}
          />
          <Button
            type="button"
            onClick={handleUrlAdd}
            disabled={!urlInput.trim() || disabled || images.length >= maxImages}
          >
            Add
          </Button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {images.map((imageUrl, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-1">
                <div className="relative aspect-square">
                  <Image
                    src={imageUrl}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {index === 0 && (
                    <Badge className="absolute bottom-1 left-1 text-xs">
                      Primary
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-muted-foreground">
        {uploadMode === "upload" 
          ? "Images will be automatically optimized and resized for web performance. The first image will be used as the primary product image."
          : "Enter direct image URLs. Make sure the URLs are accessible and point to image files. The first image will be used as the primary product image."
        }
      </p>
    </div>
  )
}