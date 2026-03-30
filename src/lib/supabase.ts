import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Bid = {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  client_name: string
  client_address: string
  client_phone: string
  client_email: string
  job_type: 'residential' | 'commercial'
  service_type: string[]
  system_type: string
  square_footage: number
  location: string
  notes: string
  status: 'draft' | 'sent' | 'accepted' | 'declined'
  total_amount: number
  line_items: LineItem[]
  labor_hours: number
  labor_rate: number
  company_name: string
  company_phone: string
  company_email: string
  company_license: string
  valid_until: string
  terms: string
}

export type LineItem = {
  id: string
  category: 'equipment' | 'materials' | 'labor' | 'other'
  description: string
  quantity: number
  unit_price: number
  total: number
}
