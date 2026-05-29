import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { ClubEvent } from '../types'

const INITIAL_EVENTS: ClubEvent[] = [
  {
    id: '1',
    title: 'AFCON 2025 Watch Party',
    description: 'Quarter-final watch party. Big screen, vibes, food. Come through.',
    event_type: 'watch_party',
    date: '2025-07-05',
    location: 'House of Futbol HQ, Minneapolis',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Weekly FIFA Session',
    description: 'Open gaming night every Friday. Ranked friendlies and casual play all night.',
    event_type: 'gaming',
    date: '2025-06-27',
    location: 'House of Futbol HQ',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'EPL Matchday: Man City vs Arsenal',
    description: "Title race decider. We're watching it live and it's going to be loud.",
    event_type: 'watch_party',
    date: '2025-06-22',
    location: 'House of Futbol HQ',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Twin Cities Futbol Mixer',
    description: 'Meet people from the community. No controllers required — just good energy.',
    event_type: 'community',
    date: '2025-07-18',
    location: 'Minneapolis Community Center',
    created_at: new Date().toISOString(),
  },
]

interface EventsContextValue {
  events: ClubEvent[]
  addEvent: (event: Omit<ClubEvent, 'id' | 'created_at'>) => void
  updateEvent: (id: string, data: Omit<ClubEvent, 'id' | 'created_at'>) => void
  deleteEvent: (id: string) => void
}

const STORAGE_KEY = 'hof_events'

function loadEvents(): ClubEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as ClubEvent[]
  } catch {
    // corrupted storage — fall back to defaults
  }
  return INITIAL_EVENTS
}

function saveEvents(events: ClubEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

const EventsContext = createContext<EventsContextValue | null>(null)

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<ClubEvent[]>(loadEvents)

  function addEvent(data: Omit<ClubEvent, 'id' | 'created_at'>) {
    const newEvent: ClubEvent = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }
    setEvents((prev) => {
      const next = [newEvent, ...prev]
      saveEvents(next)
      return next
    })
  }

  function updateEvent(id: string, data: Omit<ClubEvent, 'id' | 'created_at'>) {
    setEvents((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, ...data } : e))
      saveEvents(next)
      return next
    })
  }

  function deleteEvent(id: string) {
    setEvents((prev) => {
      const next = prev.filter((e) => e.id !== id)
      saveEvents(next)
      return next
    })
  }

  return (
    <EventsContext.Provider value={{ events, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  )
}

export function useEvents() {
  const ctx = useContext(EventsContext)
  if (!ctx) throw new Error('useEvents must be used within EventsProvider')
  return ctx
}
