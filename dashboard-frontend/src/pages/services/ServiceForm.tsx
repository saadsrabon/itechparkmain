import { useEffect, useMemo, useState } from 'react'
import { servicesApi, type Service } from '../../lib/api'

type Props = {
  initial?: Service | null
  onSuccess: () => void
  onCancel: () => void
}

const sectionOptions = [
  'Design',
  'Web Development',
  'Video Editing',
  'Search Engine Marketing',
  'Social Media Marketing',
  'Business Consultation',
  'Virtual Assistant',
  'Cyber Security'
]

type FormState = Omit<Service, '_id' | 'images' | 'slug'> & { images?: File[] }

const defaultState: FormState = {
  section: 'Design',
  title: '',
  content: '',
  isActive: true,
  order: 1,
  images: []
}

export default function ServiceForm({ initial, onSuccess, onCancel }: Props) {
  const isEdit = useMemo(() => Boolean(initial && initial._id), [initial])
  const [form, setForm] = useState<FormState>(defaultState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initial) {
      const { _id, images: _imgs, slug: _slug, ...rest } = initial
      setForm({ ...defaultState, ...rest, images: [] })
    } else {
      setForm(defaultState)
    }
  }, [initial])

  const update = (key: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    update('images', files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (isEdit && initial) {
        const fd = new FormData()
        fd.append('section', form.section)
        fd.append('title', form.title)
        fd.append('content', form.content)
        fd.append('isActive', String(form.isActive))
        fd.append('order', String(form.order))
        if (form.images && form.images.length) {
          form.images.forEach((file) => fd.append('images', file))
        }
        await servicesApi.update(initial._id, fd)
      } else {
        const fd = new FormData()
        fd.append('section', form.section)
        fd.append('title', form.title)
        fd.append('content', form.content)
        fd.append('isActive', String(form.isActive))
        fd.append('order', String(form.order))
        if (form.images && form.images.length) {
          form.images.forEach((file) => fd.append('images', file))
        }
        await servicesApi.create(fd)
      }
      onSuccess()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save service')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 800 }}>
      {error && <div style={{ color: '#f87171' }}>{error}</div>}
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <label style={label}>Section</label>
          <select value={form.section} onChange={(e) => update('section', e.target.value)} style={inputStyle as any}>
            {sectionOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={label}>Order</label>
          <input type="number" min={1} value={form.order} onChange={(e) => update('order', Number(e.target.value))} style={inputStyle} />
        </div>
      </div>
      <div>
        <label style={label}>Title</label>
        <input value={form.title} onChange={(e) => update('title', e.target.value)} style={inputStyle} required />
      </div>
      <div>
        <label style={label}>Content</label>
        <textarea value={form.content} onChange={(e) => update('content', e.target.value)} style={{ ...inputStyle, minHeight: 120 }} required />
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={form.isActive} onChange={(e) => update('isActive', e.target.checked)} /> Active
        </label>
        <div>
          <label style={label}>Images</label>
          <input type="file" multiple accept="image/*" onChange={handleFiles} style={fileInput} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={submitting} style={buttonPrimary}>
          {submitting ? 'Saving...' : isEdit ? 'Update Service' : 'Create Service'}
        </button>
        <button type="button" onClick={onCancel} disabled={submitting} style={buttonGhost}>Cancel</button>
      </div>
    </form>
  )
}

const label: React.CSSProperties = { display: 'block', marginBottom: 4 }
const inputStyle: React.CSSProperties = {
  width: '100%', padding: 8, borderRadius: 6, border: '1px solid #1f2937', background: '#0f172a', color: '#e5e7eb'
}
const fileInput: React.CSSProperties = { padding: 6, borderRadius: 6, border: '1px solid #1f2937', background: '#0f172a', color: '#e5e7eb' }
const buttonPrimary: React.CSSProperties = { background: '#0ea5e9', color: '#0b0f1a', padding: '8px 12px', border: 'none', borderRadius: 6, cursor: 'pointer' }
const buttonGhost: React.CSSProperties = { background: 'transparent', color: '#e5e7eb', padding: '8px 12px', border: '1px solid #334155', borderRadius: 6, cursor: 'pointer' }



