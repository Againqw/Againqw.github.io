import { useSyncExternalStore } from 'react'
import type { DB } from '../types'
import { getDB, subscribe } from '../api'

/** 订阅整库数据，任何后台写操作都会触发重渲染 */
export function useDB(): DB {
  return useSyncExternalStore(subscribe, getDB, getDB)
}
