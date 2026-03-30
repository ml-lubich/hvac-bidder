import { getSupabaseBrowser } from './supabase'
import type { Bid, LineItem, Profile } from './supabase'

function sb() {
  return getSupabaseBrowser()
}

// ─── Auth ────────────────────────────────────────────────────
export async function getUser() {
  const { data: { user } } = await sb().auth.getUser()
  return user
}

export async function signUp(email: string, password: string, meta: { full_name: string; company_name: string }) {
  return sb().auth.signUp({
    email,
    password,
    options: { data: meta },
  })
}

export async function signIn(email: string, password: string) {
  return sb().auth.signInWithPassword({ email, password })
}

export async function signOut() {
  return sb().auth.signOut()
}

// ─── Profiles ────────────────────────────────────────────────
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data } = await sb()
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data as Profile | null
}

export async function updateProfile(userId: string, updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await sb()
    .from('profiles')
    .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
    .select()
    .single()
  if (error) throw error
  return data as Profile
}

export async function ensureProfile(userId: string, meta?: { full_name?: string; company_name?: string }) {
  const existing = await getProfile(userId)
  if (existing) return existing
  const { data, error } = await sb()
    .from('profiles')
    .insert({
      id: userId,
      full_name: meta?.full_name || '',
      company_name: meta?.company_name || '',
      company_phone: '',
      company_email: '',
      company_license: '',
      company_address: '',
      default_terms: 'Payment due within 30 days of project completion. 1-year warranty on all labor. Equipment warranty per manufacturer terms. Price valid for 30 days from bid date.',
      plan: 'free',
    })
    .select()
    .single()
  if (error) throw error
  return data as Profile
}

// ─── Bids ────────────────────────────────────────────────────
export async function listBids(userId: string): Promise<Bid[]> {
  const { data: bids, error } = await sb()
    .from('bids')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  if (!bids || bids.length === 0) return []

  // Fetch all bid items for these bids
  const bidIds = bids.map(b => b.id)
  const { data: items } = await sb()
    .from('bid_items')
    .select('*')
    .in('bid_id', bidIds)
    .order('sort_order', { ascending: true })

  const itemsByBid = new Map<string, LineItem[]>()
  for (const item of (items || [])) {
    const list = itemsByBid.get(item.bid_id) || []
    list.push({
      id: item.id,
      category: item.category,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: item.total,
    })
    itemsByBid.set(item.bid_id, list)
  }

  return bids.map(b => ({
    ...b,
    line_items: itemsByBid.get(b.id) || [],
  })) as Bid[]
}

export async function getBid(bidId: string, userId: string): Promise<Bid | null> {
  const { data: bid } = await sb()
    .from('bids')
    .select('*')
    .eq('id', bidId)
    .eq('user_id', userId)
    .single()
  if (!bid) return null

  const { data: items } = await sb()
    .from('bid_items')
    .select('*')
    .eq('bid_id', bidId)
    .order('sort_order', { ascending: true })

  return {
    ...bid,
    line_items: (items || []).map(i => ({
      id: i.id,
      category: i.category,
      description: i.description,
      quantity: i.quantity,
      unit_price: i.unit_price,
      total: i.total,
    })),
  } as Bid
}

export async function createBid(bid: Bid): Promise<Bid> {
  const { line_items, ...bidRow } = bid

  const { error: bidError } = await sb()
    .from('bids')
    .insert(bidRow)
  if (bidError) throw bidError

  if (line_items.length > 0) {
    const rows = line_items.map((item, idx) => ({
      id: item.id,
      bid_id: bid.id,
      category: item.category,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: item.total,
      sort_order: idx,
    }))
    const { error: itemError } = await sb()
      .from('bid_items')
      .insert(rows)
    if (itemError) throw itemError
  }

  return bid
}

export async function updateBidStatus(bidId: string, status: Bid['status']) {
  const { error } = await sb()
    .from('bids')
    .update({ status })
    .eq('id', bidId)
  if (error) throw error
}

export async function deleteBid(bidId: string) {
  const { error } = await sb()
    .from('bids')
    .delete()
    .eq('id', bidId)
  if (error) throw error
}
