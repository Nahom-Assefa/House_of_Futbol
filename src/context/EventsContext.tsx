import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { ClubEvent } from '../types'
import { supabase } from '../lib/supabase'

interface EventsContextValue {
  events: ClubEvent[]
  loading: boolean
  addEvent: (data: Omit<ClubEvent, 'id' | 'created_at'>) => Promise<void>
  updateEvent: (id: string, data: Omit<ClubEvent, 'id' | 'created_at'>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
}

const EventsContext = createContext<EventsContextValue | null>(null)

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<ClubEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
      .then(({ data }) => {
        if (data) setEvents(data as ClubEvent[])
        setLoading(false)
      })
  }, [])

  async function addEvent(data: Omit<ClubEvent, 'id' | 'created_at'>) {
    const { data: inserted } = await supabase
      .from('events')
      .insert(data)
      .select()
      .single()
    if (inserted) setEvents((prev) => [inserted as ClubEvent, ...prev])
  }

  async function updateEvent(id: string, data: Omit<ClubEvent, 'id' | 'created_at'>) {
    const { data: updated } = await supabase
      .from('events')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (updated) {
      setEvents((prev) => prev.map((e) => (e.id === id ? (updated as ClubEvent) : e)))
    }
  }

  async function deleteEvent(id: string) {
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (!error) setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <EventsContext.Provider value={{ events, loading, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  )
}

export function useEvents() {
  const ctx = useContext(EventsContext)
  if (!ctx) throw new Error('useEvents must be used within EventsProvider')
  return ctx
}
