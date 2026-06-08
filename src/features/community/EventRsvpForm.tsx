import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, Button, Paper, TextField,
  Stack, Divider, Chip, Alert,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import BlockIcon from '@mui/icons-material/Block'
import { useEvents } from '../../context/EventsContext'
import { useRsvp } from '../../context/RsvpContext'
import { supabase } from '../../lib/supabase'
import type { EventType } from '../../types'

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

interface FormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  note: string
}

const emptyForm: FormState = { firstName: '', lastName: '', email: '', phone: '', note: '' }

export default function EventRsvpForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { events } = useEvents()
  const { submitRsvp } = useRsvp()

  const event = events.find((e) => e.id === id)

  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [atCapacity, setAtCapacity] = useState(false)

  useEffect(() => {
    const maxAttendees = event?.max_attendees
    const eventId = event?.id
    if (!maxAttendees || !eventId) return
    supabase.rpc('get_event_rsvp_count', { p_event_id: eventId })
      .then(({ data }) => {
        if (typeof data === 'number' && data >= maxAttendees) setAtCapacity(true)
      })
  }, [event?.id])

  if (!event) {
    return (
      <Box sx={{ py: 8 }}>
        <Container maxWidth="sm">
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

  function validate(): boolean {
    const next: Partial<FormState> = {}
    if (!form.firstName.trim()) next.firstName = 'First name is required'
    if (!form.lastName.trim()) next.lastName = 'Last name is required'
    if (!form.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address'
    }
    if (!form.phone.trim()) {
      next.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s\-().]{7,15}$/.test(form.phone.trim())) {
      next.phone = 'Enter a valid phone number'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleChange(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      if (event?.max_attendees != null) {
        const { data: count } = await supabase.rpc('get_event_rsvp_count', { p_event_id: id! })
        if (typeof count === 'number' && count >= event.max_attendees) {
          setAtCapacity(true)
          return
        }
      }
      await submitRsvp({
        event_id: id!,
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        note: form.note,
      })
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (atCapacity) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{ p: { xs: 4, md: 5 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}
          >
            <BlockIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={700} mb={1}>This event is at capacity</Typography>
            <Typography color="text.secondary" mb={4}>
              <strong>{event?.title}</strong> has reached its maximum capacity of {event?.max_attendees} attendees. RSVPs are now closed.
            </Typography>
            <Stack direction="row" gap={2} justifyContent="center">
              <Button variant="outlined" onClick={() => navigate(`/community/${id}`)}>
                Back to Event
              </Button>
              <Button variant="contained" onClick={() => navigate('/community')}>
                Browse More Events
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    )
  }

  if (submitted) {
    return (
      <Box sx={{ bgcolor: 'background.default', minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{ p: { xs: 4, md: 5 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}
          >
            <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={700} mb={1}>You're on the list!</Typography>
            <Typography color="text.secondary" mb={1}>
              Thanks, <strong>{form.firstName}</strong>. We'll send event details to <strong>{form.email}</strong>.
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
              See you at <strong>{event.title}</strong> on {formattedDate}.
            </Typography>
            <Stack direction="row" gap={2} justifyContent="center">
              <Button variant="outlined" onClick={() => navigate(`/community/${id}`)}>
                Back to Event
              </Button>
              <Button variant="contained" onClick={() => navigate('/community')}>
                Browse More Events
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    )
  }

  return (
    <Box>
      {/* Mini header banner */}
      <Box
        sx={{
          background: eventTypeGradient[event.event_type],
          pt: 4,
          pb: 5,
          boxShadow: '0 4px 24px rgba(0,0,0,0.28)',
        }}
      >
        <Container maxWidth="sm">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/community/${id}`)}
            sx={{ color: 'rgba(255,255,255,0.8)', pl: 0, mb: 3, '&:hover': { color: 'white', bgcolor: 'transparent' } }}
          >
            Back to Event
          </Button>
          <Chip
            label={eventTypeLabel[event.event_type]}
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'white', backdropFilter: 'blur(8px)', fontWeight: 500, mb: 1.5 }}
          />
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, lineHeight: 1.25, mb: 2 }}>
            {event.title}
          </Typography>
          <Stack direction="row" gap={3} flexWrap="wrap">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CalendarMonthIcon sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 17 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}>{formattedDate}</Typography>
            </Box>
            {event.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <LocationOnIcon sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 17 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}>{event.location}</Typography>
              </Box>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Form */}
      <Box sx={{ bgcolor: 'background.default', py: 6 }}>
        <Container maxWidth="sm">
          <Paper
            component="form"
            onSubmit={handleSubmit}
            noValidate
            elevation={0}
            sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
          >
            <Typography variant="h6" fontWeight={700} mb={0.5}>
              Reserve Your Spot
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Fill in your details below
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Alert severity="info" sx={{ mb: 3, borderRadius: 1.5 }}>
              Your information is only used to confirm your attendance.
            </Alert>

            <Stack gap={2.5}>
              <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
                <TextField
                  label="First Name"
                  required
                  fullWidth
                  value={form.firstName}
                  onChange={handleChange('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
                <TextField
                  label="Last Name"
                  required
                  fullWidth
                  value={form.lastName}
                  onChange={handleChange('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Stack>

              <TextField
                label="Email Address"
                type="email"
                required
                fullWidth
                value={form.email}
                onChange={handleChange('email')}
                error={!!errors.email}
                helperText={errors.email}
              />

              <TextField
                label="Phone Number"
                type="tel"
                required
                fullWidth
                value={form.phone}
                onChange={handleChange('phone')}
                error={!!errors.phone}
                helperText={errors.phone ?? 'For event-day reminders'}
              />

              <TextField
                label="Anything we should know?"
                multiline
                rows={3}
                fullWidth
                value={form.note}
                onChange={handleChange('note')}
                placeholder="Dietary needs, questions, bringing guests…"
              />
            </Stack>

            {submitError && (
              <Alert severity="error" sx={{ mt: 3, borderRadius: 1.5 }}>
                {submitError}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={submitting}
              sx={{ mt: 2, py: 1.5, fontSize: '1rem', borderRadius: 1.5 }}
            >
              {submitting ? 'Submitting…' : 'Confirm RSVP'}
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}
