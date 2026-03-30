"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { getSupabaseBrowser } from './supabase'

export function useAuth(opts?: { redirectTo?: string }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = getSupabaseBrowser()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
      if (!user && opts?.redirectTo) {
        router.replace(opts.redirectTo)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user && opts?.redirectTo) {
        router.replace(opts.redirectTo)
      }
    })

    return () => subscription.unsubscribe()
  }, [router, opts?.redirectTo])

  return { user, loading }
}
