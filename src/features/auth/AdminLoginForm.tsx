import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Paper, Typography,
  TextField, Button, Alert, Stack,
} from '@mui/material'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { useAuth } from '../../context/AuthContext'

export default function AdminLoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit() {
    const success = login(username, password)
    if (success) {
      navigate('/admin', { replace: true })
    } else {
      setError(true)
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
            House of Futbol · Staff only
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 } }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(false)}>
              Incorrect username or password
            </Alert>
          )}

          <Stack gap={3}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(false) }}
              onKeyDown={handleKeyDown}
              fullWidth
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false) }}
              onKeyDown={handleKeyDown}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={!username || !password}
              onClick={handleSubmit}
            >
              Sign In
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
