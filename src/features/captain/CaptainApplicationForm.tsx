import { useState } from 'react'
import {
  Box, Container, Typography, TextField, Button,
  Paper, Stack, Divider, Alert,
} from '@mui/material'
import { GiPirateCaptain } from "react-icons/gi";
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { supabase } from '../../lib/supabase'

interface FormState {
  display_name: string
  email: string
  message: string
}

const emptyForm: FormState = { display_name: '', email: '', message: '' }

export default function CaptainApplicationForm() {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function handleChange(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function validate(): boolean {
    const next: Partial<FormState> = {}
    if (!form.display_name.trim()) next.display_name = 'Name is required'
    if (!form.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address'
    }
    if (!form.message.trim()) next.message = 'Please tell us why you want to be a captain'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const { error } = await supabase.from('captain_applications').insert({
        display_name: form.display_name.trim(),
        email: form.email.trim().toLowerCase(),
        message: form.message.trim(),
      })
      if (error) throw error
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
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
            <Typography variant="h5" fontWeight={700} mb={1}>Application received!</Typography>
            <Typography color="text.secondary">
              Thanks, <strong>{form.display_name}</strong>. We'll review your application and reach out to <strong>{form.email}</strong> soon.
            </Typography>
          </Paper>
        </Container>
      </Box>
    )
  }

  return (
    <Box>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #004D40 0%, #1B5E20 100%)',
          pt: 5,
          pb: 6,
          boxShadow: '0 4px 24px rgba(0,0,0,0.28)',
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <GiPirateCaptain size={36} style={{ color: 'rgba(255,255,255,0.85)' }} />
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
              Become a Captain
            </Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 480 }}>
            Host events and tournaments under the House of Fútbol banner. Apply below and we'll be in touch.
          </Typography>
        </Container>
      </Box>

      <Box sx={{ bgcolor: 'background.default', py: 6 }}>
        <Container maxWidth="sm">
          <Paper
            component="form"
            onSubmit={handleSubmit}
            noValidate
            elevation={0}
            sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
          >
            <Typography variant="h6" fontWeight={700} mb={0.5}>Your Application</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              All fields are required.
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack gap={2.5}>
              <TextField
                label="Full Name"
                placeholder="House of Fútbol - Your Name"
                required
                fullWidth
                value={form.display_name}
                onChange={handleChange('display_name')}
                error={!!errors.display_name}
                helperText={errors.display_name ?? 'This is how you\'ll appear publicly as a host'}
              />

              <TextField
                label="Email Address"
                type="email"
                required
                fullWidth
                value={form.email}
                onChange={handleChange('email')}
                error={!!errors.email}
                helperText={errors.email ?? 'We\'ll use this to contact you and set up your account'}
              />

              <TextField
                label="Why do you want to be a captain?"
                multiline
                rows={4}
                required
                fullWidth
                value={form.message}
                onChange={handleChange('message')}
                error={!!errors.message}
                helperText={errors.message ?? 'Tell us about yourself'}
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
              sx={{ mt: 3, py: 1.5, fontSize: '1rem', borderRadius: 1.5 }}
            >
              {submitting ? 'Submitting…' : 'Submit Application'}
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
  )
}
