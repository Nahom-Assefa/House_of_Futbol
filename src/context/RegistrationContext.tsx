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
}

interface RegistrationContextValue {
  registrations: TournamentRegistration[]
  loading: boolean
  submitRegistration: (payload: SubmitRegistrationPayload) => Promise<void>
}

const RegistrationContext = createContext<RegistrationContextValue | null>(null)

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('tournament_registrations')
      .select('*')
      .order('registered_at', { ascending: false })
      .then(({ data }) => {
        if (data) setRegistrations(data as TournamentRegistration[])
        setLoading(false)
      })
  }, [])

  async function submitRegistration(payload: SubmitRegistrationPayload) {
    const { data, error } = await supabase
      .from('tournament_registrations')
      .insert(payload)
      .select()
      .single()
    if (error) throw new Error(error.message)
    if (data) setRegistrations((prev) => [data as TournamentRegistration, ...prev])
  }

  return (
    <RegistrationContext.Provider value={{ registrations, loading, submitRegistration }}>
      {children}
    </RegistrationContext.Provider>
  )
}

export function useRegistration() {
  const ctx = useContext(RegistrationContext)
  if (!ctx) throw new Error('useRegistration must be used within RegistrationProvider')
  return ctx
}
