import 'server-only'

import { EventEmitter } from 'node:events'

type AppEvent = { organizationId: string; type: string; data: unknown }

const globalForBus = globalThis as unknown as { bus?: EventEmitter }
const bus = globalForBus.bus ?? new EventEmitter()
globalForBus.bus = bus

export function publishEvent(event: AppEvent) {
  bus.emit('event', event)
}

export function subscribe(listener: (event: AppEvent) => void) {
  bus.on('event', listener)
  return () => bus.off('event', listener)
}
