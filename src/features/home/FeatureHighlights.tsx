import { Box, Container, Grid, Typography, Paper } from '@mui/material'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import LiveTvIcon from '@mui/icons-material/LiveTv'
import GroupsIcon from '@mui/icons-material/Groups'

const features = [
  {
    icon: <SportsEsportsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'FIFA Sessions',
    description: 'High-performance gaming setups ready for competitive play. Show up and run it.',
  },
  {
    icon: <EmojiEventsIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
    title: 'Tournaments',
    description: 'Structured brackets and round-robins. Prove you\'re the best in the Twin Cities.',
  },
  {
    icon: <LiveTvIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Watch Parties',
    description: 'EPL matchdays, World Cup, AFCON — watch the beautiful game together, the right way.',
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
    title: 'Community',
    description: 'A home for the diaspora in Minneapolis. Connect, compete, and build.',
  },
]

export default function FeatureHighlights() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{ textAlign: 'center', mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
        >
          Everything 4 Footballers
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: 'center', mb: 8, maxWidth: 500, mx: 'auto' }}
        >
          More than a gaming spot. A full culture hub built around the game we love.
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 32px rgba(76,175,80,0.12)',
                  },
                }}
              >
                {feature.icon}
                <Typography variant="h6">{feature.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
