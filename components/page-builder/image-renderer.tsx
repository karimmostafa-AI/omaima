import React from 'react'
import Image from 'next/image'
import { ImageComponent } from '@/types/page-builder'
import { cn } from '@/lib/utils'

interface ImageRendererProps {
  component: ImageComponent
  isEditing?: boolean
  onEdit?: (component: ImageComponent) => void
  className?: string
}

export function ImageRenderer({ 
  component, 
  isEditing = false, 
  onEdit,
  className 
}: ImageRendererProps) {
  const { properties, styles } = component

  const containerStyles: React.CSSProperties = {
    margin: `${styles.margin.top}px ${styles.margin.right}px ${styles.margin.bottom}px ${styles.margin.left}px`,
    padding: `${styles.padding.top}px ${styles.padding.right}px ${styles.padding.bottom}px ${styles.padding.left}px`,
    backgroundColor: styles.backgroundColor || undefined,
    borderRadius: `${styles.borderRadius}px`,
    border: styles.border.width > 0 
      ? `${styles.border.width}px ${styles.border.style} ${styles.border.color}`
      : undefined,
    boxShadow: styles.shadow.enabled 
      ? `0 ${styles.shadow.blur}px ${styles.shadow.spread}px rgba(${hexToRgb(styles.shadow.color)}, ${styles.shadow.opacity})`
      : undefined,
  }

  const imageStyles: React.CSSProperties = {
    borderRadius: `${properties.borderRadius}px`,
    objectFit: properties.objectFit,
    width: properties.width ? `${properties.width}px` : '100%',
    height: properties.height ? `${properties.height}px` : 'auto',
  }

  const responsiveClasses = cn(
    'transition-all duration-200',
    // Mobile styles
    styles.responsive.mobile.display === 'none' && 'hidden',
    styles.responsive.mobile.display === 'flex' && 'flex md:hidden',
    styles.responsive.mobile.display === 'block' && 'block md:hidden',
    // Tablet styles
    styles.responsive.tablet.display === 'none' && 'md:hidden lg:block',
    styles.responsive.tablet.display === 'flex' && 'hidden md:flex lg:hidden',
    styles.responsive.tablet.display === 'block' && 'hidden md:block lg:hidden',
    // Desktop styles
    styles.responsive.desktop.display === 'none' && 'lg:hidden',
    styles.responsive.desktop.display === 'flex' && 'hidden lg:flex',
    styles.responsive.desktop.display === 'block' && 'hidden lg:block',
    className
  )

  const handleClick = () => {
    if (isEditing && onEdit) {
      onEdit(component)
    }
  }

  // Only add onClick when in editing mode to avoid server-side issues
  const interactionProps = isEditing ? { onClick: handleClick } : {}

  // Placeholder when no image is provided
  if (!properties.src) {
    return (
      <div
        className={cn(
          responsiveClasses,
          'bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 min-h-[200px]',
          isEditing && 'cursor-pointer hover:bg-gray-50'
        )}
        style={containerStyles}
        {...interactionProps}
      >
        <div className="text-center">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm">
            {isEditing ? 'Click to add image' : 'No image'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        responsiveClasses,
        isEditing && 'cursor-pointer hover:outline hover:outline-2 hover:outline-blue-500 hover:outline-offset-2'
      )}
      style={containerStyles}
      {...interactionProps}
    >
      <Image
        src={properties.src}
        alt={properties.alt}
        width={properties.width || 600}
        height={properties.height || 400}
        style={imageStyles}
        className="w-full h-auto"
      />
    </div>
  )
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0, 0, 0'
  
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ].join(', ')
}