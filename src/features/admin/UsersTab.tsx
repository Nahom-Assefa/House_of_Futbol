import { Typography, Paper } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'

export default function UsersTab() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 4, md: 8 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        textAlign: 'center',
      }}
    >
      <PeopleIcon sx={{ fontSize: 56, color: 'text.disabled' }} />
      <Typography variant="h6" color="text.secondary">Users & RSVPs</Typography>
      <Typography variant="body2" color="text.disabled" sx={{ maxWidth: 380 }}>
        RSVP and registration management is coming soon. Once Supabase auth is wired up,
        you'll be able to see who has registered for tournaments and RSVP'd to events.
      </Typography>
    </Paper>
  )
}
