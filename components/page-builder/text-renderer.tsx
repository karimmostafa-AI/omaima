import React from 'react'
import { TextComponent } from '@/types/page-builder'
import { cn } from '@/lib/utils'

interface TextRendererProps {
  component: TextComponent
  isEditing?: boolean
  onEdit?: (component: TextComponent) => void
  className?: string
}

export function TextRenderer({ 
  component, 
  isEditing = false, 
  onEdit,
  className 
}: TextRendererProps) {
  const { properties, styles } = component

  const textStyles: React.CSSProperties = {
    fontSize: `${properties.fontSize}px`,
    fontWeight: properties.fontWeight,
    fontFamily: properties.fontFamily !== 'inherit' ? properties.fontFamily : undefined,
    color: properties.color,
    textAlign: properties.textAlign,
    lineHeight: properties.lineHeight,
    letterSpacing: `${properties.letterSpacing}px`,
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
        responsiveClasses,
        isEditing && 'cursor-pointer hover:outline hover:outline-2 hover:outline-blue-500 hover:outline-offset-2'
      )}
      style={textStyles}
      {...interactionProps}
      dangerouslySetInnerHTML={{ __html: properties.content }}
    />
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