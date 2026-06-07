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
import type { Tournament, TournamentFormat, TournamentMode, GoodToKnowItem, FaqItem } from '../../types'
import { useTournaments } from '../../context/TournamentsContext'
import { GTK_ICONS, GTK_ICON_OPTIONS } from '../../utils/gtkIcons'

const EMPTY_FORM = {
  name: '',
  description: '',
  format: 'bracket' as TournamentFormat,
  mode: 'singles' as TournamentMode,
  max_players: 16,
  location: '',
  time: '',
}

const EMPTY_DRAFT_GTK = { icon: 'check', text: '' }
const EMPTY_DRAFT_FAQ = { q: '', a: '' }

interface Props {
  editingTournament?: Tournament | null
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

export default function TournamentForm({ editingTournament, onCancelEdit }: Props) {
  const { addTournament, updateTournament } = useTournaments()
  const [form, setForm] = useState(EMPTY_FORM)
  const [date, setDate] = useState<Dayjs | null>(null)
  const [goodToKnow, setGoodToKnow] = useState<GoodToKnowItem[]>([])
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [draftGTK, setDraftGTK] = useState(EMPTY_DRAFT_GTK)
  const [draftFAQ, setDraftFAQ] = useState(EMPTY_DRAFT_FAQ)
  const [success, setSuccess] = useState(false)

  const isEditing = editingTournament != null

  useEffect(() => {
    if (editingTournament) {
      setForm({
        name: editingTournament.name,
        description: editingTournament.description ?? '',
        format: editingTournament.format,
        mode: editingTournament.mode,
        max_players: editingTournament.max_players,
        location: editingTournament.location ?? '',
        time: editingTournament.time ?? '',
      })
      setDate(dayjs(editingTournament.date))
      setGoodToKnow(editingTournament.good_to_know ?? [])
      setFaqs(editingTournament.faqs ?? [])
    } else {
      setForm(EMPTY_FORM)
      setDate(null)
      setGoodToKnow([])
      setFaqs([])
    }
    setDraftGTK(EMPTY_DRAFT_GTK)
    setDraftFAQ(EMPTY_DRAFT_FAQ)
  }, [editingTournament])

  function handleChange<K extends keyof typeof EMPTY_FORM>(field: K, value: (typeof EMPTY_FORM)[K]) {
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

  const isValid = form.name.trim() !== '' && date !== null && date.isValid() && form.max_players > 0

  async function handleSubmit() {
    if (!isValid) return
    const payload: Omit<Tournament, 'id' | 'created_at' | 'status'> = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      format: form.format,
      mode: form.mode,
      max_players: form.max_players,
      date: date!.format('YYYY-MM-DD'),
      time: form.time.trim() || null,
      location: form.location.trim() || null,
      good_to_know: goodToKnow,
      faqs,
    }
    if (isEditing) {
      await updateTournament(editingTournament.id, { ...payload, status: editingTournament.status })
      onCancelEdit?.()
    } else {
      await addTournament({ ...payload, status: 'upcoming' })
      setForm(EMPTY_FORM)
      setDate(null)
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
    setGoodToKnow([])
    setFaqs([])
    setDraftGTK(EMPTY_DRAFT_GTK)
    setDraftFAQ(EMPTY_DRAFT_FAQ)
    onCancelEdit?.()
  }

  return (
    <Box>
      <Typography variant="h5" mb={3}>
        {isEditing ? 'Edit Tournament' : 'Create New Tournament'}
      </Typography>

      <Stack gap={3}>
        {/* Tournament Info */}
        <SectionLabel>Tournament Info</SectionLabel>

        <TextField
          label="Tournament Name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          fullWidth
          helperText="Appears as the main headline on the tournament page"
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} gap={3}>
          <DatePicker
            label="Date"
            value={date}
            onChange={(val) => setDate(val)}
            slotProps={{ textField: { fullWidth: true } }}
          />

          <TextField
            label="Time"
            value={form.time}
            onChange={(e) => handleChange('time', e.target.value)}
            fullWidth
            placeholder="e.g. 6:00 PM"
            helperText="Shown in Overview and sidebar"
          />
        </Stack>

        <TextField
          label="Max Players"
          type="number"
          value={form.max_players}
          onChange={(e) => handleChange('max_players', Math.max(2, parseInt(e.target.value) || 2))}
          fullWidth
          slotProps={{ htmlInput: { min: 2, max: 64 } }}
          helperText="Capacity shown in the Overview section"
        />

        {/* Format & Mode */}
        <SectionLabel>Format & Mode</SectionLabel>

        <Stack direction={{ xs: 'column', sm: 'row' }} gap={3}>
          <FormControl fullWidth>
            <InputLabel>Format</InputLabel>
            <Select
              value={form.format}
              label="Format"
              onChange={(e) => handleChange('format', e.target.value as TournamentFormat)}
            >
              <MenuItem value="bracket">Single Elimination (Bracket)</MenuItem>
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

        {/* Location */}
        <SectionLabel>Location</SectionLabel>

        <TextField
          label="Venue / Address"
          value={form.location}
          onChange={(e) => handleChange('location', e.target.value)}
          fullWidth
          placeholder="e.g. House of Fútbol HQ, Minneapolis, MN"
          helperText="Drives the map embed on the tournament page — be as specific as possible"
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
          placeholder="Tell players what to expect — format details, what's at stake, who it's for. This is the main 'About this tournament' section."
          helperText="Appears in the 'About this tournament' section"
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
            placeholder="e.g. How do I register?"
          />
          <TextField
            label="Answer"
            value={draftFAQ.a}
            onChange={(e) => setDraftFAQ((prev) => ({ ...prev, a: e.target.value }))}
            multiline
            rows={3}
            fullWidth
            placeholder="e.g. Click Register Now in the sidebar — spots are limited so sign up early."
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
