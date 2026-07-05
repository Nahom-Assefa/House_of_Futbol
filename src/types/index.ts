export interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  display_name: string | null
  role: 'admin' | 'captain' | null
  created_at: string
}

export interface CaptainApplication {
  id: string
  display_name: string
  email: string
  message: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  reviewed_at: string | null
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
  creator_id: string | null
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
  sms_opt_in: boolean
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
  creator_id: string | null
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
  sms_opt_in: boolean
  rsvp_at: string
}
