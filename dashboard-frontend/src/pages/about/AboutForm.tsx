import { useEffect, useRef, useState } from 'react'
import { aboutApi, type About } from '../../lib/api'
import { useToast } from '../../components/ToastProvider'

type Props = {
  initial: About | null
  onSuccess: () => void
  onCancel: () => void
}

export default function AboutForm({ initial, onSuccess, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [isActive, setIsActive] = useState<boolean>(initial?.isActive ?? true)
  const [order, setOrder] = useState<number>(initial?.order ?? 1)
  const [imagePreview, setImagePreview] = useState<string>(initial?.image ?? '')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    setTitle(initial?.title ?? '')
    setContent(initial?.content ?? '')
    setIsActive(initial?.isActive ?? true)
    setOrder(initial?.order ?? 1)
    setImagePreview(initial?.image ?? '')
    if (fileRef.current) fileRef.current.value = ''
  }, [initial])

  const submit = async () => {
    try {
      setSubmitting(true)
      setError(null)
      const fd = new FormData()
      fd.append('title', title)
      fd.append('content', content)
      fd.append('isActive', String(isActive))
      fd.append('order', String(order))
      const file = fileRef.current?.files?.[0]
      if (file) fd.append('image', file)
      if (initial?._id) {
        await aboutApi.update(initial._id, fd)
        showToast('About content updated successfully', 'success')
      } else {
        await aboutApi.create(fd)
        showToast('About content created successfully', 'success')
      }
      onSuccess()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Save failed')
      showToast(err?.response?.data?.message || 'Failed to save about content', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {error && <div style={{ color: '#f87171' }}>{error}</div>}
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr', alignItems: 'end' }}>
        <div>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={input} />
        </div>
        <div>
          <label>Order</label>
          <input type="number" value={order} min={1} onChange={(e) => setOrder(parseInt(e.target.value || '1'))} style={input} />
        </div>
      </div>
      <div>
        <label>Content</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} style={{ ...input, height: 140 }} />
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div>
          <label>Image</label>
          <input ref={fileRef} type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) setImagePreview(URL.createObjectURL(file))
          }} />
        </div>
        {imagePreview && <img src={imagePreview} alt="preview" style={{ width: 96, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid #334155' }} />}
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Active
        </label>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={submit} disabled={submitting} style={buttonPrimary}>{initial ? 'Update' : 'Create'}</button>
        <button onClick={onCancel} style={buttonSecondary}>Cancel</button>
      </div>
    </div>
  )
}

const input: React.CSSProperties = { width: '100%', padding: 10, background: '#0b1220', color: '#e5e7eb', border: '1px solid #334155', borderRadius: 6 }
const buttonPrimary: React.CSSProperties = { background: '#0ea5e9', color: '#0b0f1a', padding: '6px 10px', border: 'none', borderRadius: 6, cursor: 'pointer' }
const buttonSecondary: React.CSSProperties = { background: '#1f2937', color: '#e5e7eb', padding: '6px 10px', border: '1px solid #334155', borderRadius: 6, cursor: 'pointer' }


