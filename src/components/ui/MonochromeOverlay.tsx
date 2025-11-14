interface MonochromeOverlayProps {
  reduced?: boolean
}

export default function MonochromeOverlay({ reduced = false }: MonochromeOverlayProps) {
  return <div className={`monochrome-overlay ${reduced ? 'reduced' : ''}`} aria-hidden="true" />
}
