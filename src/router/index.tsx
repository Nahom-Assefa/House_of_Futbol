import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import HomeView from '../features/home/HomeView'
import TournamentsList from '../features/tournaments/TournamentsList'
import TournamentDetailView from '../features/tournaments/TournamentDetailView'
import TournamentRegistrationForm from '../features/tournaments/TournamentRegistrationForm'
import CommunityEvents from '../features/community/CommunityEvents'
import EventDetailView from '../features/community/EventDetailView'
import EventRsvpForm from '../features/community/EventRsvpForm'
import AuthForm from '../features/auth/AuthForm'
import AdminLoginForm from '../features/auth/AdminLoginForm'
import SetPassword from '../features/auth/SetPassword'
import CaptainApplicationForm from '../features/captain/CaptainApplicationForm'
import AdminDashboard from '../features/admin/AdminDashboard'
import ProtectedRoute from '../components/auth/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomeView /> },
      { path: 'tournaments', element: <TournamentsList /> },
      { path: 'tournaments/:id', element: <TournamentDetailView /> },
      { path: 'tournaments/:id/register', element: <TournamentRegistrationForm /> },
      { path: 'community', element: <CommunityEvents /> },
      { path: 'community/:id', element: <EventDetailView /> },
      { path: 'community/:id/rsvp', element: <EventRsvpForm /> },
      { path: 'auth', element: <AuthForm /> },
      { path: 'become-a-captain', element: <CaptainApplicationForm /> },
      { path: 'admin/login', element: <AdminLoginForm /> },
      { path: 'set-password', element: <SetPassword /> },
      {
        path: 'admin',
        element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>,
      },
    ],
  },
])
