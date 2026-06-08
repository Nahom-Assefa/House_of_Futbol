import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, Chip, Button, Stack,
  Paper, Divider, Avatar, Grid2 as Grid,
  Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import TvIcon from '@mui/icons-material/Tv'
import GroupsIcon from '@mui/icons-material/Groups'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects'
import type { EventType } from '../../types'
import { useEvents } from '../../context/EventsContext'
import { getEventStatus } from '../../utils/eventStatus'
import { GTK_ICONS } from '../../utils/gtkIcons'

const eventTypeLabel: Record<EventType, string> = {
  gaming: 'Gaming',
  watch_party: 'Watch Party',
  community: 'Community',
  pick_up: 'Pick-Up',
  other: 'Other',
}

const eventTypeGradient: Record<EventType, string> = {
  gaming: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
  watch_party: 'linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%)',
  community: 'linear-gradient(135deg, #01579B 0%, #0277BD 100%)',
  pick_up: 'linear-gradient(135deg, #B71C1C 0%, #C62828 100%)',
  other: 'linear-gradient(135deg, #4527A0 0%, #512DA8 100%)',
}

const eventTypeIcon: Record<EventType, React.ReactNode> = {
  gaming: <SportsSoccerIcon sx={{ fontSize: 64, opacity: 0.15 }} />,
  watch_party: <TvIcon sx={{ fontSize: 64, opacity: 0.15 }} />,
  community: <GroupsIcon sx={{ fontSize: 64, opacity: 0.15 }} />,
  pick_up: <DirectionsRunIcon sx={{ fontSize: 64, opacity: 0.15 }} />,
  other: <EmojiEventsIcon sx={{ fontSize: 64, opacity: 0.15 }} />,
}

const eventTypeIconSmall: Record<EventType, React.ReactNode> = {
  gaming: <SportsSoccerIcon sx={{ fontSize: 20, color: 'primary.main' }} />,
  watch_party: <TvIcon sx={{ fontSize: 20, color: 'primary.main' }} />,
  community: <GroupsIcon sx={{ fontSize: 20, color: 'primary.main' }} />,
  pick_up: <DirectionsRunIcon sx={{ fontSize: 20, color: 'primary.main' }} />,
  other: <EmojiEventsIcon sx={{ fontSize: 20, color: 'primary.main' }} />,
}

export default function EventDetailView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { events } = useEvents()

  const event = events.find((e) => e.id === id)

  if (!event) {
    return (
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/community')} sx={{ mb: 3 }}>
            Back to Events
          </Button>
          <Typography color="text.secondary">Event not found.</Typography>
        </Container>
      </Box>
    )
  }

  const eventDate = new Date(event.date + 'T00:00:00')
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago',
  })
  const { status, color } = getEventStatus(event.date)

  return (
    <Box>
      {/* Hero Banner */}
      <Box
        sx={{
          background: eventTypeGradient[event.event_type],
          position: 'relative',
          overflow: 'hidden',
          pt: 5,
          pb: 6,
          boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
        }}
      >
        <Box sx={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)', color: 'white' }}>
          {eventTypeIcon[event.event_type]}
        </Box>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/community')}
              sx={{ color: 'rgba(255,255,255,0.8)', pl: 0, '&:hover': { color: 'white', bgcolor: 'transparent' } }}
            >
              Back to Events
            </Button>
          </Box>
          <Stack direction="row" gap={1} mb={2}>
            <Chip
              label={eventTypeLabel[event.event_type]}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'white', backdropFilter: 'blur(8px)', fontWeight: 500 }}
            />
            <Chip
              label={status}
              color={color}
              size="small"
              sx={{ textTransform: 'capitalize', fontWeight: 500 }}
            />
          </Stack>
          <Typography
            variant="h2"
            sx={{ color: 'white', fontWeight: 700, fontSize: { xs: '2rem', md: '2.8rem' }, maxWidth: 680, lineHeight: 1.2, mb: 2.5 }}
          >
            {event.title}
          </Typography>
          <Stack direction="row" gap={3} flexWrap="wrap">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CalendarMonthIcon sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 17 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>{formattedDate}</Typography>
            </Box>
            {event.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <LocationOnIcon sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 17 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>{event.location}</Typography>
              </Box>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Content */}
      <Box sx={{ bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ pt: 5 }}>
            {/* Main Content */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper
                elevation={0}
                sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
              >
                {/* About */}
                <Typography variant="h6" fontWeight={600} mb={1.5}>
                  About this event
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
                  {event.description || 'No description provided.'}
                </Typography>

                {/* Overview */}
                <Box sx={{ mt: 5 }}>
                  <Typography variant="h6" fontWeight={600} mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmojiEventsIcon sx={{ color: 'secondary.main', fontSize: 22 }} />
                    Overview
                  </Typography>
                  <Divider sx={{ mb: 2.5 }} />
                  <Grid container spacing={2}>
                    {[
                      { icon: <CalendarMonthIcon sx={{ fontSize: 20, color: 'primary.main' }} />, label: 'Date', value: event.time ? `${formattedDate} · ${event.time}` : formattedDate },
                      { icon: <LocationOnIcon sx={{ fontSize: 20, color: 'primary.main' }} />, label: 'Location', value: event.location || 'TBD' },
                      { icon: eventTypeIconSmall[event.event_type], label: 'Type', value: eventTypeLabel[event.event_type] },
                      { icon: <CheckCircleOutlineIcon sx={{ fontSize: 20, color: color === 'success' ? 'success.main' : 'text.disabled' }} />, label: 'Status', value: status.charAt(0).toUpperCase() + status.slice(1) },
                      ...(event.max_attendees != null ? [{ icon: <GroupsIcon sx={{ fontSize: 20, color: 'primary.main' }} />, label: 'Capacity', value: `Up to ${event.max_attendees} attendees` }] : []),
                    ].map(({ icon, label, value }) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={label}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                          {icon}
                          <Box>
                            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                              {label}
                            </Typography>
                            <Typography variant="body2" fontWeight={500} sx={{ mt: 0.25 }}>
                              {value}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Good to Know */}
                {(event.good_to_know ?? []).length > 0 && (
                  <Box sx={{ mt: 5 }}>
                    <Typography variant="h6" fontWeight={600} mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmojiObjectsIcon sx={{ color: 'warning.main', fontSize: 22 }} />
                      Good to Know
                    </Typography>
                    <Divider sx={{ mb: 2.5 }} />
                    <Stack gap={1.5}>
                      {(event.good_to_know ?? []).map((item, idx) => (
                        <Box
                          key={idx}
                          sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}
                        >
                          {GTK_ICONS[item.icon]?.node ?? <CheckCircleOutlineIcon sx={{ fontSize: 20, flexShrink: 0 }} />}
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            {item.text}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Location */}
                {event.location && (
                  <Box sx={{ mt: 5 }}>
                    <Typography variant="h6" fontWeight={600} mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOnIcon sx={{ color: 'error.main', fontSize: 22 }} />
                      Location
                    </Typography>
                    <Divider sx={{ mb: 2.5 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" fontWeight={500}>{event.location}</Typography>
                    </Box>
                    <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                      <iframe
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(event.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        width="100%"
                        height="260"
                        style={{ border: 0, display: 'block' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Event location"
                      />
                    </Box>
                  </Box>
                )}

                {/* FAQ */}
                {(event.faqs ?? []).length > 0 && (
                  <Box sx={{ mt: 5 }}>
                    <Typography variant="h6" fontWeight={600} mb={1.5}>
                      Frequently Asked Questions
                    </Typography>
                    <Divider sx={{ mb: 2.5 }} />
                    {(event.faqs ?? []).map((faq, idx) => (
                      <Accordion
                        key={idx}
                        elevation={0}
                        disableGutters
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: '8px !important',
                          mb: 1.5,
                          '&:before': { display: 'none' },
                          '&.Mui-expanded': { borderColor: 'primary.main' },
                        }}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5 }}>
                          <Typography variant="body2" fontWeight={600}>{faq.q}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 2.5, pt: 0 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>{faq.a}</Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Sidebar */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  position: 'sticky',
                  top: 24,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ py: 1.5, fontSize: '1rem', mb: 3, borderRadius: 1.5 }}
                  onClick={() => navigate(`/community/${id}/rsvp`)}
                >
                  RSVP — It's Free
                </Button>

                <Stack gap={3}>
                  <Box>
                    <Typography variant="overline" color="text.disabled" sx={{ letterSpacing: 1.2, fontSize: '0.68rem', fontWeight: 600 }}>
                      Date & Time
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 0.75 }}>
                      <CalendarMonthIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.15 }} />
                      <Box>
                        <Typography variant="body2" fontWeight={500}>{formattedDate}</Typography>
                        {event.time && (
                          <Typography variant="caption" color="text.secondary">{event.time}</Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {event.location && (
                    <Box>
                      <Typography variant="overline" color="text.disabled" sx={{ letterSpacing: 1.2, fontSize: '0.68rem', fontWeight: 600 }}>
                        Location
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 0.75 }}>
                        <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.1 }} />
                        <Typography variant="body2" fontWeight={500}>{event.location}</Typography>
                      </Box>
                    </Box>
                  )}

                  {event.max_attendees != null && (
                    <Box>
                      <Typography variant="overline" color="text.disabled" sx={{ letterSpacing: 1.2, fontSize: '0.68rem', fontWeight: 600 }}>
                        Capacity
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75 }}>
                        <GroupsIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight={500}>Up to {event.max_attendees} attendees</Typography>
                      </Box>
                    </Box>
                  )}

                  <Divider />

                  <Box>
                    <Typography variant="overline" color="text.disabled" sx={{ letterSpacing: 1.2, fontSize: '0.68rem', fontWeight: 600 }}>
                      Organized by
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.75 }}>
                      <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main', fontSize: 13, fontWeight: 700 }}>H</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>House of Fútbol</Typography>
                        <Typography variant="caption" color="text.secondary">Twin Cities</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ pb: 8 }} />
        </Container>
      </Box>
    </Box>
  )
}
