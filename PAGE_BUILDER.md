# Page Builder System

This project now includes a comprehensive drag-and-drop page builder system similar to Elementor and Wix, allowing admins to create highly customizable pages without coding.

## Features

### 🎨 Visual Page Builder
- **Drag-and-Drop Interface**: Intuitive component palette with visual editor
- **Real-time Preview**: See changes instantly as you build
- **Component Library**: Pre-built components ready to use
- **Responsive Design**: Mobile, tablet, and desktop viewports

### 🧩 Available Components

#### Layout Components
- **Container**: Flexible layout container with alignment options
- **Spacer**: Add vertical spacing between elements

#### Content Components
- **Text**: Rich text with typography controls
- **Card**: Content cards with title, description, and optional images

#### Media Components
- **Image**: Responsive images with object-fit controls
- **Hero Section**: Eye-catching hero banners with CTAs

#### Interactive Components
- **Button**: Customizable buttons with links and styling

### ⚙️ Component Properties

Each component includes comprehensive customization options:

#### Content Properties
- Text content and typography
- Images and media settings
- Links and actions
- Colors and styling

#### Layout Properties
- Margin and padding controls
- Background colors and images
- Border radius and styling
- Shadow effects

#### Responsive Properties
- Hide/show on different devices
- Mobile, tablet, desktop specific settings
- Responsive width controls

## How to Use

### For Admins

1. **Navigate to Admin Pages**
   - Go to `/admin/pages` in your admin panel
   - Create a new page or edit an existing one

2. **Choose Content Type**
   - Select "Page Builder" as the content type
   - Save the page to enable the page builder

3. **Open Page Builder**
   - Click the paint brush icon next to any page
   - This opens the visual page builder interface

4. **Build Your Page**
   - **Left Panel**: Component palette - drag components to canvas
   - **Center**: Canvas - drop and arrange your components
   - **Right Panel**: Properties - customize selected components

5. **Customize Components**
   - Click any component to select it
   - Use the properties panel to modify:
     - Content (text, images, links)
     - Styling (colors, spacing, borders)
     - Layout (responsive settings)

6. **Save and Preview**
   - Click "Save" to save your changes
   - Click "Preview" to see how it looks live
   - Use viewport buttons to test responsive design

### Component Workflow

1. **Add Components**
   - Drag from component palette to canvas
   - Drop components into containers for better organization

2. **Edit Components**
   - Click to select a component
   - Use the properties panel on the right
   - Make real-time changes

3. **Organize Layout**
   - Drag components to reorder them
   - Use containers to group related content
   - Add spacers for better visual separation

4. **Style Components**
   - Customize colors, fonts, and spacing
   - Add backgrounds and borders
   - Control responsive behavior

## Technical Architecture

### Database Schema
- Pages now support both HTML and Page Builder content types
- JSON data structure stores component configurations
- Backward compatibility with existing HTML pages

### Component System
- Type-safe component definitions with Zod schemas
- Discriminated unions for proper TypeScript support
- Modular component architecture

### Rendering System
- Server-side rendering support
- Client-side interactivity
- Responsive component rendering

### Files Structure
```
components/page-builder/
├── page-builder.tsx           # Main page builder interface
├── component-palette.tsx      # Draggable component library
├── builder-canvas.tsx         # Drop zone and canvas
├── properties-panel.tsx       # Component editing panel
├── page-renderer.tsx          # Frontend page rendering
├── component-renderer.tsx     # Individual component renderer
├── sortable-component.tsx     # Sortable wrapper component
└── [component]-renderer.tsx   # Individual component renderers

types/
├── page-builder.ts           # Component type definitions
└── page.ts                   # Updated page types

app/admin/pages/[id]/builder/ # Admin page builder routes
```

## Development

### Adding New Components

1. **Define Component Schema**
   ```typescript
   // In types/page-builder.ts
   export const NewComponentSchema = BaseComponentSchema.extend({
     type: z.literal('newComponent'),
     properties: z.object({
       // Component-specific properties
     }),
   })
   ```

2. **Create Component Renderer**
   ```typescript
   // In components/page-builder/new-component-renderer.tsx
   export function NewComponentRenderer({ component, isEditing, onEdit }) {
     // Render component based on properties
   }
   ```

3. **Add to Component Registry**
   ```typescript
   // In types/page-builder.ts
   export const COMPONENT_REGISTRY = [
     // ... existing components
     {
       type: 'newComponent',
       name: 'New Component',
       icon: 'IconName',
       description: 'Description',
       category: 'content',
       defaultProps: { /* defaults */ }
     }
   ]
   ```

4. **Update Component Renderer**
   ```typescript
   // Add case to component-renderer.tsx switch statement
   case 'newComponent':
     return <NewComponentRenderer ... />
   ```

### Extending Properties Panel

Add component-specific editing controls in the properties panel for new components.

## Migration Notes

- Existing HTML pages continue to work unchanged
- New pages can use either HTML or Page Builder content types
- Database migration adds new columns while preserving existing data
- Admin interface provides seamless switching between content types

## Best Practices

1. **Component Design**
   - Keep components focused and reusable
   - Provide sensible defaults
   - Include comprehensive styling options

2. **Performance**
   - Components render efficiently
   - Minimal re-renders during editing
   - Optimized for both editing and viewing

3. **User Experience**
   - Intuitive drag-and-drop interactions
   - Clear visual feedback
   - Responsive design considerations

4. **Content Management**
   - Logical component categorization
   - Helpful component descriptions
   - Easy-to-understand property labels

## Future Enhancements

- **Additional Components**: Forms, galleries, testimonials, etc.
- **Advanced Styling**: CSS custom properties, animations
- **Template System**: Pre-built page templates
- **Global Styles**: Site-wide color schemes and typography
- **Component Nesting**: More complex layout possibilities
- **Import/Export**: Page templates and component libraries

---

The page builder system provides a powerful yet user-friendly way to create beautiful, responsive web pages without any coding knowledge, while maintaining the flexibility for developers to extend and customize the system as needed.