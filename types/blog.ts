import { User } from './user';

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featured_image_url?: string;
  category_id?: string;
  author_id?: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  // Relations
  category?: PostCategory;
  author?: Partial<User>;
}
