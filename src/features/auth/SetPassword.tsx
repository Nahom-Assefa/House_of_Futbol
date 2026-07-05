import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box, Container, Paper, Typography,
  TextField, Button, Alert, Stack, CircularProgress,
} from '@mui/material'
import LockResetIcon from '@mui/icons-material/LockReset'
import { supabase } from '../../lib/supabase'

type Step = 'verifying' | 'set-password' | 'error'

export default function SetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState<Step>('verifying')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type') as 'invite' | 'recovery' | null

    async function verify() {
      if (tokenHash && (type === 'invite' || type === 'recovery')) {
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
        setStep(error ? 'error' : 'set-password')
      } else {
        const { data: { session } } = await supabase.auth.getSession()
        setStep(session ? 'set-password' : 'error')
      }
    }

    verify()
  }, [])

  async function handleSubmit() {
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setSubmitting(true)
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    setSubmitting(false)
    if (error) {
      setError(error.message)
    } else {
      navigate('/admin', { replace: true })
    }
  }

  return (
    <Box sx={{ py: { xs: 8, md: 14 }, minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="xs">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <LockResetIcon sx={{ fontSize: 52, color: 'secondary.main', mb: 1 }} />
          <Typography variant="h5" fontWeight={700}>Set Your Password</Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Create a password to access your Captain Portal
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 } }}>
          {step === 'verifying' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {step === 'error' && (
            <Alert severity="error">
              This invite link is invalid or has expired. Contact your admin for a new invite.
            </Alert>
          )}

          {step === 'set-password' && (
            <Stack gap={3}>
              {error && (
                <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
              )}
              <TextField
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null) }}
                fullWidth
                autoFocus
                helperText="At least 8 characters"
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setError(null) }}
                fullWidth
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
              />
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={!password || !confirm || submitting}
                onClick={handleSubmit}
              >
                {submitting ? 'Saving…' : 'Set Password & Enter Portal'}
              </Button>
            </Stack>
          )}
        </Paper>
      </Container>
    </Box>
  )
}
