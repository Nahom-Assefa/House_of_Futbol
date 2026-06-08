export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  created_at: string
}

export type TournamentFormat = 'round-robin' | 'single-elimination' | 'double-elimination' | 'group-stage'
export type TournamentStatus = 'upcoming' | 'active' | 'completed'
export type TournamentMode = 'singles' | 'doubles'

export interface Tournament {
  id: string
  name: string
  date: string
  time: string | null
  location: string | null
  format: TournamentFormat
  mode: TournamentMode
  status: TournamentStatus
  max_players: number
  description: string | null
  good_to_know: GoodToKnowItem[]
  faqs: FaqItem[]
  created_at: string
}

export interface TournamentRegistration {
  id: string
  tournament_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  partner_name: string | null
  note: string | null
  registered_at: string
}

export interface GoodToKnowItem {
  icon: string
  text: string
}

export interface FaqItem {
  q: string
  a: string
}

export type EventType = 'gaming' | 'watch_party' | 'community' | 'pick_up'| 'other'

export interface ClubEvent {
  id: string
  title: string
  description: string | null
  event_type: EventType
  date: string
  time: string | null
  location: string | null
  max_attendees: number | null
  good_to_know: GoodToKnowItem[]
  faqs: FaqItem[]
  created_at: string
}

export interface EventRsvp {
  id: string
  event_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  note: string | null
  rsvp_at: string
}
