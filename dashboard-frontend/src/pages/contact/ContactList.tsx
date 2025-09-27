import { useEffect, useState } from 'react'
import { contactApi, type ContactMessage } from '../../lib/api'
import SkeletonLoader from '../../components/SkeletonLoader'
import EmptyState from '../../components/EmptyState'
import { useToast } from '../../components/ToastProvider'
import ContactView from './ContactView'

export default function ContactList() {
  const { showToast } = useToast()
  const [items, setItems] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'resolved'>('all')
  const [selected, setSelected] = useState<ContactMessage | null>(null)

  const fetchAll = async () => {
    try {
      setLoading(true)
      const params: any = { page, limit: 20 }
      if (filter !== 'all') params.status = filter
      const { data } = await contactApi.getAll(params)
      setItems(data.data || [])
      setTotalPages(data.totalPages || 1)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [page, filter])

  const onUpdateStatus = async (id: string, status: 'new' | 'read' | 'resolved') => {
    try {
      await contactApi.updateStatus(id, status)
      showToast('Status updated', 'success')
      fetchAll()
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to update status', 'error')
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this message?')) return
    try {
      await contactApi.remove(id)
      showToast('Message deleted', 'success')
      fetchAll()
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to delete message', 'error')
    }
  }

  if (loading) return <SkeletonLoader />
  if (error) return <div style={{ color: '#f87171' }}>{error}</div>

  if (items.length === 0) {
    return (
      <EmptyState
        title="No Contact Messages"
        description="Messages submitted from your site will appear here."
        createButtonText="Refresh"
        onCreateNew={() => fetchAll()}
      />
    )
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Contact Messages</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)} style={select}>
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      <div style={{ border: '1px solid #1f2937', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#0f172a' }}>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Status</th>
              <th style={th}>Received</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id} style={{ borderTop: '1px solid #1f2937' }}>
                <td style={td}>{it.name}</td>
                <td style={td}>{it.email}</td>
                <td style={td}>{it.status}</td>
                <td style={td}>{new Date(it.createdAt).toLocaleString()}</td>
                <td style={{ ...td, display: 'flex', gap: 8 }}>
                  <button onClick={() => setSelected(it)} style={buttonSmall}>View</button>
                  <button onClick={() => onUpdateStatus(it._id, it.status === 'new' ? 'read' : 'resolved')} style={buttonPrimary}>{it.status === 'resolved' ? 'Resolved' : 'Mark ' + (it.status === 'new' ? 'Read' : 'Resolved')}</button>
                  <button onClick={() => remove(it._id)} style={buttonDanger}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} style={buttonSmall}>Prev</button>
        <div style={{ alignSelf: 'center' }}>Page {page} of {totalPages}</div>
        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} style={buttonSmall}>Next</button>
      </div>
      {selected && (
        <div style={{ border: '1px solid #1f2937', padding: 16, borderRadius: 8 }}>
          <ContactView item={selected} onClose={() => setSelected(null)} />
        </div>
      )}
    </div>
  )
}

const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', color: '#cbd5e1', fontWeight: 600 }
const td: React.CSSProperties = { padding: '10px 12px' }
const select: React.CSSProperties = { background: '#0b1220', color: '#e5e7eb', padding: '6px 10px', border: '1px solid #334155', borderRadius: 6 }
const buttonPrimary: React.CSSProperties = { background: '#0ea5e9', color: '#0b0f1a', padding: '6px 10px', border: 'none', borderRadius: 6, cursor: 'pointer' }
const buttonSmall: React.CSSProperties = { background: '#1f2937', color: '#e5e7eb', padding: '6px 10px', border: '1px solid #334155', borderRadius: 6, cursor: 'pointer' }
const buttonDanger: React.CSSProperties = { background: '#b91c1c', color: '#e5e7eb', padding: '6px 10px', border: 'none', borderRadius: 6, cursor: 'pointer' }


