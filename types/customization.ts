export type CustomizationType = 'suit' | 'blazer' | 'skirt' | 'pants' | 'dress' | 'uniform';

export interface CustomizationTemplate {
  id: string;
  name: string;
  type: CustomizationType;
  base_product_id: string;
  template_data: CustomizationTemplateData;
  preview_images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomizationTemplateData {
  sections: CustomizationSection[];
  rules?: CustomizationRule[];
  pricing?: CustomizationPricing;
}

export interface CustomizationSection {
  id: string;
  title: string;
  description?: string;
  type: 'fabric' | 'style' | 'fit' | 'details' | 'measurements';
  options: CustomizationSectionOption[];
  required: boolean;
  multiple_selection?: boolean;
  max_selections?: number;
}

export interface CustomizationSectionOption {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  price_modifier: number;
  is_default?: boolean;
  is_available: boolean;
  material_id?: string;
  color_id?: string;
}

export interface CustomizationRule {
  id: string;
  condition: {
    section_id: string;
    option_id: string;
  };
  effects: CustomizationEffect[];
}

export interface CustomizationEffect {
  type: 'show' | 'hide' | 'require' | 'disable' | 'price_change';
  target_section_id?: string;
  target_option_id?: string;
  value?: any;
}

export interface CustomizationPricing {
  base_price_modifier: number;
  complexity_multiplier: number;
  rush_order_multiplier?: number;
}

export interface CustomerCustomization {
  template_id: string;
  selections: CustomizationSelectionData[];
  measurements?: CustomerMeasurementData;
  special_instructions?: string;
  rush_order?: boolean;
  total_price_modifier: number;
}

export interface CustomizationSelectionData {
  section_id: string;
  option_ids: string[];
  custom_value?: string;
}

export interface CustomerMeasurementData {
  measurement_type: string;
  values: Record<string, number>;
  unit: 'inches' | 'cm';
  notes?: string;
}

export interface MeasurementGuide {
  id: string;
  name: string;
  type: CustomizationType;
  measurements: MeasurementPoint[];
  instructions: string[];
  size_chart?: SizeChart;
}

export interface MeasurementPoint {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  required: boolean;
  min_value?: number;
  max_value?: number;
  default_unit: 'inches' | 'cm';
}

export interface SizeChart {
  sizes: string[];
  measurements: Record<string, number[]>;
}

export interface CustomizationPreview {
  product_name: string;
  preview_image_url: string;
  selections_summary: string[];
  estimated_price: number;
  estimated_delivery_time: string;
}

// For the suit customization builder component
export interface SuitCustomizationData {
  style: {
    jacket_style: string;
    lapel_style: string;
    button_count: string;
    vent_style: string;
  };
  fabric: {
    material_id: string;
    color_id: string;
    pattern?: string;
  };
  measurements: CustomerMeasurementData;
  details: {
    lining_color?: string;
    button_color?: string;
    monogram?: string;
    contrast_details?: string;
  };
  fit_preferences: {
    fit_type: 'slim' | 'regular' | 'relaxed';
    length_preference?: string;
  };
}
