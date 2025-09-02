export type UserRole = 'customer' | 'admin' | 'shop_owner' | 'staff';

export interface User {
  id: string;
  email: string;
  phone?: string;
  password_hash?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role: UserRole;
  is_active: boolean;
  email_verified_at?: string;
  phone_verified_at?: string;
  last_online?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  user_id: string;
  date_of_birth?: string;
  gender: string;
  preferences?: Record<string, any>;
  measurements?: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Relations
  user?: User;
}

export interface Address {
  id: string;
  customer_id: string;
  title?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  phone?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerMeasurement {
  id: string;
  customer_id: string;
  measurement_type: string;
  measurements: Record<string, any>;
  notes?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: User;
  customer?: Customer;
  access_token: string;
  refresh_token?: string;
  expires_at: string;
}

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterData {
  email: string;
  phone?: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: string;
}
