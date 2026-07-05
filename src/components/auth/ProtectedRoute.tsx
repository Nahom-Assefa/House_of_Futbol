import { Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import type { ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin, isCaptain, loading } = useAuth()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  if (!isAdmin && !isCaptain) return <Navigate to="/admin/login" replace />

  return <>{children}</>
}
