interface MonochromeOverlayProps {
  reduced?: boolean
  opacity?: number
}

export default function MonochromeOverlay({ reduced = false, opacity = 1 }: MonochromeOverlayProps) {
  if (opacity === 0) return null
  return (
    <div
      className={`monochrome-overlay ${reduced ? 'reduced' : ''}`}
      aria-hidden="true"
      style={{ opacity }}
    />
  )
}
