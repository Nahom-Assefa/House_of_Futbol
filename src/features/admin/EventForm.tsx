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
  Divider,
  IconButton,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import type { EventType, ClubEvent, GoodToKnowItem, FaqItem } from '../../types'
import { useEvents } from '../../context/EventsContext'
import { GTK_ICONS, GTK_ICON_OPTIONS } from '../../utils/gtkIcons'

const EVENT_TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: 'gaming',      label: 'Gaming' },
  { value: 'watch_party', label: 'Watch Party' },
  { value: 'community',   label: 'Community' },
  { value: 'pick_up',     label: 'Pick-Up' },
  { value: 'other',       label: 'Other' },
]

const EMPTY_FORM = {
  title: '',
  description: '',
  event_type: 'gaming' as EventType,
  location: '',
  time: '',
}

const EMPTY_DRAFT_GTK = { icon: 'check', text: '' }
const EMPTY_DRAFT_FAQ = { q: '', a: '' }

interface Props {
  editingEvent?: ClubEvent | null
  onCancelEdit?: () => void
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1.2, fontSize: '0.7rem' }}>
        {children}
      </Typography>
      <Divider sx={{ mt: 0.5 }} />
    </Box>
  )
}

export default function EventForm({ editingEvent, onCancelEdit }: Props) {
  const { addEvent, updateEvent } = useEvents()
  const [form, setForm] = useState(EMPTY_FORM)
  const [date, setDate] = useState<Dayjs | null>(null)
  const [maxAttendees, setMaxAttendees] = useState<number | null>(null)
  const [goodToKnow, setGoodToKnow] = useState<GoodToKnowItem[]>([])
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [draftGTK, setDraftGTK] = useState(EMPTY_DRAFT_GTK)
  const [draftFAQ, setDraftFAQ] = useState(EMPTY_DRAFT_FAQ)
  const [success, setSuccess] = useState(false)

  const isEditing = editingEvent != null

  useEffect(() => {
    if (editingEvent) {
      setForm({
        title: editingEvent.title,
        description: editingEvent.description ?? '',
        event_type: editingEvent.event_type,
        location: editingEvent.location ?? '',
        time: editingEvent.time ?? '',
      })
      setDate(dayjs(editingEvent.date + 'T00:00:00'))
      setMaxAttendees(editingEvent.max_attendees ?? null)
      setGoodToKnow(editingEvent.good_to_know ?? [])
      setFaqs(editingEvent.faqs ?? [])
    } else {
      setForm(EMPTY_FORM)
      setDate(null)
      setMaxAttendees(null)
      setGoodToKnow([])
      setFaqs([])
    }
    setDraftGTK(EMPTY_DRAFT_GTK)
    setDraftFAQ(EMPTY_DRAFT_FAQ)
  }, [editingEvent])

  function handleChange(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function addGTK() {
    if (!draftGTK.text.trim()) return
    setGoodToKnow((prev) => [...prev, { icon: draftGTK.icon, text: draftGTK.text.trim() }])
    setDraftGTK((prev) => ({ ...prev, text: '' }))
  }

  function removeGTK(idx: number) {
    setGoodToKnow((prev) => prev.filter((_, i) => i !== idx))
  }

  function addFAQ() {
    if (!draftFAQ.q.trim() || !draftFAQ.a.trim()) return
    setFaqs((prev) => [...prev, { q: draftFAQ.q.trim(), a: draftFAQ.a.trim() }])
    setDraftFAQ(EMPTY_DRAFT_FAQ)
  }

  function removeFAQ(idx: number) {
    setFaqs((prev) => prev.filter((_, i) => i !== idx))
  }

  const isValid = form.title.trim() !== '' && date !== null && date.isValid()

  async function handleSubmit() {
    if (!isValid) return
    const payload: Omit<ClubEvent, 'id' | 'created_at'> = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      event_type: form.event_type,
      date: date!.format('YYYY-MM-DD'),
      time: form.time.trim() || null,
      location: form.location.trim() || null,
      max_attendees: maxAttendees,
      good_to_know: goodToKnow,
      faqs,
    }
    if (isEditing) {
      await updateEvent(editingEvent.id, payload)
      onCancelEdit?.()
    } else {
      await addEvent(payload)
      setForm(EMPTY_FORM)
      setDate(null)
      setMaxAttendees(null)
      setGoodToKnow([])
      setFaqs([])
      setDraftGTK(EMPTY_DRAFT_GTK)
      setDraftFAQ(EMPTY_DRAFT_FAQ)
      setSuccess(true)
    }
  }

  function handleCancel() {
    setForm(EMPTY_FORM)
    setDate(null)
    setMaxAttendees(null)
    setGoodToKnow([])
    setFaqs([])
    setDraftGTK(EMPTY_DRAFT_GTK)
    setDraftFAQ(EMPTY_DRAFT_FAQ)
    onCancelEdit?.()
  }

  return (
    <Box>
      <Typography variant="h5" mb={3}>
        {isEditing ? 'Edit Event' : 'Create New Event'}
      </Typography>

      <Stack gap={3}>
        {/* Event Info */}
        <SectionLabel>Event Info</SectionLabel>

        <TextField
          label="Event Title"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          fullWidth
          helperText="Appears as the main headline on the event page"
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
          label="Time"
          value={form.time}
          onChange={(e) => handleChange('time', e.target.value)}
          fullWidth
          placeholder="e.g. 7:00 PM or 6:00 PM – 9:00 PM"
          helperText="Shown in the Overview and sidebar on the event page"
        />

        <TextField
          label="Max Attendees"
          type="number"
          value={maxAttendees ?? ''}
          onChange={(e) => {
            const val = e.target.value
            setMaxAttendees(val === '' ? null : Math.max(1, parseInt(val) || 1))
          }}
          fullWidth
          placeholder="Leave blank for no limit"
          slotProps={{ htmlInput: { min: 1 } }}
          helperText="Shown publicly — users will see a capacity error when the event fills up"
        />

        {/* Location */}
        <SectionLabel>Location</SectionLabel>

        <TextField
          label="Venue / Address"
          value={form.location}
          onChange={(e) => handleChange('location', e.target.value)}
          fullWidth
          placeholder="e.g. House of Fútbol HQ, Minneapolis, MN"
          helperText="Drives the map embed on the event page — be as specific as possible"
        />

        {/* Content */}
        <SectionLabel>Content</SectionLabel>

        <TextField
          label="Description"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          multiline
          rows={6}
          fullWidth
          placeholder="Tell people what to expect. This is the main 'About this event' section on the event page."
          helperText="Appears in the 'About this event' section"
        />

        {/* Good to Know */}
        <SectionLabel>Good to Know</SectionLabel>

        {goodToKnow.length > 0 && (
          <Stack gap={1}>
            {goodToKnow.map((item, idx) => (
              <Box
                key={idx}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: 'action.hover', borderRadius: 1.5 }}
              >
                {GTK_ICONS[item.icon]?.node}
                <Typography variant="body2" sx={{ flex: 1, lineHeight: 1.6 }}>{item.text}</Typography>
                <IconButton size="small" color="error" onClick={() => removeGTK(idx)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems="flex-start">
          <FormControl sx={{ minWidth: 190, flexShrink: 0 }}>
            <InputLabel>Icon</InputLabel>
            <Select
              value={draftGTK.icon}
              label="Icon"
              onChange={(e) => setDraftGTK((prev) => ({ ...prev, icon: e.target.value }))}
            >
              {GTK_ICON_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    {GTK_ICONS[opt.value].node}
                    {opt.label}
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Good to Know item"
            value={draftGTK.text}
            onChange={(e) => setDraftGTK((prev) => ({ ...prev, text: e.target.value }))}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addGTK() } }}
            fullWidth
            placeholder="e.g. Arrive 15 minutes early to check in"
          />
          <Button
            variant="outlined"
            onClick={addGTK}
            disabled={!draftGTK.text.trim()}
            sx={{ flexShrink: 0, height: 56 }}
          >
            Add
          </Button>
        </Stack>

        {/* FAQ */}
        <SectionLabel>Frequently Asked Questions</SectionLabel>

        {faqs.length > 0 && (
          <Stack gap={1}>
            {faqs.map((faq, idx) => (
              <Box
                key={idx}
                sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 1.5, bgcolor: 'action.hover', borderRadius: 1.5 }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 0.25 }}>{faq.q}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, display: 'block' }}>{faq.a}</Typography>
                </Box>
                <IconButton size="small" color="error" onClick={() => removeFAQ(idx)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        )}

        <Stack gap={2}>
          <TextField
            label="Question"
            value={draftFAQ.q}
            onChange={(e) => setDraftFAQ((prev) => ({ ...prev, q: e.target.value }))}
            fullWidth
            placeholder="e.g. Is this event free?"
          />
          <TextField
            label="Answer"
            value={draftFAQ.a}
            onChange={(e) => setDraftFAQ((prev) => ({ ...prev, a: e.target.value }))}
            multiline
            rows={3}
            fullWidth
            placeholder="e.g. Yes — all House of Fútbol events are free to attend."
          />
          <Box>
            <Button
              variant="outlined"
              onClick={addFAQ}
              disabled={!draftFAQ.q.trim() || !draftFAQ.a.trim()}
              startIcon={<AddIcon />}
            >
              Add FAQ
            </Button>
          </Box>
        </Stack>

        {/* Actions */}
        <Stack direction="row" gap={2} pt={1}>
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
