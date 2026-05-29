export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  created_at: string
}

export type TournamentFormat = 'round-robin' | 'bracket' | 'group-stage'
export type TournamentStatus = 'upcoming' | 'active' | 'completed'
export type TournamentMode = 'singles' | 'doubles'

export interface Tournament {
  id: string
  name: string
  date: string
  format: TournamentFormat
  mode: TournamentMode
  status: TournamentStatus
  max_players: number
  description: string | null
  created_at: string
}

export interface TournamentRegistration {
  tournament_id: string
  user_id: string
  registered_at: string
}

export type EventType = 'gaming' | 'watch_party' | 'community' | 'pick_up'| 'other'

export interface ClubEvent {
  id: string
  title: string
  description: string | null
  event_type: EventType
  date: string
  location: string | null
  created_at: string
}

export interface EventRsvp {
  event_id: string
  user_id: string
  created_at: string
}
