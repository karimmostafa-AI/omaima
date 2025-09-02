import React from 'react'
import Link from 'next/link'
import { ButtonComponent } from '@/types/page-builder'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import * as Icons from 'lucide-react'

interface ButtonRendererProps {
  component: ButtonComponent
  isEditing?: boolean
  onEdit?: (component: ButtonComponent) => void
  className?: string
}

export function ButtonRenderer({ 
  component, 
  isEditing = false, 
  onEdit,
  className 
}: ButtonRendererProps) {
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

  const buttonStyles: React.CSSProperties = {
    backgroundColor: properties.backgroundColor,
    color: properties.textColor,
    borderColor: properties.borderColor,
    '--hover-bg': properties.hoverBackgroundColor,
    '--hover-text': properties.hoverTextColor,
  } as React.CSSProperties & { [key: string]: string }

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

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.preventDefault()
      e.stopPropagation()
      if (onEdit) {
        onEdit(component)
      }
    }
  }

  // Get icon component if specified
  const IconComponent = properties.icon ? (Icons as any)[properties.icon] : null

  // Map our custom variants to Button component variants
  const mapVariant = (variant: string) => {
    switch (variant) {
      case 'primary': return 'default'
      case 'secondary': return 'secondary'
      case 'outline': return 'outline'
      case 'ghost': return 'ghost'
      default: return 'default'
    }
  }

  // Map our custom sizes to Button component sizes
  const mapSize = (size: string) => {
    switch (size) {
      case 'sm': return 'sm'
      case 'md': return 'default'
      case 'lg': return 'lg'
      case 'xl': return 'lg' // Button component doesn't have xl, use lg
      default: return 'default'
    }
  }

  // Only add onClick when in editing mode to avoid server-side issues
  const interactionProps = isEditing ? { onClick: handleClick } : {}

  const buttonContent = (
    <Button
      variant={mapVariant(properties.variant) as any}
      size={mapSize(properties.size) as any}
      style={buttonStyles}
      className={cn(
        'hover:bg-[var(--hover-bg)] hover:text-[var(--hover-text)]',
        isEditing && 'cursor-pointer'
      )}
      {...interactionProps}
    >
      {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
      {properties.text}
    </Button>
  )

  const content = (
    <div
      className={cn(
        responsiveClasses,
        isEditing && 'hover:outline hover:outline-2 hover:outline-blue-500 hover:outline-offset-2'
      )}
      style={containerStyles}
    >
      {buttonContent}
    </div>
  )

  // If not editing and has a link, wrap in Link component
  if (!isEditing && properties.link.url) {
    return (
      <Link
        href={properties.link.url}
        target={properties.link.target}
        className="inline-block"
      >
        {content}
      </Link>
    )
  }

  return content
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