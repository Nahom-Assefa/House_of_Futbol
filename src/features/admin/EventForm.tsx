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
import type { EventType, ClubEvent } from '../../types'
import { useEvents } from '../../context/EventsContext'

const EVENT_TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: 'gaming',      label: 'Gaming' },
  { value: 'watch_party', label: 'Watch Party' },
  { value: 'community',   label: 'Community' },
  { value: 'pick_up',     label: 'Pick-Up'},
  { value: 'other',       label: 'Other' },
]

const EMPTY_FORM = {
  title: '',
  description: '',
  event_type: 'gaming' as EventType,
  location: '',
}

interface Props {
  editingEvent?: ClubEvent | null
  onCancelEdit?: () => void
}

export default function EventForm({ editingEvent, onCancelEdit }: Props) {
  const { addEvent, updateEvent } = useEvents()
  const [form, setForm] = useState(EMPTY_FORM)
  const [date, setDate] = useState<Dayjs | null>(null)
  const [success, setSuccess] = useState(false)

  const isEditing = editingEvent != null

  useEffect(() => {
    if (editingEvent) {
      setForm({
        title: editingEvent.title,
        description: editingEvent.description ?? '',
        event_type: editingEvent.event_type,
        location: editingEvent.location ?? '',
      })
      setDate(dayjs(editingEvent.date))
    } else {
      setForm(EMPTY_FORM)
      setDate(null)
    }
  }, [editingEvent])

  function handleChange(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const isValid = form.title.trim() !== '' && date !== null && date.isValid()

  function handleSubmit() {
    if (!isValid) return
    const payload: Omit<ClubEvent, 'id' | 'created_at'> = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      event_type: form.event_type,
      date: date!.format('YYYY-MM-DD'),
      location: form.location.trim() || null,
    }
    if (isEditing) {
      updateEvent(editingEvent.id, payload)
      onCancelEdit?.()
    } else {
      addEvent(payload)
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
        {isEditing ? 'Edit Event' : 'Create New Event'}
      </Typography>

      <Stack gap={3}>
        <TextField
          label="Title"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          fullWidth
        />

        <TextField
          label="Description"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          multiline
          rows={3}
          fullWidth
          placeholder="Optional — give people the details"
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} gap={3}>
          <FormControl fullWidth>
            <InputLabel>Event Type</InputLabel>
            <Select
              value={form.event_type}
              label="Event Type"
              onChange={(e) => handleChange('event_type', e.target.value)}
            >
              {EVENT_TYPE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DatePicker
            label="Date"
            value={date}
            onChange={(val) => setDate(val)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Stack>

        <TextField
          label="Location"
          value={form.location}
          onChange={(e) => handleChange('location', e.target.value)}
          fullWidth
          placeholder="Optional — address or venue name"
        />

        <Stack direction="row" gap={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={isEditing ? <EditIcon /> : <AddIcon />}
            disabled={!isValid}
            onClick={handleSubmit}
          >
            {isEditing ? 'Update Event' : 'Add Event'}
          </Button>
          {isEditing && (
            <Button variant="outlined" color="inherit" size="large" onClick={handleCancel}
              sx={{ borderColor: 'rgba(255,255,255,0.2)' }}>
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
          Event added successfully
        </Alert>
      </Snackbar>
    </Box>
  )
}
