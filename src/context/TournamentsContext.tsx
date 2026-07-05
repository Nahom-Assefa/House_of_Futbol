import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Tournament } from '../types'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

interface TournamentsContextValue {
  tournaments: Tournament[]
  myTournaments: Tournament[]
  loading: boolean
  refetch: () => Promise<void>
  addTournament: (data: Omit<Tournament, 'id' | 'created_at' | 'creator_id'>) => Promise<void>
  updateTournament: (id: string, data: Omit<Tournament, 'id' | 'created_at' | 'creator_id'>) => Promise<void>
  deleteTournament: (id: string) => Promise<void>
}

const TournamentsContext = createContext<TournamentsContextValue | null>(null)

export function TournamentsProvider({ children }: { children: ReactNode }) {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const { isAdmin, isCaptain, profile } = useAuth()

  async function fetchTournaments() {
    const { data } = await supabase.from('tournaments').select('*').order('date', { ascending: true })
    if (data) setTournaments(data as Tournament[])
  }

  useEffect(() => {
    fetchTournaments().then(() => setLoading(false))
  }, [])

  const myTournaments = isAdmin
    ? tournaments
    : isCaptain && profile
      ? tournaments.filter((t) => t.creator_id === profile.id)
      : []

  async function addTournament(data: Omit<Tournament, 'id' | 'created_at' | 'creator_id'>) {
    const { data: { session } } = await supabase.auth.getSession()
    const { data: inserted, error } = await supabase
      .from('tournaments')
      .insert({ ...data, creator_id: session?.user.id ?? null })
      .select()
      .single()
    if (error) throw new Error(error.message)
    if (inserted) setTournaments((prev) => [...prev, inserted as Tournament])
  }

  async function updateTournament(id: string, data: Omit<Tournament, 'id' | 'created_at' | 'creator_id'>) {
    const { data: updated, error } = await supabase
      .from('tournaments')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    if (updated) {
      setTournaments((prev) => prev.map((t) => (t.id === id ? (updated as Tournament) : t)))
    }
  }

  async function deleteTournament(id: string) {
    const { error } = await supabase.from('tournaments').delete().eq('id', id)
    if (!error) setTournaments((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <TournamentsContext.Provider value={{ tournaments, myTournaments, loading, refetch: fetchTournaments, addTournament, updateTournament, deleteTournament }}>
      {children}
    </TournamentsContext.Provider>
  )
}

export function useTournaments() {
  const ctx = useContext(TournamentsContext)
  if (!ctx) throw new Error('useTournaments must be used within TournamentsProvider')
  return ctx
}
