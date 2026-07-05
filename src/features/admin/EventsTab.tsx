import { useState, useEffect } from 'react'
import {
  Box, Paper, Typography, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Tooltip, Stack,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import EventForm from './EventForm'
import { useEvents } from '../../context/EventsContext'
import { useAuth } from '../../context/AuthContext'
import type { ClubEvent, EventType } from '../../types'

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

export default function EventsTab() {
  const { myEvents, deleteEvent, refetch } = useEvents()
  const { isAdmin, isCaptain } = useAuth()
  const [editingEvent, setEditingEvent] = useState<ClubEvent | null>(null)

  useEffect(() => { refetch() }, [])

  const label = isAdmin ? 'All Events' : 'My Events'

  return (
    <Box>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, mb: 5 }}>
        <EventForm
          editingEvent={editingEvent}
          onCancelEdit={() => setEditingEvent(null)}
        />
      </Paper>

      <Divider sx={{ mb: 4, borderColor: 'rgba(255,255,255,0.06)' }} />

      <Typography variant="h5" mb={3}>{label} ({myEvents.length})</Typography>

      {myEvents.length === 0 ? (
        <Typography color="text.secondary">
          {isCaptain ? 'You haven\'t created any events yet.' : 'No events yet. Create one above.'}
        </Typography>
      ) : (
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myEvents.map((event) => (
                <TableRow
                  key={event.id}
                  selected={editingEvent?.id === event.id}
                  sx={{
                    '&:last-child td': { border: 0 },
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
                    '&.Mui-selected': { bgcolor: 'rgba(76,175,80,0.08)' },
                    '&.Mui-selected:hover': { bgcolor: 'rgba(76,175,80,0.12)' },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{event.title}</Typography>
                    {event.description && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {event.description.length > 60 ? `${event.description.slice(0, 60)}…` : event.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={EVENT_TYPE_LABEL[event.event_type]}
                      color={EVENT_TYPE_COLOR[event.event_type]}
                      size="small"
                      sx={event.event_type === 'other' ? { bgcolor: '#4527A0', color: '#EDE7F6' } : undefined}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago' })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{event.location ?? '—'}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" gap={0.5} justifyContent="flex-end">
                      <Tooltip title="Edit event">
                        <IconButton size="small" color="primary" onClick={() => setEditingEvent(event)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete event">
                        <IconButton size="small" color="error" onClick={() => {
                          if (editingEvent?.id === event.id) setEditingEvent(null)
                          deleteEvent(event.id)
                        }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
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
