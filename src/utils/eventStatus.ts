export function getEventStatus(date: string): { status: 'upcoming' | 'completed'; color: 'success' | 'default' } {
  const [year, month, day] = date.split('-').map(Number)
  const eventDay = new Date(year, month - 1, day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isPast = eventDay < today
  return {
    status: isPast ? 'completed' : 'upcoming',
    color: isPast ? 'default' : 'success',
  }
}
