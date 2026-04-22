import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

const INK = '#1e1a15'
const PAPER = '#f3ede1'
const PAPER_FAINT = '#857c6c'
const ACCENT = '#3d6bc7'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: INK,
          color: PAPER,
          display: 'flex',
          flexDirection: 'column',
          padding: 20,
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'monospace',
            fontSize: 11,
            letterSpacing: '0.28em',
            color: PAPER_FAINT,
            textTransform: 'uppercase',
          }}
        >
          <span>MD</span>
          <span
            style={{
              width: 6,
              height: 6,
              background: ACCENT,
              borderRadius: 999,
            }}
          />
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 4,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              lineHeight: 1,
              fontWeight: 800,
              fontSize: 108,
              letterSpacing: '-0.06em',
            }}
          >
            <span>M</span>
            <span
              style={{
                color: ACCENT,
                fontFamily: 'serif',
                fontStyle: 'italic',
                fontWeight: 500,
                margin: '0 -4px',
              }}
            >
              /
            </span>
            <span>D</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'monospace',
            fontSize: 11,
            letterSpacing: '0.22em',
            color: PAPER_FAINT,
            textTransform: 'uppercase',
            borderTop: `1px solid ${ACCENT}`,
            paddingTop: 6,
          }}
        >
          <span>MANUEL.FYI</span>
          <span>2026</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
