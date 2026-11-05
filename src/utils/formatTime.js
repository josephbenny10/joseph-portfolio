/**
 * Formats seconds into MM:SS (e.g. 26.18 -> "00:26").
 * Returns an empty string if duration is unavailable or invalid.
 */
export function formatDuration(seconds) {
  if (typeof seconds !== 'number' || isNaN(seconds) || !isFinite(seconds) || seconds <= 0) {
    return ''
  }
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

