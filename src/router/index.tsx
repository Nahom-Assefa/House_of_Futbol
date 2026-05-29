import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import HomeView from '../features/home/HomeView'
import TournamentsList from '../features/tournaments/TournamentsList'
import TournamentDetailView from '../features/tournaments/TournamentDetailView'
import CommunityEvents from '../features/community/CommunityEvents'
import EventDetailView from '../features/community/EventDetailView'
import AuthForm from '../features/auth/AuthForm'
import AdminLoginForm from '../features/auth/AdminLoginForm'
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
      { path: 'community', element: <CommunityEvents /> },
      { path: 'community/:id', element: <EventDetailView /> },
      { path: 'auth', element: <AuthForm /> },
      { path: 'admin/login', element: <AdminLoginForm /> },
      {
        path: 'admin',
        element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>,
      },
    ],
  },
])
