import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Paper, Typography,
  TextField, Button, Alert, Stack,
} from '@mui/material'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export default function AdminLoginForm() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/admin', { replace: true })
  }, [isAuthenticated, navigate])

  async function handleSubmit() {
    if (!email || !password) return
    setSubmitting(true)
    setError(null)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (authError) {
      setError('Incorrect email or password.')
      setPassword('')
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <Box sx={{ py: { xs: 8, md: 14 }, minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="xs">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <AdminPanelSettingsIcon sx={{ fontSize: 52, color: 'secondary.main', mb: 1 }} />
          <Typography variant="h5" fontWeight={700}>Admin Portal</Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            House of Fútbol · Admin and Captains only
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 } }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Stack gap={3}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null) }}
              onKeyDown={handleKeyDown}
              fullWidth
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null) }}
              onKeyDown={handleKeyDown}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={!email || !password || submitting}
              onClick={handleSubmit}
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
