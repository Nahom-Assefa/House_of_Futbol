import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { theme } from './theme/theme'
import { router } from './router'
import { EventsProvider } from './context/EventsContext'
import { TournamentsProvider } from './context/TournamentsContext'
import { AuthProvider } from './context/AuthContext'
import { RsvpProvider } from './context/RsvpContext'
import { RegistrationProvider } from './context/RegistrationContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <AuthProvider>
          <EventsProvider>
            <TournamentsProvider>
              <RsvpProvider>
                <RegistrationProvider>
                  <RouterProvider router={router} />
                </RegistrationProvider>
              </RsvpProvider>
            </TournamentsProvider>
          </EventsProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
