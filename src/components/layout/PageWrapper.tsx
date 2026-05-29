import { Box, Container } from '@mui/material'
import type { ReactNode } from 'react'

interface PageWrapperProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  disableContainer?: boolean
}

export default function PageWrapper({ children, maxWidth = 'lg', disableContainer = false }: PageWrapperProps) {
  if (disableContainer) {
    return <Box sx={{ minHeight: '100vh' }}>{children}</Box>
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container maxWidth={maxWidth}>{children}</Container>
    </Box>
  )
}
