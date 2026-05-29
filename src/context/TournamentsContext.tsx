import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Tournament } from '../types'

const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: '1',
    name: 'Summer Showdown 2025',
    date: '2025-07-12',
    format: 'bracket',
    mode: 'singles',
    status: 'upcoming',
    max_players: 16,
    description: 'The biggest tournament of the summer. Single elimination, winner takes all.',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Weekend Warrior Cup',
    date: '2025-06-28',
    format: 'round-robin',
    mode: 'singles',
    status: 'upcoming',
    max_players: 8,
    description: 'A casual round-robin to warm up for the summer. All skill levels welcome.',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Diaspora Classic',
    date: '2025-05-17',
    format: 'group-stage',
    mode: 'doubles',
    status: 'completed',
    max_players: 24,
    description: 'Our inaugural tournament. A legendary day in House of Futbol history.',
    created_at: new Date().toISOString(),
  },
]

const STORAGE_KEY = 'hof_tournaments'

function loadTournaments(): Tournament[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as Tournament[]
  } catch {
    // corrupted storage — fall back to defaults
  }
  return INITIAL_TOURNAMENTS
}

function saveTournaments(tournaments: Tournament[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tournaments))
}

interface TournamentsContextValue {
  tournaments: Tournament[]
  addTournament: (data: Omit<Tournament, 'id' | 'created_at'>) => void
  updateTournament: (id: string, data: Omit<Tournament, 'id' | 'created_at'>) => void
  deleteTournament: (id: string) => void
}

const TournamentsContext = createContext<TournamentsContextValue | null>(null)

export function TournamentsProvider({ children }: { children: ReactNode }) {
  const [tournaments, setTournaments] = useState<Tournament[]>(loadTournaments)

  function addTournament(data: Omit<Tournament, 'id' | 'created_at'>) {
    const next = [
      { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() },
      ...tournaments,
    ]
    setTournaments(next)
    saveTournaments(next)
  }

  function updateTournament(id: string, data: Omit<Tournament, 'id' | 'created_at'>) {
    const next = tournaments.map((t) =>
      t.id === id ? { ...t, ...data } : t
    )
    setTournaments(next)
    saveTournaments(next)
  }

  function deleteTournament(id: string) {
    const next = tournaments.filter((t) => t.id !== id)
    setTournaments(next)
    saveTournaments(next)
  }

  return (
    <TournamentsContext.Provider value={{ tournaments, addTournament, updateTournament, deleteTournament }}>
      {children}
    </TournamentsContext.Provider>
  )
}

export function useTournaments() {
  const ctx = useContext(TournamentsContext)
  if (!ctx) throw new Error('useTournaments must be used within TournamentsProvider')
  return ctx
}
