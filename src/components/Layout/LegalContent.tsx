import { Fragment, type ReactNode } from 'react'

/**
 * Content block for a legal/info page. Stored in the `legal` i18n namespace
 * so the whole document can be translated as structured data rather than
 * hundreds of micro-keys.
 *
 * `text` / `items` support a tiny inline markup:
 *   - [label](href)  → link ( target=_blank added automatically for http(s) )
 *   - **bold**       → <strong>
 *   - \n             → <br/>
 */
export interface LegalBlock {
  type: 'p' | 'h2' | 'h3' | 'ul'
  text?: string
  items?: string[]
}

// Split on **bold** and \n; links are handled one level up in renderInline.
function renderBoldAndBreaks(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = []
  // Handle line breaks first, then bold within each line
  text.split('\n').forEach((line, lineIdx, lines) => {
    const boldRe = /\*\*([^*]+)\*\*/g
    let last = 0
    let m: RegExpExecArray | null
    let i = 0
    while ((m = boldRe.exec(line)) !== null) {
      if (m.index > last) out.push(line.slice(last, m.index))
      out.push(<strong key={`${keyPrefix}-b${lineIdx}-${i++}`}>{m[1]}</strong>)
      last = boldRe.lastIndex
    }
    if (last < line.length) out.push(line.slice(last))
    if (lineIdx < lines.length - 1) out.push(<br key={`${keyPrefix}-br${lineIdx}`} />)
  })
  return out
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = linkRe.exec(text)) !== null) {
    if (m.index > last) nodes.push(...renderBoldAndBreaks(text.slice(last, m.index), `${keyPrefix}-${i}`))
    const label = m[1]
    const href = m[2]
    const external = /^https?:\/\//.test(href)
    nodes.push(
      <a
        key={`${keyPrefix}-a${i++}`}
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {label}
      </a>
    )
    last = linkRe.lastIndex
  }
  if (last < text.length) nodes.push(...renderBoldAndBreaks(text.slice(last), `${keyPrefix}-${i}`))
  return nodes
}

export default function LegalContent({ blocks }: { blocks: LegalBlock[] }) {
  if (!Array.isArray(blocks)) return null
  return (
    <>
      {blocks.map((block, idx) => {
        const key = `blk-${idx}`
        switch (block.type) {
          case 'h2':
            return <h2 key={key}>{renderInline(block.text ?? '', key)}</h2>
          case 'h3':
            return <h3 key={key}>{renderInline(block.text ?? '', key)}</h3>
          case 'ul':
            return (
              <ul key={key}>
                {(block.items ?? []).map((item, i) => (
                  <li key={`${key}-li${i}`}>{renderInline(item, `${key}-li${i}`)}</li>
                ))}
              </ul>
            )
          case 'p':
          default:
            return <p key={key}>{renderInline(block.text ?? '', key)}</p>
        }
      })}
      <Fragment />
    </>
  )
}
