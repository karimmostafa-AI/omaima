import React from 'react'
import { ContainerComponent, PageBuilderComponent } from '@/types/page-builder'
import { cn } from '@/lib/utils'

interface ContainerRendererProps {
  component: ContainerComponent
  children?: React.ReactNode
  isEditing?: boolean
  onEdit?: (component: ContainerComponent) => void
  className?: string
}

export function ContainerRenderer({ 
  component, 
  children,
  isEditing = false, 
  onEdit,
  className 
}: ContainerRendererProps) {
  const { properties, styles } = component

  const containerStyles: React.CSSProperties = {
    margin: `${styles.margin.top}px ${styles.margin.right}px ${styles.margin.bottom}px ${styles.margin.left}px`,
    padding: `${styles.padding.top}px ${styles.padding.right}px ${styles.padding.bottom}px ${styles.padding.left}px`,
    backgroundColor: properties.backgroundColor || styles.backgroundColor || undefined,
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
    gap: `${properties.gap}px`,
  }

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full',
  }

  const flexDirectionClasses = {
    row: 'flex-row',
    column: 'flex-col',
  }

  const alignItemsClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }

  const justifyContentClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
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

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing && onEdit) {
      // Only handle click if clicking on the container itself, not children
      if (e.target === e.currentTarget) {
        onEdit(component)
      }
    }
  }

  // Only add onClick when in editing mode to avoid server-side issues
  const interactionProps = isEditing ? { onClick: handleClick } : {}

  return (
    <div className={cn('w-full', responsiveClasses)}>
      <div
        className={cn(
          'mx-auto flex',
          maxWidthClasses[properties.maxWidth],
          flexDirectionClasses[properties.flexDirection],
          alignItemsClasses[properties.alignItems],
          justifyContentClasses[properties.justifyContent],
          isEditing && 'cursor-pointer hover:outline hover:outline-2 hover:outline-blue-500 hover:outline-offset-2 min-h-[60px]'
        )}
        style={containerStyles}
        {...interactionProps}
      >
        {children || (
          isEditing && (
            <div className="flex items-center justify-center w-full text-gray-400 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p>Drop components here</p>
              </div>
            </div>
          )
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