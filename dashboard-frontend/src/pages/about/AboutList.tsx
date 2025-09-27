import { useEffect, useState, useCallback } from 'react'
import { aboutApi, type About } from '../../lib/api'
import SkeletonLoader from '../../components/SkeletonLoader'
import EmptyState from '../../components/EmptyState'
import { useToast } from '../../components/ToastProvider'
import AboutForm from './AboutForm'

export default function AboutList() {
  const [items, setItems] = useState<About[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<About | null>(null)
  const [creating, setCreating] = useState<boolean>(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { showToast } = useToast()

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      const response = await aboutApi.getAll({ page, limit: 20 })
      console.log('About API Response:', response.data) // Debug log
      setItems(response.data.data || [])
      setTotalPages(response.data.totalPages || 1)
    } catch (err: unknown) {
      console.error('About API Error:', err) // Debug log
      const errorMessage = err && typeof err === 'object' && 'response' in err && 
        err.response && typeof err.response === 'object' && 'data' in err.response &&
        err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
        ? (err.response.data as { message: string }).message
        : 'Failed to load about items'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { fetchAll() }, [fetchAll])

  const remove = async (id: string) => {
    if (!confirm('Delete this item?')) return
    try {
      await aboutApi.remove(id)
      showToast('About item deleted successfully', 'success')
      fetchAll()
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err && 
        err.response && typeof err.response === 'object' && 'data' in err.response &&
        err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
        ? (err.response.data as { message: string }).message
        : 'Failed to delete about item'
      showToast(errorMessage, 'error')
    }
  }

  console.log('AboutList render - items:', items, 'loading:', loading, 'error:', error, 'creating:', creating, 'editing:', editing) // Debug log

  if (loading) return <SkeletonLoader />
  if (error) return <div style={{ color: '#f87171' }}>{error}</div>

  // Show empty state if no items
  if (items.length === 0) {
    return (
      <div>
        <EmptyState
          title="No About Content"
          description="Create your about section to tell visitors about your company, mission, and values."
          createButtonText="Create About Content"
          onCreateNew={() => {
            console.log('Create About Content button clicked!')
            setCreating(true)
          }}
        />
        {(creating || editing) && (
          <div style={{ border: '1px solid #1f2937', padding: 16, borderRadius: 8, marginTop: 16 }}>
            <AboutForm
              initial={editing}
              onSuccess={() => { setCreating(false); setEditing(null); fetchAll() }}
              onCancel={() => { setCreating(false); setEditing(null) }}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>About Us</h2>
        {/* Hide new button if item exists - About is single item only */}
        {items.length === 0 && (
          <button onClick={() => { setCreating(true); setEditing(null) }} style={buttonPrimary}>New Item</button>
        )}
      </div>
      {(creating || editing) && (
        <div style={{ border: '1px solid #1f2937', padding: 16, borderRadius: 8 }}>
          <AboutForm
            initial={editing}
            onSuccess={() => { setCreating(false); setEditing(null); fetchAll() }}
            onCancel={() => { setCreating(false); setEditing(null) }}
          />
        </div>
      )}
      <div style={{ border: '1px solid #1f2937', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#0f172a' }}>
            <tr>
              <th style={th}>Title</th>
              <th style={th}>Active</th>
              <th style={th}>Order</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id} style={{ borderTop: '1px solid #1f2937' }}>
                <td style={td}>{it.title}</td>
                <td style={td}>{it.isActive ? 'Yes' : 'No'}</td>
                <td style={td}>{it.order}</td>
                <td style={{ ...td, display: 'flex', gap: 8 }}>
                  <button onClick={() => { setEditing(it); setCreating(false) }} style={buttonSmall}>Edit</button>
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
    </div>
  )
}

const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', color: '#cbd5e1', fontWeight: 600 }
const td: React.CSSProperties = { padding: '10px 12px' }
const buttonPrimary: React.CSSProperties = { background: '#0ea5e9', color: '#0b0f1a', padding: '6px 10px', border: 'none', borderRadius: 6, cursor: 'pointer' }
const buttonSmall: React.CSSProperties = { background: '#1f2937', color: '#e5e7eb', padding: '6px 10px', border: '1px solid #334155', borderRadius: 6, cursor: 'pointer' }
const buttonDanger: React.CSSProperties = { background: '#b91c1c', color: '#e5e7eb', padding: '6px 10px', border: 'none', borderRadius: 6, cursor: 'pointer' }


