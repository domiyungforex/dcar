'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body style={{ margin: 0, padding: 0 }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          <div style={{
            maxWidth: '28rem',
            margin: '0 auto',
            textAlign: 'center',
            padding: '1rem'
          }}>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              Something went wrong
            </h1>
            <p style={{
              marginBottom: '1.5rem',
              color: '#666'
            }}>
              {error.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={reset}
              style={{
                backgroundColor: '#000',
                color: '#fff',
                padding: '0.5rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
