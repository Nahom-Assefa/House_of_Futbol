import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { EventRsvp } from '../types'
import { supabase } from '../lib/supabase'

interface SubmitRsvpPayload {
  event_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  note: string
}

interface RsvpContextValue {
  rsvps: EventRsvp[]
  loading: boolean
  refetch: () => Promise<void>
  submitRsvp: (payload: SubmitRsvpPayload) => Promise<void>
}

const RsvpContext = createContext<RsvpContextValue | null>(null)

export function RsvpProvider({ children }: { children: ReactNode }) {
  const [rsvps, setRsvps] = useState<EventRsvp[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchRsvps() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data } = await supabase
      .from('event_rsvps')
      .select('*')
      .order('rsvp_at', { ascending: false })
    if (data) setRsvps(data as EventRsvp[])
  }

  useEffect(() => {
    fetchRsvps().then(() => setLoading(false))
  }, [])

  async function submitRsvp(payload: SubmitRsvpPayload) {
    const { error } = await supabase
      .from('event_rsvps')
      .insert(payload)
    if (error) throw new Error(error.message)
  }

  return (
    <RsvpContext.Provider value={{ rsvps, loading, refetch: fetchRsvps, submitRsvp }}>
      {children}
    </RsvpContext.Provider>
  )
}

export function useRsvp() {
  const ctx = useContext(RsvpContext)
  if (!ctx) throw new Error('useRsvp must be used within RsvpProvider')
  return ctx
}
