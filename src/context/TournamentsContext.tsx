import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Tournament } from '../types'
import { supabase } from '../lib/supabase'

interface TournamentsContextValue {
  tournaments: Tournament[]
  loading: boolean
  addTournament: (data: Omit<Tournament, 'id' | 'created_at'>) => Promise<void>
  updateTournament: (id: string, data: Omit<Tournament, 'id' | 'created_at'>) => Promise<void>
  deleteTournament: (id: string) => Promise<void>
}

const TournamentsContext = createContext<TournamentsContextValue | null>(null)

export function TournamentsProvider({ children }: { children: ReactNode }) {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('tournaments')
      .select('*')
      .order('date', { ascending: true })
      .then(({ data }) => {
        if (data) setTournaments(data as Tournament[])
        setLoading(false)
      })
  }, [])

  async function addTournament(data: Omit<Tournament, 'id' | 'created_at'>) {
    const { data: inserted, error } = await supabase
      .from('tournaments')
      .insert(data)
      .select()
      .single()
    if (error) throw new Error(error.message)
    if (inserted) setTournaments((prev) => [inserted as Tournament, ...prev])
  }

  async function updateTournament(id: string, data: Omit<Tournament, 'id' | 'created_at'>) {
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
    <TournamentsContext.Provider value={{ tournaments, loading, addTournament, updateTournament, deleteTournament }}>
      {children}
    </TournamentsContext.Provider>
  )
}

export function useTournaments() {
  const ctx = useContext(TournamentsContext)
  if (!ctx) throw new Error('useTournaments must be used within TournamentsProvider')
  return ctx
}
