import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const FONT_SIZE = {
  title: 48,
  subtitle: 32,
  small: 24,
}

const COLORS = {
  background: '#ffffff',
  foreground: '#000000',
  muted: '#64748b',
  accent: '#0070f3',
  border: '#e2e8f0',
}

const LAYOUT = {
  width: 1200,
  height: 630,
  padding: 80,
  logoSize: 40,
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'MVP Template'
    const type = searchParams.get('type') || 'default'
    const theme = searchParams.get('theme') || 'light'

    // Truncate title if too long
    const truncatedTitle =
      title.length > 80 ? title.substring(0, 80) + '...' : title

    const isDark = theme === 'dark'
    const bgColor = isDark ? '#000000' : COLORS.background
    const textColor = isDark ? '#ffffff' : COLORS.foreground
    const mutedColor = isDark ? '#94a3b8' : COLORS.muted

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColor,
            backgroundImage: isDark
              ? 'radial-gradient(circle at 25% 25%, #1e293b 0%, transparent 50%), radial-gradient(circle at 75% 75%, #1e293b 0%, transparent 50%)'
              : 'radial-gradient(circle at 25% 25%, #f1f5f9 0%, transparent 50%), radial-gradient(circle at 75% 75%, #f1f5f9 0%, transparent 50%)',
            padding: LAYOUT.padding,
            position: 'relative',
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.05,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3Ccircle cx='27' cy='7' r='2'/%3E%3Ccircle cx='47' cy='7' r='2'/%3E%3Ccircle cx='7' cy='27' r='2'/%3E%3Ccircle cx='27' cy='27' r='2'/%3E%3Ccircle cx='47' cy='27' r='2'/%3E%3Ccircle cx='7' cy='47' r='2'/%3E%3Ccircle cx='27' cy='47' r='2'/%3E%3Ccircle cx='47' cy='47' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Logo and brand */}
          <div
            style={{
              position: 'absolute',
              top: LAYOUT.padding,
              left: LAYOUT.padding,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: LAYOUT.logoSize,
                height: LAYOUT.logoSize,
                backgroundColor: COLORS.accent,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              MVP
            </div>
            <span
              style={{
                color: textColor,
                fontSize: FONT_SIZE.small,
                fontWeight: 600,
              }}
            >
              MVP Template
            </span>
          </div>

          {/* Type indicator */}
          {type !== 'default' && (
            <div
              style={{
                position: 'absolute',
                top: LAYOUT.padding,
                right: LAYOUT.padding,
                backgroundColor: getTypeColor(type),
                color: 'white',
                padding: '8px 16px',
                borderRadius: 20,
                fontSize: 18,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {type}
            </div>
          )}

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: LAYOUT.width - LAYOUT.padding * 2,
              flex: 1,
            }}
          >
            <h1
              style={{
                color: textColor,
                fontSize: FONT_SIZE.title,
                fontWeight: 700,
                lineHeight: 1.2,
                margin: 0,
                marginBottom: 24,
                textAlign: 'center',
                maxWidth: '100%',
              }}
            >
              {truncatedTitle}
            </h1>

            {getSubtitleForType(type) && (
              <p
                style={{
                  color: mutedColor,
                  fontSize: FONT_SIZE.subtitle,
                  fontWeight: 400,
                  lineHeight: 1.4,
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                {getSubtitleForType(type)}
              </p>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: LAYOUT.padding,
              left: LAYOUT.padding,
              right: LAYOUT.padding,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                color: mutedColor,
                fontSize: 20,
              }}
            >
              mvp-template.vercel.app
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: COLORS.accent,
                  borderRadius: '50%',
                }}
              />
              <span
                style={{
                  color: mutedColor,
                  fontSize: 18,
                }}
              >
                Build Your Startup Faster
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: LAYOUT.width,
        height: LAYOUT.height,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generating OG image:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'blog':
      return '#059669' // green
    case 'legal':
      return '#7c3aed' // purple
    case 'page':
      return '#dc2626' // red
    default:
      return COLORS.accent
  }
}

function getSubtitleForType(type: string): string | null {
  switch (type) {
    case 'blog':
      return 'Blog Article'
    case 'legal':
      return 'Legal Document'
    case 'page':
      return 'Information Page'
    default:
      return null
  }
}
