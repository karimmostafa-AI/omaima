export interface Permission {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  permissions?: Permission[];
}
