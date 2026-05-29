import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Grid2 as Grid, Paper, Chip, Button, Stack, ToggleButtonGroup, ToggleButton } from '@mui/material'
import GroupsIcon from '@mui/icons-material/Groups'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import type { EventType } from '../../types'
import { useEvents } from '../../context/EventsContext'
import { getEventStatus } from '../../utils/eventStatus'

const eventTypeLabel: Record<EventType, string> = {
  gaming: 'Gaming',
  watch_party: 'Watch Party',
  community: 'Community',
  pick_up: 'Pick-Up',
  other: 'Other',
}

const eventTypeColor: Record<EventType, 'success' | 'secondary' | 'info' | 'error' | 'default'> = {
  gaming: 'success',
  watch_party: 'secondary',
  community: 'info',
  pick_up: 'error',
  other: 'default',
}

export default function CommunityEvents() {
  const { events } = useEvents()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<EventType | 'all'>('all')

  const filtered = filter === 'all' ? events : events.filter((e) => e.event_type === filter)

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" gap={2} mb={2}>
          <GroupsIcon sx={{ color: 'primary.main', fontSize: 36 }} />
          <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            Community & Events
          </Typography>
        </Stack>
        <Typography color="text.secondary" mb={5}>
          Gaming sessions, watch parties, and community meetups. Something for everyone.
        </Typography>

        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, val) => { if (val !== null) setFilter(val) }}
          sx={{ mb: 5, flexWrap: 'wrap', gap: 0.5 }}
          size="small"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="gaming">Gaming</ToggleButton>
          <ToggleButton value="watch_party">Watch Parties</ToggleButton>
          <ToggleButton value="pick_up">Pick-Up</ToggleButton>
          <ToggleButton value="community">Community</ToggleButton>
          <ToggleButton value="other">Other</ToggleButton>
        </ToggleButtonGroup>

        {filtered.length === 0 ? (
          <Typography color="text.secondary">No events in this category yet.</Typography>
        ) : (
          <Grid container spacing={3}>
            {filtered.map((event) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-2px)' },
                  }}
                >
                  <Stack direction="row" gap={1}>
                    <Chip
                      label={eventTypeLabel[event.event_type]}
                      color={event.event_type !== 'other' ? eventTypeColor[event.event_type] : undefined}
                      size="small"
                      sx={{ ...(event.event_type === 'other' && { bgcolor: '#4527A0', color: '#EDE7F6' }) }}
                    />
                    <Chip
                      label={getEventStatus(event.date).status}
                      color={getEventStatus(event.date).color}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Stack>
                  <Typography variant="h6">{event.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {event.description}
                  </Typography>

                  <Box sx={{ mt: 'auto', pt: 1 }}>
                    <Stack gap={1} mb={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarMonthIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </Typography>
                      </Box>
                      {event.location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {event.location}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                    <Button variant="outlined" color="primary" size="small" fullWidth onClick={() => navigate(`/community/${event.id}`)}>
                      Learn More
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}
