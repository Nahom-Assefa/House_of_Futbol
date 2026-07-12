import { useState, useEffect } from 'react'
import {
  Box, Paper, Typography, Stack, Chip, Button, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, ToggleButtonGroup, ToggleButton,
} from '@mui/material'
import { GiPirateCaptain } from 'react-icons/gi'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { supabase } from '../../lib/supabase'
import type { CaptainApplication } from '../../types'

type StatusFilter = 'pending' | 'approved' | 'rejected'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function CaptainsTab() {
  const [applications, setApplications] = useState<CaptainApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<StatusFilter>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  async function fetchApplications() {
    setLoading(true)
    const { data } = await supabase
      .from('captain_applications')
      .select('*')
      .order('created_at', { ascending: false })
    setApplications(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchApplications() }, [])

  async function handleApprove(app: CaptainApplication) {
    setActionLoading(app.id)
    await supabase
      .from('captain_applications')
      .update({ status: 'approved', reviewed_at: new Date().toISOString() })
      .eq('id', app.id)
    await fetchApplications()
    setActionLoading(null)
  }

  async function handleReject(app: CaptainApplication) {
    setActionLoading(app.id)
    await supabase
      .from('captain_applications')
      .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
      .eq('id', app.id)
    await fetchApplications()
    setActionLoading(null)
  }

  const filtered = applications.filter((a) => a.status === filter)
  const pendingCount = applications.filter((a) => a.status === 'pending').length

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={2} mb={4}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <GiPirateCaptain size={22} style={{ color: '#90CAF9' }} />
          <Typography variant="h6" fontWeight={600}>
            Captain Applications
            {pendingCount > 0 && (
              <Chip label={pendingCount} size="small" color="warning" sx={{ ml: 1.5, fontWeight: 700 }} />
            )}
          </Typography>
        </Stack>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, v) => { if (v) setFilter(v) }}
          size="small"
        >
          <ToggleButton value="pending">Pending</ToggleButton>
          <ToggleButton value="approved">Approved</ToggleButton>
          <ToggleButton value="rejected">Rejected</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Divider sx={{ mb: 4, borderColor: 'rgba(255,255,255,0.06)' }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Paper
          elevation={0}
          sx={{ p: { xs: 4, md: 8 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}
        >
          <GiPirateCaptain size={56} style={{ color: 'rgba(255,255,255,0.2)' }} />
          <Typography variant="h6" color="text.secondary">No {filter} applications</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Applied</TableCell>
                {filter === 'pending' && <TableCell align="right">Actions</TableCell>}
                {filter !== 'pending' && <TableCell>Reviewed</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((app) => (
                <TableRow
                  key={app.id}
                  sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{app.display_name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{app.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{app.phone ?? '—'}</Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="body2" color="text.secondary">
                      {app.message.length > 100 ? `${app.message.slice(0, 100)}…` : app.message}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{formatDate(app.created_at)}</Typography>
                  </TableCell>
                  {filter === 'pending' && (
                    <TableCell align="right">
                      <Stack direction="row" gap={1} justifyContent="flex-end">
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          disabled={actionLoading === app.id}
                          onClick={() => handleApprove(app)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<CancelIcon />}
                          disabled={actionLoading === app.id}
                          onClick={() => handleReject(app)}
                        >
                          Reject
                        </Button>
                      </Stack>
                    </TableCell>
                  )}
                  {filter !== 'pending' && (
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {app.reviewed_at ? formatDate(app.reviewed_at) : '—'}
                      </Typography>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
