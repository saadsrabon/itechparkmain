import { useEffect, useMemo, useState } from 'react'
import { heroApi, type Hero } from '../../lib/api'
import { useToast } from '../../components/ToastProvider'

type Props = {
  initial?: Hero | null
  onSuccess: () => void
  onCancel: () => void
}

const defaultState: Omit<Hero, '_id'> = {
  title: '',
  description: '',
  primaryButton: { text: '', link: '', target: '_blank' },
  secondaryButton: { text: '', link: '', target: '_self' },
  videoUrl: '',
  isActive: false,
  order: 1
}

export default function HeroForm({ initial, onSuccess, onCancel }: Props) {
  const isEdit = useMemo(() => Boolean(initial && initial._id), [initial])
  const [form, setForm] = useState<Omit<Hero, '_id'>>(defaultState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    if (initial) {
      const { _id, ...rest } = initial
      setForm({ ...defaultState, ...rest })
    } else {
      setForm(defaultState)
    }
  }, [initial])

  const update = (path: string, value: any) => {
    setForm((prev) => {
      const copy: any = { ...prev }
      const parts = path.split('.')
      let cur = copy
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]]
      cur[parts[parts.length - 1]] = value
      return copy
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (isEdit && initial) {
        await heroApi.update(initial._id, form)
        showToast('Hero section updated successfully', 'success')
      } else {
        await heroApi.create(form)
        showToast('Hero section created successfully', 'success')
      }
      onSuccess()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save hero')
      showToast(err?.response?.data?.message || 'Failed to save hero section', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
      {error && <div style={{ color: '#f87171' }}>{error}</div>}
      <div>
        <label style={{ display: 'block', marginBottom: 4 }}>Title</label>
        <input value={form.title} onChange={(e) => update('title', e.target.value)} style={inputStyle} required />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 4 }}>Description</label>
        <textarea value={form.description} onChange={(e) => update('description', e.target.value)} style={{ ...inputStyle, minHeight: 96 }} required />
      </div>
      <fieldset style={fieldStyle}>
        <legend style={{ color: '#cbd5e1' }}>Primary Button</legend>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Text</label>
          <input value={form.primaryButton.text} onChange={(e) => update('primaryButton.text', e.target.value)} style={inputStyle} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Link</label>
          <input value={form.primaryButton.link} onChange={(e) => update('primaryButton.link', e.target.value)} style={inputStyle} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Target</label>
          <select value={form.primaryButton.target} onChange={(e) => update('primaryButton.target', e.target.value)} style={inputStyle as any}>
            <option value="_blank">_blank</option>
            <option value="_self">_self</option>
          </select>
        </div>
      </fieldset>
      <fieldset style={fieldStyle}>
        <legend style={{ color: '#cbd5e1' }}>Secondary Button</legend>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Text</label>
          <input value={form.secondaryButton.text} onChange={(e) => update('secondaryButton.text', e.target.value)} style={inputStyle} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Link</label>
          <input value={form.secondaryButton.link} onChange={(e) => update('secondaryButton.link', e.target.value)} style={inputStyle} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>Target</label>
          <select value={form.secondaryButton.target} onChange={(e) => update('secondaryButton.target', e.target.value)} style={inputStyle as any}>
            <option value="_blank">_blank</option>
            <option value="_self">_self</option>
          </select>
        </div>
      </fieldset>
      <div>
        <label style={{ display: 'block', marginBottom: 4 }}>YouTube Video URL</label>
        <input value={form.videoUrl} onChange={(e) => update('videoUrl', e.target.value)} style={inputStyle} required />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={form.isActive} onChange={(e) => update('isActive', e.target.checked)} /> Active
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          Order
          <input type="number" min={1} value={form.order} onChange={(e) => update('order', Number(e.target.value))} style={{ ...inputStyle, width: 100 }} />
        </label>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={submitting} style={buttonPrimary}>
          {submitting ? 'Saving...' : isEdit ? 'Update Hero' : 'Create Hero'}
        </button>
        <button type="button" onClick={onCancel} disabled={submitting} style={buttonGhost}>Cancel</button>
      </div>
    </form>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 8,
  borderRadius: 6,
  border: '1px solid #1f2937',
  background: '#0f172a',
  color: '#e5e7eb'
}

const fieldStyle: React.CSSProperties = {
  border: '1px solid #1f2937',
  padding: 12,
  borderRadius: 8,
  display: 'grid',
  gap: 8
}

const buttonPrimary: React.CSSProperties = {
  background: '#0ea5e9',
  color: '#0b0f1a',
  padding: '8px 12px',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer'
}

const buttonGhost: React.CSSProperties = {
  background: 'transparent',
  color: '#e5e7eb',
  padding: '8px 12px',
  border: '1px solid #334155',
  borderRadius: 6,
  cursor: 'pointer'
}


