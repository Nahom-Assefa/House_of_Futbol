import { useEffect } from 'react'
import {
  Box, Paper, Typography, Divider, Stack, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Tooltip,
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import EventIcon from '@mui/icons-material/Event'
import TodayIcon from '@mui/icons-material/Today'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { useRsvp } from '../../context/RsvpContext'
import { useRegistration } from '../../context/RegistrationContext'
import { useEvents } from '../../context/EventsContext'
import { useTournaments } from '../../context/TournamentsContext'
import { useAuth } from '../../context/AuthContext'
import type { EventType } from '../../types'

const EVENT_TYPE_LABEL: Record<EventType, string> = {
  gaming: 'Gaming',
  watch_party: 'Watch Party',
  community: 'Community',
  pick_up: 'Pick-Up',
  other: 'Other',
}

const EVENT_TYPE_COLOR: Record<EventType, 'success' | 'secondary' | 'info' | 'error' | undefined> = {
  gaming: 'success',
  watch_party: 'secondary',
  community: 'info',
  pick_up: 'error',
  other: undefined,
}

type SubmissionRow = {
  id: string
  kind: 'rsvp' | 'registration'
  name: string
  email: string
  phone: string
  parentTitle: string
  parentDate: string | null
  submittedAt: string
  detailChip: React.ReactNode
  extra: string | null
  note: string | null
}

function KpiCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Paper
      elevation={0}
      sx={{ flex: 1, minWidth: 140, p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
    >
      <Stack direction="row" alignItems="center" gap={1.25} mb={1}>
        {icon}
        <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', fontSize: '0.65rem' }}>
          {label}
        </Typography>
      </Stack>
      <Typography variant="h4" fontWeight={700}>{value}</Typography>
    </Paper>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export default function UsersTab() {
  const { rsvps, loading: rsvpLoading, refetch: refetchRsvps } = useRsvp()
  const { registrations, loading: regLoading, refetch: refetchRegistrations } = useRegistration()
  const { myEvents } = useEvents()
  const { myTournaments } = useTournaments()
  const { isCaptain } = useAuth()

  useEffect(() => {
    refetchRsvps()
    refetchRegistrations()
  }, [])

  const loading = rsvpLoading || regLoading

  const eventMap = Object.fromEntries(myEvents.map((e) => [e.id, e]))
  const tournamentMap = Object.fromEntries(myTournaments.map((t) => [t.id, t]))

  const visibleRsvps = isCaptain ? rsvps.filter((r) => eventMap[r.event_id]) : rsvps
  const visibleRegistrations = isCaptain ? registrations.filter((r) => tournamentMap[r.tournament_id]) : registrations

  const rows: SubmissionRow[] = [
    ...visibleRsvps.map((r) => {
      const event = eventMap[r.event_id]
      return {
        id: r.id,
        kind: 'rsvp' as const,
        name: `${r.first_name} ${r.last_name}`,
        email: r.email,
        phone: r.phone,
        parentTitle: event?.title ?? 'Deleted event',
        parentDate: event?.date ?? null,
        submittedAt: r.rsvp_at,
        detailChip: event ? (
          <Chip
            label={EVENT_TYPE_LABEL[event.event_type]}
            color={EVENT_TYPE_COLOR[event.event_type]}
            size="small"
            sx={event.event_type === 'other' ? { bgcolor: '#4527A0', color: '#EDE7F6' } : undefined}
          />
        ) : null,
        extra: null,
        note: r.note,
      }
    }),
    ...visibleRegistrations.map((r) => {
      const t = tournamentMap[r.tournament_id]
      return {
        id: r.id,
        kind: 'registration' as const,
        name: `${r.first_name} ${r.last_name}`,
        email: r.email,
        phone: r.phone,
        parentTitle: t?.name ?? 'Deleted tournament',
        parentDate: t?.date ?? null,
        submittedAt: r.registered_at,
        detailChip: t ? (
          <Chip
            label={t.mode === 'singles' ? 'Singles' : 'Doubles'}
            size="small"
            color={t.mode === 'singles' ? 'error' : undefined}
            sx={t.mode === 'doubles' ? { bgcolor: '#AD1457', color: 'white' } : undefined}
          />
        ) : null,
        extra: r.partner_name,
        note: r.note,
      }
    }),
  ].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const recentCount = rows.filter((r) => new Date(r.submittedAt) >= sevenDaysAgo).length
  const rsvpCount = rows.filter((r) => r.kind === 'rsvp').length
  const regCount = rows.filter((r) => r.kind === 'registration').length

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} flexWrap="wrap" mb={4}>
        <KpiCard
          icon={<PeopleIcon sx={{ fontSize: 18, color: 'primary.main' }} />}
          label="Total Submissions"
          value={rows.length}
        />
        <KpiCard
          icon={<TodayIcon sx={{ fontSize: 18, color: 'warning.main' }} />}
          label="Last 7 Days"
          value={recentCount}
        />
        <KpiCard
          icon={<EventIcon sx={{ fontSize: 18, color: 'info.main' }} />}
          label="Event RSVPs"
          value={rsvpCount}
        />
        <KpiCard
          icon={<EmojiEventsIcon sx={{ fontSize: 18, color: 'success.main' }} />}
          label="Tournament Registrations"
          value={regCount}
        />
      </Stack>

      <Divider sx={{ mb: 4, borderColor: 'rgba(255,255,255,0.06)' }} />

      <Typography variant="h5" mb={3}>All Submissions ({rows.length})</Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : rows.length === 0 ? (
        <Paper
          elevation={0}
          sx={{ p: { xs: 4, md: 8 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}
        >
          <PeopleIcon sx={{ fontSize: 56, color: 'text.disabled' }} />
          <Typography variant="h6" color="text.secondary">No submissions yet</Typography>
          <Typography variant="body2" color="text.disabled" sx={{ maxWidth: 360 }}>
            RSVPs and tournament registrations will appear here.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Event / Tournament</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={`${row.kind}-${row.id}`}
                  sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{row.email}</Typography>
                    <Typography variant="caption" color="text.disabled">{row.phone}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.kind === 'rsvp' ? 'RSVP' : 'Registration'}
                      size="small"
                      variant="outlined"
                      color={row.kind === 'rsvp' ? 'info' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>{row.parentTitle}</Typography>
                  </TableCell>
                  <TableCell>
                    {row.detailChip ?? <Typography variant="caption" color="text.disabled">—</Typography>}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {row.parentDate ? formatDate(row.parentDate) : '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{formatDate(row.submittedAt)}</Typography>
                    <Typography variant="caption" color="text.disabled">{formatTime(row.submittedAt)}</Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    {row.extra && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Partner: <strong>{row.extra}</strong>
                      </Typography>
                    )}
                    {row.note ? (
                      <Tooltip title={row.note} placement="top">
                        <Typography variant="caption" color="text.disabled" sx={{ cursor: 'default' }}>
                          {row.note.length > 40 ? `${row.note.slice(0, 40)}…` : row.note}
                        </Typography>
                      </Tooltip>
                    ) : !row.extra ? (
                      <Typography variant="caption" color="text.disabled">—</Typography>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
