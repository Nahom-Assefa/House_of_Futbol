import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Grid2 as Grid, Paper, Chip, Button, Stack, CircularProgress } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import GroupsIcon from '@mui/icons-material/Groups'
import { useTournaments } from '../../context/TournamentsContext'
import type { TournamentFormat } from '../../types'
import { getEventStatus } from '../../utils/eventStatus'

const formatColor: Record<TournamentFormat, 'warning' | 'info' | 'success'> = {
  bracket: 'warning',
  'double-elimination': 'warning',
  'round-robin': 'info',
  'group-stage': 'success',
}

const formatLabel: Record<TournamentFormat, string> = {
  bracket: 'Single Elimination',
  'double-elimination': 'Double Elimination',
  'round-robin': 'Round Robin',
  'group-stage': 'Group Stage',
}

export default function TournamentsList() {
  const { tournaments, loading } = useTournaments()
  const navigate = useNavigate()

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" gap={2} mb={2}>
          <EmojiEventsIcon sx={{ color: 'secondary.main', fontSize: 36 }} />
          <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            Tournaments
          </Typography>
        </Stack>
        <Typography color="text.secondary" mb={6}>
          Compete, climb the ranks, and prove you're the best in the Twin Cities.
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : tournaments.length === 0 ? (
          <Typography color="text.secondary">No tournaments yet.</Typography>
        ) : (
        <Grid container spacing={3}>
          {tournaments.map((t) => (
            <Grid size={{ xs: 12, md: 6 }} key={t.id}>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h5">{t.name}</Typography>
                  <Chip
                    label={getEventStatus(t.date).status}
                    color={getEventStatus(t.date).color}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary">{t.description}</Typography>

                <Stack direction="row" gap={2} flexWrap="wrap">
                  <Chip label={formatLabel[t.format]} color={formatColor[t.format]} size="small" />
                  <Chip
                    label={t.mode === 'singles' ? 'Singles (1v1)' : 'Doubles (2v2)'}
                    size="small"
                    color={t.mode === 'singles' ? 'error' : undefined}
                    sx={t.mode === 'doubles' ? { bgcolor: '#AD1457', color: 'white' } : undefined}
                  />
                </Stack>

                <Stack direction="row" gap={3} sx={{ mt: 'auto', pt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarMonthIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(t.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago' })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <GroupsIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Up to {t.max_players} players
                    </Typography>
                  </Box>
                </Stack>

                <Button variant="contained" color="primary" size="small" sx={{ alignSelf: 'flex-start', mt: 1 }} onClick={() => navigate(`/tournaments/${t.id}`)}>
                  Learn More
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
        )}
      </Container>
    </Box>
  )
}
