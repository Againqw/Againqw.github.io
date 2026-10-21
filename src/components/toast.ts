import { useSyncExternalStore } from 'react'

export type ToastKind = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  message: string
  kind: ToastKind
}

let items: ToastItem[] = []
let seed = 0
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((fn) => fn())
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function toast(message: string, kind: ToastKind = 'success'): void {
  const item: ToastItem = { id: (seed += 1), message, kind }
  items = [...items, item]
  emit()
  window.setTimeout(() => {
    items = items.filter((t) => t.id !== item.id)
    emit()
  }, 2800)
}

export function useToasts(): ToastItem[] {
  return useSyncExternalStore(subscribe, () => items, () => items)
}
