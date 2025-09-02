export interface Tax {
  id: string;
  name: string;
  rate: number;
  type: 'percentage' | 'fixed';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
