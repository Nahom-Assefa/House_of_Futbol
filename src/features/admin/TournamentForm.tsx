import { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import type { Tournament, TournamentFormat, TournamentMode, TournamentStatus } from '../../types'
import { useTournaments } from '../../context/TournamentsContext'

const EMPTY_FORM = {
  name: '',
  description: '',
  format: 'bracket' as TournamentFormat,
  mode: 'singles' as TournamentMode,
  status: 'upcoming' as TournamentStatus,
  max_players: 16,
}

interface Props {
  editingTournament?: Tournament | null
  onCancelEdit?: () => void
}

export default function TournamentForm({ editingTournament, onCancelEdit }: Props) {
  const { addTournament, updateTournament } = useTournaments()
  const [form, setForm] = useState(EMPTY_FORM)
  const [date, setDate] = useState<Dayjs | null>(null)
  const [success, setSuccess] = useState(false)

  const isEditing = editingTournament != null

  useEffect(() => {
    if (editingTournament) {
      setForm({
        name: editingTournament.name,
        description: editingTournament.description ?? '',
        format: editingTournament.format,
        mode: editingTournament.mode,
        status: editingTournament.status,
        max_players: editingTournament.max_players,
      })
      setDate(dayjs(editingTournament.date))
    } else {
      setForm(EMPTY_FORM)
      setDate(null)
    }
  }, [editingTournament])

  function handleChange<K extends keyof typeof EMPTY_FORM>(field: K, value: (typeof EMPTY_FORM)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const isValid = form.name.trim() !== '' && date !== null && date.isValid() && form.max_players > 0

  function handleSubmit() {
    if (!isValid) return
    const payload: Omit<Tournament, 'id' | 'created_at'> = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      format: form.format,
      mode: form.mode,
      status: form.status,
      max_players: form.max_players,
      date: date!.format('YYYY-MM-DD'),
    }
    if (isEditing) {
      updateTournament(editingTournament.id, payload)
      onCancelEdit?.()
    } else {
      addTournament(payload)
      setForm(EMPTY_FORM)
      setDate(null)
      setSuccess(true)
    }
  }

  function handleCancel() {
    setForm(EMPTY_FORM)
    setDate(null)
    onCancelEdit?.()
  }

  return (
    <Box>
      <Typography variant="h5" mb={3}>
        {isEditing ? 'Edit Tournament' : 'Create New Tournament'}
      </Typography>

      <Stack gap={3}>
        <TextField
          label="Tournament Name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          fullWidth
        />

        <TextField
          label="Description"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          multiline
          rows={3}
          fullWidth
          placeholder="Optional — tell players what to expect"
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} gap={3}>
          <FormControl fullWidth>
            <InputLabel>Format</InputLabel>
            <Select
              value={form.format}
              label="Format"
              onChange={(e) => handleChange('format', e.target.value as TournamentFormat)}
            >
              <MenuItem value="bracket">Bracket (Single Elimination)</MenuItem>
              <MenuItem value="round-robin">Round Robin</MenuItem>
              <MenuItem value="group-stage">Group Stage</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Mode</InputLabel>
            <Select
              value={form.mode}
              label="Mode"
              onChange={(e) => handleChange('mode', e.target.value as TournamentMode)}
            >
              <MenuItem value="singles">Singles (1v1)</MenuItem>
              <MenuItem value="doubles">Doubles (2v2)</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} gap={3}>
          <DatePicker
            label="Date"
            value={date}
            onChange={(val) => setDate(val)}
            slotProps={{ textField: { fullWidth: true } }}
          />

          <TextField
            label="Max Players"
            type="number"
            value={form.max_players}
            onChange={(e) => handleChange('max_players', Math.max(2, parseInt(e.target.value) || 2))}
            fullWidth
            inputProps={{ min: 2, max: 64 }}
          />
        </Stack>

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={form.status}
            label="Status"
            onChange={(e) => handleChange('status', e.target.value as TournamentStatus)}
          >
            <MenuItem value="upcoming">Upcoming</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <Stack direction="row" gap={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={isEditing ? <EditIcon /> : <AddIcon />}
            disabled={!isValid}
            onClick={handleSubmit}
          >
            {isEditing ? 'Update Tournament' : 'Add Tournament'}
          </Button>
          {isEditing && (
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={handleCancel}
              sx={{ borderColor: 'rgba(255,255,255,0.2)' }}
            >
              Cancel
            </Button>
          )}
        </Stack>
      </Stack>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Tournament added successfully
        </Alert>
      </Snackbar>
    </Box>
  )
}
