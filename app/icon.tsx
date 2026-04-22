import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

const INK = '#1e1a15'
const PAPER = '#f3ede1'
const ACCENT = '#3d6bc7'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: INK,
          color: PAPER,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: '-0.06em',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            lineHeight: 1,
          }}
        >
          <span>M</span>
          <span
            style={{
              color: ACCENT,
              fontFamily: 'serif',
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 22,
              margin: '0 -1px',
              transform: 'translateY(1px)',
            }}
          >
            /
          </span>
          <span>D</span>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 4,
            right: 4,
            bottom: 3,
            height: 1,
            background: ACCENT,
          }}
        />
      </div>
    ),
    { ...size },
  )
}
