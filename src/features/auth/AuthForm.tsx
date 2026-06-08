import { useState } from 'react'
import {
  Box, Container, Paper, Typography,
  TextField, Button, /* Tabs, Tab, */ Alert, Stack,
} from '@mui/material'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'

export default function AuthForm() {
  // const [tab, setTab] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  function handleSubmit() {
    // Supabase auth wired up once env vars are configured
    setMessage('Sign in coming soon — connect Supabase to enable auth.')
  }

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <SportsSoccerIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h4">House of Fútbol</Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Sign in to register for tournaments and RSVP to events
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 } }}>
          {/* <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 4 }}>
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs> */}

          {message && (
            <Alert severity="info" sx={{ mb: 3 }} onClose={() => setMessage(null)}>
              {message}
            </Alert>
          )}

          <Stack gap={3}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={!email || !password}
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
