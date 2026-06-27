import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, Button, Paper, TextField,
  Stack, Divider, Chip, Alert, FormControlLabel, Checkbox,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import BlockIcon from '@mui/icons-material/Block'
import { useTournaments } from '../../context/TournamentsContext'
import { useRegistration } from '../../context/RegistrationContext'
import { trackPixel } from '../../lib/pixel'
import { supabase } from '../../lib/supabase'

interface FormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  partnerName: string
  note: string
}

const emptyForm: FormState = {
  firstName: '', lastName: '', email: '', phone: '', partnerName: '', note: '',
}

export default function TournamentRegistrationForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { tournaments } = useTournaments()
  const { submitRegistration } = useRegistration()

  const tournament = tournaments.find((t) => t.id === id)
  const isDoubles = tournament?.mode === 'doubles'

  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [atCapacity, setAtCapacity] = useState(false)
  const [smsOptIn, setSmsOptIn] = useState(true)

  useEffect(() => {
    const tournamentId = tournament?.id
    const maxPlayers = tournament?.max_players
    if (!tournamentId || !maxPlayers) return
    supabase.rpc('get_tournament_registration_count', { p_tournament_id: tournamentId })
      .then(({ data }) => {
        if (typeof data === 'number' && data >= maxPlayers) setAtCapacity(true)
      })
  }, [tournament?.id])

  if (!tournament) {
    return (
      <Box sx={{ py: 8 }}>
        <Container maxWidth="sm">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/tournaments')} sx={{ mb: 3 }}>
            Back to Tournaments
          </Button>
          <Typography color="text.secondary">Tournament not found.</Typography>
        </Container>
      </Box>
    )
  }

  const tournamentDate = new Date(tournament.date + 'T00:00:00')
  const formattedDate = tournamentDate.toLocaleDateString('en-US', {
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
    if (isDoubles && !form.partnerName.trim()) {
      next.partnerName = "Partner's name is required for doubles"
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
      const { data: count } = await supabase.rpc('get_tournament_registration_count', { p_tournament_id: id! })
      if (typeof count === 'number' && count >= (tournament?.max_players ?? Infinity)) {
        setAtCapacity(true)
        return
      }
      await submitRegistration({
        tournament_id: id!,
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        partner_name: isDoubles ? form.partnerName : null,
        note: form.note,
        sms_opt_in: smsOptIn,
      })
      trackPixel('Lead', { content_name: tournament?.name, content_category: 'Tournament Registration' })
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
            <Typography variant="h5" fontWeight={700} mb={1}>This tournament is full</Typography>
            <Typography color="text.secondary" mb={4}>
              <strong>{tournament.name}</strong> has reached maximum capacity of {tournament.max_players} players. Registration is now closed.
            </Typography>
            <Stack direction="row" gap={2} justifyContent="center">
              <Button variant="outlined" onClick={() => navigate(`/tournaments/${id}`)}>
                Back to Tournament
              </Button>
              <Button variant="contained" onClick={() => navigate('/tournaments')}>
                Browse More
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
            <Typography variant="h5" fontWeight={700} mb={1}>You're registered!</Typography>
            <Typography color="text.secondary" mb={1}>
              Thanks, <strong>{form.firstName}</strong>. We'll send details to <strong>{form.email}</strong>.
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
              See you at <strong>{tournament.name}</strong> on {formattedDate}.
            </Typography>
            <Stack direction="row" gap={2} justifyContent="center">
              <Button variant="outlined" onClick={() => navigate(`/tournaments/${id}`)}>
                Back to Tournament
              </Button>
              <Button variant="contained" onClick={() => navigate('/tournaments')}>
                Browse More
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    )
  }

  return (
    <Box>
      {/* Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #004D40 0%, #00695C 100%)',
          pt: 4,
          pb: 5,
          boxShadow: '0 4px 24px rgba(0,0,0,0.28)',
        }}
      >
        <Container maxWidth="sm">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/tournaments/${id}`)}
            sx={{ color: 'rgba(255,255,255,0.8)', pl: 0, mb: 3, '&:hover': { color: 'white', bgcolor: 'transparent' } }}
          >
            Back to Tournament
          </Button>
          <Stack direction="row" gap={1} mb={1.5}>
            <Chip
              label={tournament.mode === 'singles' ? 'Singles (1v1)' : 'Doubles (2v2)'}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'white', backdropFilter: 'blur(8px)', fontWeight: 500 }}
            />
          </Stack>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, lineHeight: 1.25, mb: 2 }}>
            {tournament.name}
          </Typography>
          <Stack direction="row" gap={3} flexWrap="wrap">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CalendarMonthIcon sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 17 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}>{formattedDate}</Typography>
            </Box>
            {tournament.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <LocationOnIcon sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 17 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem' }}>{tournament.location}</Typography>
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
              Register for the Tournament
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {isDoubles ? 'Fill in your details and your partner\'s name below.' : 'Fill in your details below.'}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Alert severity="info" sx={{ mb: 3, borderRadius: 1.5 }}>
              Your information is used to confirm your spot.
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
                helperText={errors.phone ?? 'For tournament-day reminders'}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={smsOptIn}
                    onChange={(e) => setSmsOptIn(e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="caption" color="text.secondary">
                    I agree to receive SMS updates about this tournament. Message & data rates may apply. Reply STOP to opt out.
                  </Typography>
                }
                sx={{ alignItems: 'flex-start', mt: 0.5 }}
              />

              {isDoubles && (
                <TextField
                  label="Partner's Full Name"
                  required
                  fullWidth
                  value={form.partnerName}
                  onChange={handleChange('partnerName')}
                  error={!!errors.partnerName}
                  helperText={errors.partnerName ?? 'Your doubles partner for this tournament if applicable'}
                />
              )}

              <TextField
                label="Anything we should know?"
                multiline
                rows={3}
                fullWidth
                value={form.note}
                onChange={handleChange('note')}
                placeholder="Questions, special requests…"
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
              {submitting ? 'Submitting…' : 'Confirm Registration'}
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}
