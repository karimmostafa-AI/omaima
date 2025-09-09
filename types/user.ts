export type UserRole = 'customer' | 'admin' | 'vendor' | 'staff';

// UserProfile extends User and aligns with database schema
export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  role_id?: string;
  is_active: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  last_online?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Include role data if joined
  role?: {
    name: string;
    permissions: { name: string }[];
  };
}

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
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  preferences: Record<string, any>;
  measurements: Record<string, any>;
  newsletter_subscribed: boolean;
  marketing_consent: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  user?: UserProfile;
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
