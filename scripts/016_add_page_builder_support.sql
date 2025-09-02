-- Update pages table to support page builder JSON structure
-- Add new columns for page builder data while keeping backward compatibility

-- Add page_builder_data column to store the JSON structure
ALTER TABLE public.pages 
ADD COLUMN IF NOT EXISTS page_builder_data jsonb,
ADD COLUMN IF NOT EXISTS content_type text DEFAULT 'html' CHECK (content_type IN ('html', 'builder'));

-- Update the content_type for existing pages
UPDATE public.pages 
SET content_type = 'html' 
WHERE content_type IS NULL;

-- Create an index on the page_builder_data for better performance
CREATE INDEX IF NOT EXISTS idx_pages_page_builder_data 
ON public.pages USING gin(page_builder_data);

-- Create a function to validate page builder data structure
CREATE OR REPLACE FUNCTION validate_page_builder_data(data jsonb)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Basic validation: ensure it has version and components
  IF data IS NULL THEN
    RETURN true; -- Allow null values
  END IF;
  
  -- Check if it has required fields
  IF NOT (data ? 'version' AND data ? 'components') THEN
    RETURN false;
  END IF;
  
  -- Check if components is an array
  IF jsonb_typeof(data->'components') != 'array' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Add constraint to validate page builder data
ALTER TABLE public.pages 
ADD CONSTRAINT check_page_builder_data 
CHECK (validate_page_builder_data(page_builder_data));

-- Create a function to get page content based on content type
CREATE OR REPLACE FUNCTION get_page_content(page_id bigint)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  page_record record;
  result jsonb;
BEGIN
  SELECT * INTO page_record 
  FROM public.pages 
  WHERE id = page_id AND is_published = true;
  
  IF NOT FOUND THEN
    RETURN null;
  END IF;
  
  -- Return appropriate content based on content type
  IF page_record.content_type = 'builder' THEN
    result := jsonb_build_object(
      'id', page_record.id,
      'title', page_record.title,
      'slug', page_record.slug,
      'content_type', page_record.content_type,
      'page_builder_data', page_record.page_builder_data,
      'meta_description', page_record.meta_description,
      'created_at', page_record.created_at,
      'updated_at', page_record.updated_at
    );
  ELSE
    result := jsonb_build_object(
      'id', page_record.id,
      'title', page_record.title,
      'slug', page_record.slug,
      'content_type', page_record.content_type,
      'content', page_record.content,
      'meta_description', page_record.meta_description,
      'created_at', page_record.created_at,
      'updated_at', page_record.updated_at
    );
  END IF;
  
  RETURN result;
END;
$$;

-- Update RLS policies to include new columns
DROP POLICY IF EXISTS "Allow public read access" ON public.pages;
CREATE POLICY "Allow public read access" ON public.pages 
FOR SELECT USING (is_published = true);

-- Add sample page builder data for demonstration
INSERT INTO public.pages (
  title, 
  slug, 
  content_type, 
  page_builder_data, 
  meta_description, 
  show_in_navigation, 
  navigation_order, 
  is_published
) VALUES (
  'Welcome Page Builder Demo',
  'welcome-builder-demo',
  'builder',
  '{
    "version": "1.0",
    "components": [
      {
        "id": "hero_1",
        "type": "hero",
        "order": 0,
        "properties": {
          "title": "Welcome to Our Store",
          "subtitle": "Discover amazing products with our new page builder",
          "backgroundColor": "#1e40af",
          "textColor": "#ffffff",
          "titleSize": "3xl",
          "alignment": "center",
          "height": "lg",
          "cta": {
            "enabled": true,
            "text": "Explore Products",
            "link": "/products"
          }
        },
        "styles": {
          "margin": {"top": 0, "right": 0, "bottom": 0, "left": 0},
          "padding": {"top": 80, "right": 20, "bottom": 80, "left": 20},
          "borderRadius": 0,
          "border": {"width": 0, "style": "none", "color": "#000000"},
          "shadow": {"enabled": false, "blur": 0, "spread": 0, "color": "#000000", "opacity": 0.1},
          "responsive": {
            "mobile": {"display": "block", "width": "100%"},
            "tablet": {"display": "block", "width": "100%"},
            "desktop": {"display": "block", "width": "100%"}
          }
        }
      },
      {
        "id": "container_1",
        "type": "container",
        "order": 1,
        "properties": {
          "maxWidth": "lg",
          "flexDirection": "row",
          "alignItems": "center",
          "justifyContent": "between",
          "gap": 32
        },
        "styles": {
          "margin": {"top": 0, "right": 0, "bottom": 0, "left": 0},
          "padding": {"top": 60, "right": 20, "bottom": 60, "left": 20},
          "backgroundColor": "#f8f9fa",
          "borderRadius": 0,
          "border": {"width": 0, "style": "none", "color": "#000000"},
          "shadow": {"enabled": false, "blur": 0, "spread": 0, "color": "#000000", "opacity": 0.1},
          "responsive": {
            "mobile": {"display": "block", "width": "100%"},
            "tablet": {"display": "flex", "width": "100%"},
            "desktop": {"display": "flex", "width": "100%"}
          }
        }
      },
      {
        "id": "text_1",
        "type": "text",
        "order": 2,
        "parentId": "container_1",
        "properties": {
          "content": "Experience the power of our drag-and-drop page builder. Create stunning pages without any coding knowledge.",
          "fontSize": 18,
          "fontWeight": "normal",
          "color": "#374151",
          "textAlign": "left",
          "lineHeight": 1.6
        },
        "styles": {
          "margin": {"top": 0, "right": 0, "bottom": 0, "left": 0},
          "padding": {"top": 0, "right": 0, "bottom": 0, "left": 0},
          "borderRadius": 0,
          "border": {"width": 0, "style": "none", "color": "#000000"},
          "shadow": {"enabled": false, "blur": 0, "spread": 0, "color": "#000000", "opacity": 0.1},
          "responsive": {
            "mobile": {"display": "block", "width": "100%"},
            "tablet": {"display": "block", "width": "60%"},
            "desktop": {"display": "block", "width": "60%"}
          }
        }
      }
    ],
    "metadata": {
      "title": "Welcome Page Builder Demo",
      "description": "A demonstration page built with our page builder"
    }
  }'::jsonb,
  'Experience our new drag-and-drop page builder',
  true,
  10,
  true
) ON CONFLICT (slug) DO NOTHING;