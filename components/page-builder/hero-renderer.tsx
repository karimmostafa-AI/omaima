import React from 'react'
import Link from 'next/link'
import { HeroComponent } from '@/types/page-builder'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface HeroRendererProps {
  component: HeroComponent
  isEditing?: boolean
  onEdit?: (component: HeroComponent) => void
  className?: string
}

export function HeroRenderer({ 
  component, 
  isEditing = false, 
  onEdit,
  className 
}: HeroRendererProps) {
  const { properties, styles } = component

  const containerStyles: React.CSSProperties = {
    margin: `${styles.margin.top}px ${styles.margin.right}px ${styles.margin.bottom}px ${styles.margin.left}px`,
    padding: `${styles.padding.top}px ${styles.padding.right}px ${styles.padding.bottom}px ${styles.padding.left}px`,
    backgroundColor: properties.backgroundColor,
    backgroundImage: properties.backgroundImage ? `url(${properties.backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    borderRadius: `${styles.borderRadius}px`,
    border: styles.border.width > 0 
      ? `${styles.border.width}px ${styles.border.style} ${styles.border.color}`
      : undefined,
    boxShadow: styles.shadow.enabled 
      ? `0 ${styles.shadow.blur}px ${styles.shadow.spread}px rgba(${hexToRgb(styles.shadow.color)}, ${styles.shadow.opacity})`
      : undefined,
    color: properties.textColor,
    position: 'relative',
  }

  const overlayStyles: React.CSSProperties = properties.overlay?.enabled ? {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `rgba(${hexToRgb(properties.overlay?.color || '#000000')}, ${properties.overlay?.opacity || 0.5})`,
    borderRadius: `${styles.borderRadius}px`,
  } : {}

  const heightClasses = {
    sm: 'min-h-[200px]',
    md: 'min-h-[300px]',
    lg: 'min-h-[400px]',
    xl: 'min-h-[500px]',
    screen: 'min-h-screen',
  }

  const titleSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    '2xl': 'text-4xl',
    '3xl': 'text-5xl',
  }

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
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

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        heightClasses[properties.height],
        responsiveClasses,
        isEditing && 'cursor-pointer hover:outline hover:outline-2 hover:outline-blue-500 hover:outline-offset-2'
      )}
      style={containerStyles}
      {...interactionProps}
    >
      {/* Overlay */}
      {properties.overlay?.enabled && (
        <div style={overlayStyles} />
      )}

      {/* Content */}
      <div className={cn('relative z-10 max-w-4xl mx-auto px-6', alignmentClasses[properties.alignment])}>
        <h1 className={cn('font-bold mb-4', titleSizeClasses[properties.titleSize])}>
          {properties.title}
        </h1>
        
        {properties.subtitle && (
          <p className="text-lg mb-8 opacity-90">
            {properties.subtitle}
          </p>
        )}

        {properties.cta?.enabled && properties.cta?.text && !isEditing && (
          <Link href={properties.cta?.link || '#'}>
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              {properties.cta?.text}
            </Button>
          </Link>
        )}

        {properties.cta?.enabled && properties.cta?.text && isEditing && (
          <Button size="lg" className="bg-white text-black hover:bg-gray-100">
            {properties.cta?.text}
          </Button>
        )}
      </div>
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