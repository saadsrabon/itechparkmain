type Props = {
  title: string
  description: string
  onCreateNew: () => void
  createButtonText: string
}

export default function EmptyState({ title, description, onCreateNew, createButtonText }: Props) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '60px 20px',
      textAlign: 'center',
      gap: 16
    }}>
      <div style={{ fontSize: 48, opacity: 0.5 }}>📭</div>
      <h3 style={{ margin: 0, color: '#e5e7eb' }}>{title}</h3>
      <p style={{ margin: 0, color: '#9ca3af', maxWidth: 400 }}>{description}</p>
      <button 
        onClick={onCreateNew}
        style={{
          background: '#0ea5e9',
          color: '#0b0f1a',
          padding: '12px 24px',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontWeight: 600,
          marginTop: 8
        }}
      >
        {createButtonText}
      </button>
    </div>
  )
}
