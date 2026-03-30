import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client (for client components)
export function getSupabaseBrowser() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Simple client (for quick operations — not SSR-aware)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Types ───────────────────────────────────────────────────
export type Profile = {
  id: string
  full_name: string
  company_name: string
  company_phone: string
  company_email: string
  company_license: string
  company_address: string
  default_terms: string
  plan: 'free' | 'pro' | 'business'
  created_at: string
  updated_at: string
}

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
  line_items: LineItem[] // populated client-side from bid_items
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

// Database row type (bid_items table)
export type BidItemRow = LineItem & {
  bid_id: string
  sort_order: number
  created_at: string
}
