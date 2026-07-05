import { Box, Container, Typography, Link as MuiLink, Stack } from '@mui/material'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          gap={3}
        >
          {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="img" src="/logo.png" alt="House of Fútbol" sx={{ height: 48, width: 48, objectFit: 'contain' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
              House of Fútbol
            </Typography>
          </Box> */}

          <Stack direction="row" gap={3}>
            <MuiLink component={Link} to="/" color="text.secondary" underline="hover">
              Home
            </MuiLink>
            <MuiLink component={Link} to="/tournaments" color="text.secondary" underline="hover">
              Tournaments
            </MuiLink>
            <MuiLink component={Link} to="/community" color="text.secondary" underline="hover">
              Community
            </MuiLink>
            <MuiLink component={Link} to="/become-a-captain" color="text.secondary" underline="hover">
              Become a Captain
            </MuiLink>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Minneapolis, MN · Twin Cities Fútbol
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.disabled" sx={{ mt: 4, textAlign: 'center' }}>
          © {new Date().getFullYear()} House of Fútbol. All rights reserved.
        </Typography>
      </Container>
    </Box>
  )
}
