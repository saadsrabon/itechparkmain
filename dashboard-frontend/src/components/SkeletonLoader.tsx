export default function SkeletonLoader() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ height: 32, width: 200, background: '#1f2937', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }}></div>
        <div style={{ height: 36, width: 120, background: '#1f2937', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }}></div>
      </div>
      <div style={{ border: '1px solid #1f2937', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ background: '#0f172a', padding: '10px 12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ height: 20, background: '#1f2937', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }}></div>
            ))}
          </div>
        </div>
        <div style={{ padding: 12 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 8 }}>
              {[1, 2, 3, 4].map(j => (
                <div key={j} style={{ height: 16, background: '#1f2937', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }}></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <div style={{ height: 32, width: 60, background: '#1f2937', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }}></div>
        <div style={{ height: 32, width: 100, background: '#1f2937', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }}></div>
        <div style={{ height: 32, width: 60, background: '#1f2937', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }}></div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
