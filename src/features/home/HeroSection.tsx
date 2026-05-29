import { Box, Typography, Button, Stack, Container } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GroupsIcon from '@mui/icons-material/Groups'
import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: 'background.default',
        overflow: 'hidden',
        py: { xs: 10, md: 16 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(76,175,80,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 700 }}>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.15em', mb: 2, display: 'block' }}
          >
            Minneapolis · Twin Cities
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.8rem', md: '4.5rem' },
              lineHeight: 1.05,
              mb: 3,
              color: 'white',
            }}
          >
            Where Futbol
            <Box component="span" sx={{ color: 'primary.main' }}> Lives</Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{ fontSize: { xs: '1rem', md: '1.2rem' }, color: 'text.secondary', mb: 5, maxWidth: 560, lineHeight: 1.7 }}
          >
            A community built for football lovers of the African diaspora. Come through for FIFA sessions,
            tournaments, watch parties, and the culture — right here in the Twin Cities.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
            <Button
              component={Link}
              to="/tournaments"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<EmojiEventsIcon />}
              sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
            >
              View Tournaments
            </Button>
            <Button
              component={Link}
              to="/community"
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<GroupsIcon />}
              sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
            >
              Join the Community
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
