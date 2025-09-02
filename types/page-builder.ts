import { z } from "zod"

// Base component schema
export const BaseComponentSchema = z.object({
  id: z.string(),
  type: z.string(),
  order: z.number().default(0),
  parentId: z.string().optional(),
  styles: z.object({
    margin: z.object({
      top: z.number().default(0),
      right: z.number().default(0),
      bottom: z.number().default(0),
      left: z.number().default(0),
    }).default({}),
    padding: z.object({
      top: z.number().default(0),
      right: z.number().default(0),
      bottom: z.number().default(0),
      left: z.number().default(0),
    }).default({}),
    backgroundColor: z.string().optional(),
    borderRadius: z.number().default(0),
    border: z.object({
      width: z.number().default(0),
      style: z.enum(['none', 'solid', 'dashed', 'dotted']).default('none'),
      color: z.string().default('#000000'),
    }).default({}),
    shadow: z.object({
      enabled: z.boolean().default(false),
      blur: z.number().default(0),
      spread: z.number().default(0),
      color: z.string().default('#000000'),
      opacity: z.number().min(0).max(1).default(0.1),
    }).default({}),
    responsive: z.object({
      mobile: z.object({
        display: z.enum(['block', 'none', 'flex', 'grid']).default('block'),
        width: z.string().default('100%'),
      }).default({}),
      tablet: z.object({
        display: z.enum(['block', 'none', 'flex', 'grid']).default('block'),
        width: z.string().default('100%'),
      }).default({}),
      desktop: z.object({
        display: z.enum(['block', 'none', 'flex', 'grid']).default('block'),
        width: z.string().default('100%'),
      }).default({}),
    }).default({}),
  }).default({}),
})

// Text Component
export const TextComponentSchema = BaseComponentSchema.extend({
  type: z.literal('text'),
  properties: z.object({
    content: z.string().default('Enter your text here'),
    fontSize: z.number().default(16),
    fontWeight: z.enum(['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900']).default('normal'),
    fontFamily: z.string().default('inherit'),
    color: z.string().default('#000000'),
    textAlign: z.enum(['left', 'center', 'right', 'justify']).default('left'),
    lineHeight: z.number().default(1.5),
    letterSpacing: z.number().default(0),
  }),
})

// Image Component
export const ImageComponentSchema = BaseComponentSchema.extend({
  type: z.literal('image'),
  properties: z.object({
    src: z.string().url().optional(),
    alt: z.string().default(''),
    width: z.number().optional(),
    height: z.number().optional(),
    objectFit: z.enum(['contain', 'cover', 'fill', 'none', 'scale-down']).default('cover'),
    borderRadius: z.number().default(0),
  }),
})

// Button Component
export const ButtonComponentSchema = BaseComponentSchema.extend({
  type: z.literal('button'),
  properties: z.object({
    text: z.string().default('Click me'),
    variant: z.enum(['primary', 'secondary', 'outline', 'ghost']).default('primary'),
    size: z.enum(['sm', 'md', 'lg', 'xl']).default('md'),
    link: z.object({
      url: z.string().default(''),
      target: z.enum(['_self', '_blank']).default('_self'),
    }).default({}),
    icon: z.string().optional(),
    backgroundColor: z.string().default('#000000'),
    textColor: z.string().default('#ffffff'),
    borderColor: z.string().default('#000000'),
    hoverBackgroundColor: z.string().default('#333333'),
    hoverTextColor: z.string().default('#ffffff'),
  }),
})

// Hero Section Component
export const HeroComponentSchema = BaseComponentSchema.extend({
  type: z.literal('hero'),
  properties: z.object({
    title: z.string().default('Hero Title'),
    subtitle: z.string().default('Hero subtitle or description'),
    backgroundImage: z.string().url().optional(),
    backgroundColor: z.string().default('#f8f9fa'),
    textColor: z.string().default('#000000'),
    titleSize: z.enum(['sm', 'md', 'lg', 'xl', '2xl', '3xl']).default('2xl'),
    alignment: z.enum(['left', 'center', 'right']).default('center'),
    height: z.enum(['sm', 'md', 'lg', 'xl', 'screen']).default('lg'),
    overlay: z.object({
      enabled: z.boolean().default(false),
      color: z.string().default('#000000'),
      opacity: z.number().min(0).max(1).default(0.5),
    }).default({}),
    cta: z.object({
      enabled: z.boolean().default(false),
      text: z.string().default('Get Started'),
      link: z.string().default(''),
    }).default({}),
  }),
})

// Card Component
export const CardComponentSchema = BaseComponentSchema.extend({
  type: z.literal('card'),
  properties: z.object({
    title: z.string().default('Card Title'),
    content: z.string().default('Card content goes here'),
    image: z.string().url().optional(),
    backgroundColor: z.string().default('#ffffff'),
    borderColor: z.string().default('#e5e7eb'),
    borderWidth: z.number().default(1),
    elevation: z.enum(['none', 'sm', 'md', 'lg', 'xl']).default('sm'),
  }),
})

// Container Component
export const ContainerComponentSchema = BaseComponentSchema.extend({
  type: z.literal('container'),
  properties: z.object({
    maxWidth: z.enum(['sm', 'md', 'lg', 'xl', '2xl', 'full']).default('lg'),
    backgroundColor: z.string().optional(),
    backgroundImage: z.string().url().optional(),
    flexDirection: z.enum(['row', 'column']).default('column'),
    alignItems: z.enum(['start', 'center', 'end', 'stretch']).default('stretch'),
    justifyContent: z.enum(['start', 'center', 'end', 'between', 'around', 'evenly']).default('start'),
    gap: z.number().default(16),
  }),
})

// Spacer Component
export const SpacerComponentSchema = BaseComponentSchema.extend({
  type: z.literal('spacer'),
  properties: z.object({
    height: z.number().default(32),
  }),
})

// Union of all component types
export const ComponentSchema = z.discriminatedUnion('type', [
  TextComponentSchema,
  ImageComponentSchema,
  ButtonComponentSchema,
  HeroComponentSchema,
  CardComponentSchema,
  ContainerComponentSchema,
  SpacerComponentSchema,
])

// Page Builder Schema
export const PageBuilderSchema = z.object({
  version: z.string().default('1.0'),
  components: z.array(ComponentSchema).default([]),
  metadata: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    lastModified: z.string().optional(),
  }).default({}),
})

// Types derived from schemas
export type BaseComponent = z.infer<typeof BaseComponentSchema>
export type TextComponent = z.infer<typeof TextComponentSchema>
export type ImageComponent = z.infer<typeof ImageComponentSchema>
export type ButtonComponent = z.infer<typeof ButtonComponentSchema>
export type HeroComponent = z.infer<typeof HeroComponentSchema>
export type CardComponent = z.infer<typeof CardComponentSchema>
export type ContainerComponent = z.infer<typeof ContainerComponentSchema>
export type SpacerComponent = z.infer<typeof SpacerComponentSchema>

export type PageBuilderComponent = z.infer<typeof ComponentSchema>
export type PageBuilderData = z.infer<typeof PageBuilderSchema>

// Component registry for the drag-and-drop palette
export interface ComponentDefinition {
  type: string
  name: string
  icon: string
  description: string
  category: 'layout' | 'content' | 'media' | 'interactive'
  defaultProps: Partial<PageBuilderComponent>
}

export const COMPONENT_REGISTRY: ComponentDefinition[] = [
  {
    type: 'container',
    name: 'Container',
    icon: 'LayoutGrid',
    description: 'A flexible container for organizing content',
    category: 'layout',
    defaultProps: {
      type: 'container',
      properties: {
        maxWidth: 'lg',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'start',
        gap: 16,
      },
    },
  },
  {
    type: 'text',
    name: 'Text',
    icon: 'Type',
    description: 'Add and customize text content',
    category: 'content',
    defaultProps: {
      type: 'text',
      properties: {
        content: 'Enter your text here',
        fontSize: 16,
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'left',
      },
    },
  },
  {
    type: 'image',
    name: 'Image',
    icon: 'Image',
    description: 'Add images with customizable properties',
    category: 'media',
    defaultProps: {
      type: 'image',
      properties: {
        alt: 'Image description',
        objectFit: 'cover',
        borderRadius: 0,
      },
    },
  },
  {
    type: 'button',
    name: 'Button',
    icon: 'MousePointer',
    description: 'Interactive button with customizable styling',
    category: 'interactive',
    defaultProps: {
      type: 'button',
      properties: {
        text: 'Click me',
        variant: 'primary',
        size: 'md',
        backgroundColor: '#000000',
        textColor: '#ffffff',
      },
    },
  },
  {
    type: 'hero',
    name: 'Hero Section',
    icon: 'Monitor',
    description: 'Eye-catching hero section with title and CTA',
    category: 'layout',
    defaultProps: {
      type: 'hero',
      properties: {
        title: 'Welcome to Our Site',
        subtitle: 'Discover amazing products and services',
        backgroundColor: '#f8f9fa',
        textColor: '#000000',
        titleSize: '2xl',
        alignment: 'center',
        height: 'lg',
        overlay: {
          enabled: false,
          color: '#000000',
          opacity: 0.5,
        },
        cta: {
          enabled: false,
          text: 'Get Started',
          link: '',
        },
      },
    },
  },
  {
    type: 'card',
    name: 'Card',
    icon: 'Square',
    description: 'Content card with title, description, and optional image',
    category: 'content',
    defaultProps: {
      type: 'card',
      properties: {
        title: 'Card Title',
        content: 'Card content goes here',
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        elevation: 'sm',
      },
    },
  },
  {
    type: 'spacer',
    name: 'Spacer',
    icon: 'Minus',
    description: 'Add vertical spacing between elements',
    category: 'layout',
    defaultProps: {
      type: 'spacer',
      properties: {
        height: 32,
      },
    },
  },
]

// Helper functions
export function generateComponentId(): string {
  return `component_${Math.random().toString(36).substr(2, 9)}`
}

export function createDefaultComponent(type: string): PageBuilderComponent | null {
  const definition = COMPONENT_REGISTRY.find(comp => comp.type === type)
  if (!definition) return null

  return {
    id: generateComponentId(),
    order: 0,
    styles: {
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      borderRadius: 0,
      border: { width: 0, style: 'none', color: '#000000' },
      shadow: { enabled: false, blur: 0, spread: 0, color: '#000000', opacity: 0.1 },
      responsive: {
        mobile: { display: 'block', width: '100%' },
        tablet: { display: 'block', width: '100%' },
        desktop: { display: 'block', width: '100%' },
      },
    },
    ...definition.defaultProps,
  } as PageBuilderComponent
}