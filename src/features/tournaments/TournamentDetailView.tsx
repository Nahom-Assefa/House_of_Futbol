import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, Chip, Button, Stack,
  Paper, Divider, Avatar, Grid2 as Grid,
  Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import GroupsIcon from '@mui/icons-material/Groups'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import PersonIcon from '@mui/icons-material/Person'
import PeopleIcon from '@mui/icons-material/People'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import type { TournamentFormat } from '../../types'
import { useTournaments } from '../../context/TournamentsContext'
import { getEventStatus } from '../../utils/eventStatus'
import { trackPixel } from '../../lib/pixel'
import { GTK_ICONS } from '../../utils/gtkIcons'

const statusGradient: Record<'upcoming' | 'completed', string> = {
  upcoming: 'linear-gradient(135deg, #004D40 0%, #00695C 100%)',
  completed: 'linear-gradient(135deg, #263238 0%, #37474F 100%)',
}

const formatLabel: Record<TournamentFormat, string> = {
  'single-elimination': 'Single Elimination',
  'double-elimination': 'Double Elimination',
  'round-robin': 'Round Robin',
  'group-stage': 'Group Stage',
}

const formatColor: Record<TournamentFormat, 'warning' | 'info' | 'success'> = {
  'single-elimination': 'warning',
  'double-elimination': 'warning',
  'round-robin': 'info',
  'group-stage': 'success',
}

const formatDescription: Record<TournamentFormat, string> = {
  'single-elimination': 'Win or go home. Each match is single elimination — one loss and your run is over. The last player/team standing wins.',
  'double-elimination': 'Two lives. Lose once and you drop to the losers bracket — fight back or you\'re done.',
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

  const tournamentDate = new Date(t.date + 'T00:00:00')
  const formattedDate = tournamentDate.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago',
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
                {/* About */}
                <Typography variant="h6" fontWeight={600} mb={1.5}>
                  About this tournament
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
                  {t.description || 'No description provided.'}
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
                      { icon: <CalendarMonthIcon sx={{ fontSize: 20, color: 'primary.main' }} />, label: 'Date', value: t.time ? `${formattedDate} · ${t.time}` : formattedDate },
                      { icon: <GroupsIcon sx={{ fontSize: 20, color: 'primary.main' }} />, label: 'Capacity', value: `Up to ${t.max_players} players` },
                      { icon: <AccountTreeIcon sx={{ fontSize: 20, color: 'primary.main' }} />, label: 'Format', value: formatLabel[t.format] },
                      { icon: t.mode === 'singles' ? <PersonIcon sx={{ fontSize: 20, color: 'primary.main' }} /> : <PeopleIcon sx={{ fontSize: 20, color: 'primary.main' }} />, label: 'Mode', value: t.mode === 'singles' ? 'Singles (1v1)' : 'Doubles (2v2)' },
                    ].map(({ icon, label, value }) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={label}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                            p: 2,
                            bgcolor: 'action.hover',
                            borderRadius: 2,
                          }}
                        >
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

                {/* Format */}
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

                {/* Mode */}
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

                {/* Good to Know */}
                {(t.good_to_know ?? []).length > 0 && (
                  <Box sx={{ mt: 5 }}>
                    <Typography variant="h6" fontWeight={600} mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmojiObjectsIcon sx={{ color: 'warning.main', fontSize: 22 }} />
                      Good to Know
                    </Typography>
                    <Divider sx={{ mb: 2.5 }} />
                    <Stack gap={1.5}>
                      {(t.good_to_know ?? []).map((item, idx) => (
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
                <Box sx={{ mt: 5 }}>
                  <Typography variant="h6" fontWeight={600} mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon sx={{ color: 'error.main', fontSize: 22 }} />
                    Location
                  </Typography>
                  <Divider sx={{ mb: 2.5 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" fontWeight={500}>{t.location ?? 'House of Fútbol HQ, Minneapolis, MN'}</Typography>
                  </Box>
                  <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(t.location ?? 'Minneapolis, MN')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="260"
                      style={{ border: 0, display: 'block' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Tournament location"
                    />
                  </Box>
                </Box>

                {/* FAQ */}
                {(t.faqs ?? []).length > 0 && (
                  <Box sx={{ mt: 5 }}>
                    <Typography variant="h6" fontWeight={600} mb={1.5}>
                      Frequently Asked Questions
                    </Typography>
                    <Divider sx={{ mb: 2.5 }} />
                    {(t.faqs ?? []).map((faq, idx) => (
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
                {status === 'upcoming' ? (
                  <Button variant="contained" color="primary" fullWidth size="large" sx={{ py: 1.5, fontSize: '1rem', mb: 3, borderRadius: 1.5 }} onClick={() => { trackPixel('InitiateCheckout', { content_name: t?.name, content_category: 'Tournament Registration' }); navigate(`/tournaments/${id}/register`) }}>
                    Register Now
                  </Button>
                ) : (
                  <Button variant="outlined" color="inherit" fullWidth size="large" disabled sx={{ py: 1.5, fontSize: '1rem', mb: 3, borderRadius: 1.5 }}>
                    Tournament Completed
                  </Button>
                )}

                <Stack gap={3}>
                  <Box>
                    <Typography variant="overline" color="text.disabled" sx={{ letterSpacing: 1.2, fontSize: '0.68rem', fontWeight: 600 }}>
                      Date
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 0.75 }}>
                      <CalendarMonthIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.15 }} />
                      <Box>
                        <Typography variant="body2" fontWeight={500}>{formattedDate}</Typography>
                        {t.time && <Typography variant="caption" color="text.secondary">{t.time}</Typography>}
                      </Box>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="overline" color="text.disabled" sx={{ letterSpacing: 1.2, fontSize: '0.68rem', fontWeight: 600 }}>
                      Capacity
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75 }}>
                      <GroupsIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" fontWeight={500}>Up to {t.max_players} players</Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="overline" color="text.disabled" sx={{ letterSpacing: 1.2, fontSize: '0.68rem', fontWeight: 600 }}>
                      Status
                    </Typography>
                    <Box sx={{ mt: 0.75 }}>
                      <Chip label={status} color={color} size="small" sx={{ textTransform: 'capitalize', fontWeight: 600 }} />
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="overline" color="text.disabled" sx={{ letterSpacing: 1.2, fontSize: '0.68rem', fontWeight: 600 }}>
                      Organized by
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.75 }}>
                      <Avatar sx={{ width: 30, height: 30, bgcolor: 'secondary.main', fontSize: 13, fontWeight: 700 }}>H</Avatar>
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
