import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, Chip, Button, Stack,
  Paper, Divider, Avatar, Grid2 as Grid,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import GroupsIcon from '@mui/icons-material/Groups'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import PersonIcon from '@mui/icons-material/Person'
import PeopleIcon from '@mui/icons-material/People'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import type { TournamentFormat } from '../../types'
import { useTournaments } from '../../context/TournamentsContext'
import { getEventStatus } from '../../utils/eventStatus'

const statusGradient: Record<'upcoming' | 'completed', string> = {
  upcoming: 'linear-gradient(135deg, #004D40 0%, #00695C 100%)',
  completed: 'linear-gradient(135deg, #263238 0%, #37474F 100%)',
}

const formatLabel: Record<TournamentFormat, string> = {
  bracket: 'Single Elimination',
  'round-robin': 'Round Robin',
  'group-stage': 'Group Stage',
}

const formatColor: Record<TournamentFormat, 'warning' | 'info' | 'success'> = {
  bracket: 'warning',
  'round-robin': 'info',
  'group-stage': 'success',
}

const formatDescription: Record<TournamentFormat, string> = {
  bracket: 'Win or go home. Each match is single elimination — one loss and your run is over. The last player/team standing wins.',
  'round-robin': 'Everyone plays everyone. Points accumulate across matches, and the top performer at the end wins the cup.',
  'group-stage': 'Teams are divided into groups. Top performers from each group advance to knockout rounds.',
}

export default function TournamentDetailView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { tournaments } = useTournaments()

  const t = tournaments.find((t) => t.id === id)

  if (!t) {
    return (
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/tournaments')} sx={{ mb: 3 }}>
            Back to Tournaments
          </Button>
          <Typography color="text.secondary">Tournament not found.</Typography>
        </Container>
      </Box>
    )
  }

  const tournamentDate = new Date(t.date)
  const formattedDate = tournamentDate.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
  const { status, color } = getEventStatus(t.date)

  return (
    <Box>
      {/* Hero Banner */}
      <Box
        sx={{
          background: statusGradient[status],
          position: 'relative',
          overflow: 'hidden',
          pt: 5,
          pb: 6,
          boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
        }}
      >
        <Box sx={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)', color: 'white' }}>
          <EmojiEventsIcon sx={{ fontSize: 100, opacity: 0.1 }} />
        </Box>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/tournaments')}
              sx={{ color: 'rgba(255,255,255,0.8)', pl: 0, '&:hover': { color: 'white', bgcolor: 'transparent' } }}
            >
              Back to Tournaments
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Chip
              label={status}
              color={color}
              size="small"
              sx={{ textTransform: 'capitalize', fontWeight: 600 }}
            />
            <Chip
              label={formatLabel[t.format]}
              color={formatColor[t.format]}
              size="small"
              sx={{ fontWeight: 500 }}
            />
            <Chip
              label={t.mode === 'singles' ? 'Singles (1v1)' : 'Doubles (2v2)'}
              size="small"
              color={t.mode === 'singles' ? 'error' : undefined}
              sx={t.mode === 'doubles' ? { bgcolor: '#AD1457', color: 'white', fontWeight: 500 } : { fontWeight: 500 }}
            />
          </Box>
          <Typography
            variant="h2"
            sx={{ color: 'white', fontWeight: 700, fontSize: { xs: '2rem', md: '2.8rem' }, maxWidth: 680, lineHeight: 1.2, mb: 2.5 }}
          >
            {t.name}
          </Typography>
          <Stack direction="row" gap={3} flexWrap="wrap">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CalendarMonthIcon sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 17 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>{formattedDate}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <GroupsIcon sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 17 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>Up to {t.max_players} players</Typography>
            </Box>
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
                <Typography variant="h6" fontWeight={600} mb={1.5}>
                  About this tournament
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
                  {t.description || 'No description provided.'}
                </Typography>

                <Box sx={{ mt: 5 }}>
                  <Typography variant="h6" fontWeight={600} mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountTreeIcon sx={{ color: 'secondary.main', fontSize: 22 }} />
                    Format
                  </Typography>
                  <Divider sx={{ mb: 2.5 }} />
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Chip label={formatLabel[t.format]} color={formatColor[t.format]} size="small" sx={{ mt: 0.25, flexShrink: 0 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {formatDescription[t.format]}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 5 }}>
                  <Typography variant="h6" fontWeight={600} mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {t.mode === 'singles' ? (
                      <PersonIcon sx={{ color: 'error.main', fontSize: 22 }} />
                    ) : (
                      <PeopleIcon sx={{ color: '#AD1457', fontSize: 22 }} />
                    )}
                    Mode
                  </Typography>
                  <Divider sx={{ mb: 2.5 }} />
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Chip
                      label={t.mode === 'singles' ? 'Singles (1v1)' : 'Doubles (2v2)'}
                      color={t.mode === 'singles' ? 'error' : undefined}
                      size="small"
                      sx={t.mode === 'doubles' ? { bgcolor: '#AD1457', color: 'white', mt: 0.25, flexShrink: 0 } : { mt: 0.25, flexShrink: 0 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {t.mode === 'singles'
                        ? 'One player per entry. You compete solo — no teammates, just you vs. the field.'
                        : 'Two players per team. Bring a partner and compete as a duo against other teams.'}
                    </Typography>
                  </Box>
                </Box>
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
                {status === 'upcoming' ? (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{ py: 1.5, fontSize: '1rem', mb: 3, borderRadius: 1.5 }}
                  >
                    Register Now
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="inherit"
                    fullWidth
                    size="large"
                    disabled
                    sx={{ py: 1.5, fontSize: '1rem', mb: 3, borderRadius: 1.5 }}
                  >
                    Tournament Completed
                  </Button>
                )}

                <Stack gap={3}>
                  <Box>
                    <Typography
                      variant="overline"
                      color="text.disabled"
                      sx={{ letterSpacing: 1.2, fontSize: '0.68rem', fontWeight: 600 }}
                    >
                      Date
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 0.75 }}>
                      <CalendarMonthIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.15 }} />
                      <Typography variant="body2" fontWeight={500}>{formattedDate}</Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography
                      variant="overline"
                      color="text.disabled"
                      sx={{ letterSpacing: 1.2, fontSize: '0.68rem', fontWeight: 600 }}
                    >
                      Capacity
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75 }}>
                      <GroupsIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" fontWeight={500}>Up to {t.max_players} players</Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography
                      variant="overline"
                      color="text.disabled"
                      sx={{ letterSpacing: 1.2, fontSize: '0.68rem', fontWeight: 600 }}
                    >
                      Status
                    </Typography>
                    <Box sx={{ mt: 0.75 }}>
                      <Chip
                        label={status}
                        color={color}
                        size="small"
                        sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                      />
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography
                      variant="overline"
                      color="text.disabled"
                      sx={{ letterSpacing: 1.2, fontSize: '0.68rem', fontWeight: 600 }}
                    >
                      Organized by
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.75 }}>
                      <Avatar sx={{ width: 30, height: 30, bgcolor: 'secondary.main', fontSize: 13, fontWeight: 700 }}>
                        H
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>House of Futbol</Typography>
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
