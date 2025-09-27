import { useEffect, useState } from 'react'
import { blogApi, type Blog } from '../../lib/api'
import SkeletonLoader from '../../components/SkeletonLoader'
import EmptyState from '../../components/EmptyState'
import { useToast } from '../../components/ToastProvider'
import BlogForm from './BlogForm'

export default function BlogList() {
  const { showToast } = useToast()
  const [items, setItems] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Blog | null>(null)
  const [creating, setCreating] = useState<boolean>(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchAll = async () => {
    try {
      setLoading(true)
      const { data } = await blogApi.getAll({ page, limit: 20 })
      setItems(data.data || [])
      setTotalPages(data.totalPages || 1)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [page])

  const remove = async (id: string) => {
    if (!confirm('Delete this blog?')) return
    try {
      await blogApi.remove(id)
      showToast('Blog deleted successfully', 'success')
      fetchAll()
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to delete blog', 'error')
    }
  }

  if (loading) return <SkeletonLoader />
  if (error) return <div style={{ color: '#f87171' }}>{error}</div>

  if (items.length === 0 && !creating) {
    return (
      <EmptyState
        title="No Blogs"
        description="Create your first blog post to share updates and insights."
        createButtonText="New Blog"
        onCreateNew={() => { setCreating(true); setEditing(null) }}
      />
    )
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Blogs</h2>
        <button onClick={() => { setCreating(true); setEditing(null) }} style={buttonPrimary}>New Blog</button>
      </div>
      {(creating || editing) && (
        <div style={{ border: '1px solid #1f2937', padding: 16, borderRadius: 8 }}>
          <BlogForm
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

const buttonPrimary: React.CSSProperties = {
  background: '#0ea5e9', color: '#0b0f1a', padding: '6px 10px', border: 'none', borderRadius: 6, cursor: 'pointer'
}
const buttonSmall: React.CSSProperties = {
  background: '#1f2937', color: '#e5e7eb', padding: '6px 10px', border: '1px solid #334155', borderRadius: 6, cursor: 'pointer'
}
const buttonDanger: React.CSSProperties = {
  background: '#b91c1c', color: '#e5e7eb', padding: '6px 10px', border: 'none', borderRadius: 6, cursor: 'pointer'
}


