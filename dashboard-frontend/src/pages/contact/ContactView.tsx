import { contactApi, type ContactMessage } from '../../lib/api'

export default function ContactView({ item, onClose }: { item: ContactMessage; onClose: () => void }) {
  const markRead = async () => {
    if (item.status === 'new') await contactApi.updateStatus(item._id, 'read')
    onClose()
  }

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Message from {item.name}</h3>
        <button onClick={onClose} style={buttonSmall}>Close</button>
      </div>
      <div style={{ display: 'grid', gap: 4 }}>
        <div><strong>Email:</strong> {item.email}</div>
        <div><strong>Status:</strong> {item.status}</div>
        <div><strong>Received:</strong> {new Date(item.createdAt).toLocaleString()}</div>
      </div>
      <div style={{ whiteSpace: 'pre-wrap', border: '1px solid #1f2937', padding: 12, borderRadius: 8 }}>{item.message}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {item.status === 'new' && <button onClick={markRead} style={buttonPrimary}>Mark Read</button>}
      </div>
    </div>
  )
}

const buttonSmall: React.CSSProperties = { background: '#1f2937', color: '#e5e7eb', padding: '6px 10px', border: '1px solid #334155', borderRadius: 6, cursor: 'pointer' }
const buttonPrimary: React.CSSProperties = { background: '#0ea5e9', color: '#0b0f1a', padding: '6px 10px', border: 'none', borderRadius: 6, cursor: 'pointer' }




