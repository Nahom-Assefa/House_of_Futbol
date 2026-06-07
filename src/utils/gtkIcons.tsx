import AccessTimeIcon from '@mui/icons-material/AccessTime'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects'
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'
import GroupsIcon from '@mui/icons-material/Groups'
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

interface GtkIconDef {
  node: React.ReactNode
  label: string
}

export const GTK_ICONS: Record<string, GtkIconDef> = {
  check:      { node: <CheckCircleOutlineIcon sx={{ fontSize: 20, color: 'success.main',   flexShrink: 0 }} />, label: 'Checkmark' },
  clock:      { node: <AccessTimeIcon         sx={{ fontSize: 20, color: 'info.main',      flexShrink: 0 }} />, label: 'Clock / Time' },
  controller: { node: <SportsEsportsIcon      sx={{ fontSize: 20, color: 'success.main',   flexShrink: 0 }} />, label: 'Controller / Gaming' },
  idea:       { node: <EmojiObjectsIcon       sx={{ fontSize: 20, color: 'warning.main',   flexShrink: 0 }} />, label: 'Idea / Tip' },
  trophy:     { node: <MilitaryTechIcon       sx={{ fontSize: 20, color: 'secondary.main', flexShrink: 0 }} />, label: 'Trophy / Prize' },
  people:     { node: <GroupsIcon             sx={{ fontSize: 20, color: 'info.main',      flexShrink: 0 }} />, label: 'People / Community' },
  heart:      { node: <VolunteerActivismIcon  sx={{ fontSize: 20, color: 'error.main',     flexShrink: 0 }} />, label: 'Heart / Community' },
  location:   { node: <LocationOnIcon         sx={{ fontSize: 20, color: 'error.main',     flexShrink: 0 }} />, label: 'Location / Venue' },
  soccer:     { node: <SportsSoccerIcon       sx={{ fontSize: 20, color: 'primary.main',   flexShrink: 0 }} />, label: 'Soccer / Sport' },
  info:       { node: <InfoOutlinedIcon       sx={{ fontSize: 20, color: 'primary.main',   flexShrink: 0 }} />, label: 'Info / Note' },
}

export const GTK_ICON_OPTIONS = Object.entries(GTK_ICONS).map(([value, { label }]) => ({ value, label }))
