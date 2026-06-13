import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { TournamentRegistration } from '../types'
import { supabase } from '../lib/supabase'

interface SubmitRegistrationPayload {
  tournament_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  partner_name: string | null
  note: string
  sms_opt_in: boolean
}

interface RegistrationContextValue {
  registrations: TournamentRegistration[]
  loading: boolean
  refetch: () => Promise<void>
  submitRegistration: (payload: SubmitRegistrationPayload) => Promise<void>
}

const RegistrationContext = createContext<RegistrationContextValue | null>(null)

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchRegistrations() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data } = await supabase
      .from('tournament_registrations')
      .select('*')
      .order('registered_at', { ascending: false })
    if (data) setRegistrations(data as TournamentRegistration[])
  }

  useEffect(() => {
    fetchRegistrations().then(() => setLoading(false))
  }, [])

  async function submitRegistration(payload: SubmitRegistrationPayload) {
    const { error } = await supabase
      .from('tournament_registrations')
      .insert(payload)
    if (error) throw new Error(error.message)
  }

  return (
    <RegistrationContext.Provider value={{ registrations, loading, refetch: fetchRegistrations, submitRegistration }}>
      {children}
    </RegistrationContext.Provider>
  )
}

export function useRegistration() {
  const ctx = useContext(RegistrationContext)
  if (!ctx) throw new Error('useRegistration must be used within RegistrationProvider')
  return ctx
}
