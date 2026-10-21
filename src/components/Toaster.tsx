import { useToasts } from './toast'

export function Toaster() {
  const items = useToasts()
  if (items.length === 0) return null
  return (
    <div className="toasts" role="status" aria-live="polite">
      {items.map((item) => (
        <div key={item.id} className={`toast toast--${item.kind}`}>
          {item.message}
        </div>
      ))}
    </div>
  )
}
