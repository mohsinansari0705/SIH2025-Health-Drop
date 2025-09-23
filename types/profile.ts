export interface Profile {
  id: string;
  full_name: string;
  role: 'admin' | 'clinic' | 'asha_worker' | 'volunteer';
  organization: string;
  location: string;
  created_at?: string;
  is_active?: boolean;
}