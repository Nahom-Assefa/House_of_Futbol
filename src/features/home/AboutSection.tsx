import { Box, Container, Grid, Typography, Divider } from '@mui/material'

export default function AboutSection() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.15em', mb: 2, display: 'block' }}
            >
              Our Story
            </Typography>
            <Typography variant="h2" sx={{ mb: 3, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
              Built by the community,
              <br />for the community
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.9 }}>
              House of Futbol was born from a simple idea: African diaspora communities in the Twin Cities
              deserve a space that's truly theirs. A place to play FIFA the way it was meant — with people
              who share the passion, the culture, and the banter.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9 }}>
              We believe in the power of in-person connection. Not just online matches — real moments,
              real competition, real community. Whether you're a FIFA veteran or just vibing, you belong here.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 3,
                p: 4,
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {[
                { stat: 'Minneapolis', label: 'Home base' },
                { stat: 'Twin Cities', label: 'Community reach' },
                { stat: 'FIFA + IRL', label: 'Game mode' },
              ].map((item, i, arr) => (
                <Box key={item.label}>
                  <Box sx={{ py: 2 }}>
                    <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 900 }}>
                      {item.stat}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Box>
                  {i < arr.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />}
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
