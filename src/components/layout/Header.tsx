import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Tournaments', path: '/tournaments' },
  { label: 'Community', path: '/community' },
]

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          <Box
            component={Link}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', flexGrow: 1 }}
          >
            <SportsSoccerIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{ color: 'white', fontFamily: 'Montserrat', fontWeight: 900, letterSpacing: '0.02em' }}
            >
              House of Fútbol
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton onClick={() => setDrawerOpen(true)} color="inherit">
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: location.pathname === link.path ? 'primary.main' : 'text.secondary',
                    '&:hover': { color: 'white' },
                  }}
                >
                  {link.label}
                </Button>
              ))}
              <Button
                component={Link}
                to={isAuthenticated ? '/admin' : '/admin/login'}
                sx={{
                  color: location.pathname.startsWith('/admin') ? 'primary.main' : 'text.secondary',
                  '&:hover': { color: 'white' },
                }}
              >
                Admin
              </Button>
              <Button
                component={Link}
                to="/auth"
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
              >
                Sign In
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240, pt: 2 }}>
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={link.path}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to={isAuthenticated ? '/admin' : '/admin/login'}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary="Admin" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/auth" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="Sign In" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  )
}
