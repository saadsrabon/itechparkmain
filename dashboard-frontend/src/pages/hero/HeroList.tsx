import { useEffect, useState } from 'react'
import { heroApi, type Hero } from '../../lib/api'
import SkeletonLoader from '../../components/SkeletonLoader'
import EmptyState from '../../components/EmptyState'
import { useToast } from '../../components/ToastProvider'

export default function HeroList() {
  const [items, setItems] = useState<Hero[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Hero | null>(null)
  const [creating, setCreating] = useState<boolean>(false)
  const { showToast } = useToast()

  const fetchAll = async () => {
    try {
      setLoading(true)
      const { data } = await heroApi.getAll()
      setItems(data.data || [])
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load heroes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const remove = async (id: string) => {
    if (!confirm('Delete this hero?')) return
    try {
      await heroApi.remove(id)
      showToast('Hero section deleted successfully', 'success')
      fetchAll()
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to delete hero section', 'error')
    }
  }

  const activate = async (id: string) => {
    try {
      await heroApi.activate(id)
      showToast('Hero section activated successfully', 'success')
      fetchAll()
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to activate hero section', 'error')
    }
  }

  if (loading) return <SkeletonLoader />
  if (error) return <div style={{ color: '#f87171' }}>{error}</div>

  // Show empty state if no items
  if (items.length === 0) {
    return (
      <EmptyState
        title="No Hero Section"
        description="Create your first hero section to showcase your main message and call-to-action."
        createButtonText="Create Hero Section"
        onCreateNew={() => setCreating(true)}
      />
    )
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Hero Section</h2>
        {/* Hide new button if item exists - Hero is single item only */}
        {items.length === 0 && (
          <button onClick={() => { setCreating(true); setEditing(null) }} style={buttonPrimary}>New Hero</button>
        )}
      </div>
      {(creating || editing) && (
        <div style={{ border: '1px solid #1f2937', padding: 16, borderRadius: 8 }}>
          <HeroForm
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
              <th style={th}>Updated</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id} style={{ borderTop: '1px solid #1f2937' }}>
                <td style={td}>{it.title}</td>
                <td style={td}>{it.isActive ? 'Yes' : 'No'}</td>
                <td style={td}>{it.order}</td>
                <td style={td}>{new Date((it as any).updatedAt).toLocaleString()}</td>
                <td style={{ ...td, display: 'flex', gap: 8 }}>
                  {!it.isActive && <button onClick={() => activate(it._id)} style={buttonSmall}>Activate</button>}
                  <button onClick={() => { setEditing(it); setCreating(false) }} style={buttonSmall}>Edit</button>
                  <button onClick={() => remove(it._id)} style={buttonDanger}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import HeroForm from './HeroForm'

const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', color: '#cbd5e1', fontWeight: 600 }
const td: React.CSSProperties = { padding: '10px 12px' }

const buttonPrimary: React.CSSProperties = {
  background: '#0ea5e9', color: '#0b0f1a', padding: '6px 10px', border: 'none', borderRadius: 6, cursor: 'pointer'
}
const buttonSmall: React.CSSProperties = {
  background: '#1f2937', color: '#e5e7eb', padding: '6px 10px', border: '1px solid #334155', borderRadius: 6, cursor: 'pointer'
}
const buttonDanger: React.CSSProperties = {
  background: '#b91c1c', color: '#e5e7eb', padding: '6px 10px', border: 'none', borderRadius: 6, cursor: 'pointer'
}



