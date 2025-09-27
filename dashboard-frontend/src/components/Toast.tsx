import { useEffect, useState } from 'react'

type ToastProps = {
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300) // Wait for animation to complete
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getToastStyle = () => {
    const baseStyle = {
      position: 'fixed' as const,
      top: 20,
      right: 20,
      padding: '12px 16px',
      borderRadius: 8,
      color: '#fff',
      fontWeight: 500,
      zIndex: 1000,
      transform: visible ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      minWidth: 300,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    }

    switch (type) {
      case 'success':
        return { ...baseStyle, background: '#10b981' }
      case 'error':
        return { ...baseStyle, background: '#ef4444' }
      case 'info':
        return { ...baseStyle, background: '#3b82f6' }
      default:
        return { ...baseStyle, background: '#6b7280' }
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'info':
        return 'ℹ️'
      default:
        return '📢'
    }
  }

  return (
    <div style={getToastStyle()}>
      <span style={{ fontSize: 16 }}>{getIcon()}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={() => {
          setVisible(false)
          setTimeout(onClose, 300)
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 18,
          padding: 0,
          width: 20,
          height: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ×
      </button>
    </div>
  )
}
