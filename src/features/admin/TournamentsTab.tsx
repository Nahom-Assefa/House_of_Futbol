import { useState } from 'react'
import {
  Box, Paper, Typography, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Tooltip, Stack,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import TournamentForm from './TournamentForm'
import { useTournaments } from '../../context/TournamentsContext'
import type { Tournament, TournamentFormat, TournamentStatus } from '../../types'

const FORMAT_LABEL: Record<TournamentFormat, string> = {
  'single-elimination': 'Single Elimination',
  'double-elimination': 'Double Elimination',
  'round-robin': 'Round Robin',
  'group-stage': 'Group Stage',
}

const FORMAT_COLOR: Record<TournamentFormat, 'warning' | 'info' | 'success'> = {
  'single-elimination': 'warning',
  'double-elimination': 'warning',
  'round-robin': 'info',
  'group-stage': 'success',
}

const STATUS_COLOR: Record<TournamentStatus, 'success' | 'warning' | 'default'> = {
  upcoming: 'success',
  active: 'warning',
  completed: 'default',
}

export default function TournamentsTab() {
  const { tournaments, deleteTournament } = useTournaments()
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null)

  return (
    <Box>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, mb: 5 }}>
        <TournamentForm
          editingTournament={editingTournament}
          onCancelEdit={() => setEditingTournament(null)}
        />
      </Paper>

      <Divider sx={{ mb: 4, borderColor: 'rgba(255,255,255,0.06)' }} />

      <Typography variant="h5" mb={3}>All Tournaments ({tournaments.length})</Typography>

      {tournaments.length === 0 ? (
        <Typography color="text.secondary">No tournaments yet. Create one above.</Typography>
      ) : (
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Format</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Players</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tournaments.map((t) => (
                <TableRow
                  key={t.id}
                  selected={editingTournament?.id === t.id}
                  sx={{
                    '&:last-child td': { border: 0 },
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
                    '&.Mui-selected': { bgcolor: 'rgba(76,175,80,0.08)' },
                    '&.Mui-selected:hover': { bgcolor: 'rgba(76,175,80,0.12)' },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{t.name}</Typography>
                    {t.description && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {t.description.length > 55 ? `${t.description.slice(0, 55)}…` : t.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip label={FORMAT_LABEL[t.format]} color={FORMAT_COLOR[t.format]} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t.mode === 'singles' ? 'Singles' : 'Doubles'}
                      size="small"
                      color={t.mode === 'singles' ? 'error' : undefined}
                      sx={t.mode === 'doubles' ? { bgcolor: '#AD1457', color: 'white' } : undefined}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(t.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago' })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{t.max_players}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t.status}
                      color={STATUS_COLOR[t.status]}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" gap={0.5} justifyContent="flex-end">
                      <Tooltip title="Edit tournament">
                        <IconButton size="small" color="primary" onClick={() => setEditingTournament(t)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete tournament">
                        <IconButton size="small" color="error" onClick={() => {
                          if (editingTournament?.id === t.id) setEditingTournament(null)
                          deleteTournament(t.id)
                        }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
