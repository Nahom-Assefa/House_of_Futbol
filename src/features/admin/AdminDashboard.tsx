import { useState } from 'react'
import {
  Box, Container, Typography, Stack,
  Tabs, Tab, Button,
} from '@mui/material'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import EventsTab from './EventsTab'
import TournamentsTab from './TournamentsTab'
import UsersTab from './UsersTab'

export default function AdminDashboard() {
  const [tab, setTab] = useState(0)
  const { logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" gap={2} mb={4}>
          <AdminPanelSettingsIcon sx={{ color: 'secondary.main', fontSize: 36 }} />
          <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' }, flex: 1 }}>
            Admin Portal
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ color: 'text.secondary', borderColor: 'rgba(255,255,255,0.12)' }}
          >
            Sign Out
          </Button>
        </Stack>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ mb: 5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <Tab label="Events" />
          <Tab label="Tournaments" />
          <Tab label="Users" />
        </Tabs>

        {tab === 0 && <EventsTab />}
        {tab === 1 && <TournamentsTab />}
        {tab === 2 && <UsersTab />}
      </Container>
    </Box>
  )
}
