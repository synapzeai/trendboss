// app/success/page.js

export default function SuccessPage({ searchParams }) {
  const raw = searchParams?.session_id ?? searchParams?.id
  const sessionId = Array.isArray(raw) ? raw[0] : raw

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div>
        <h1>Payment successful</h1>
        <p>Session: {sessionId || 'missing'}</p>
        <a href="/">Back to TrendBoss</a>
      </div>
    </div>
  )
}
