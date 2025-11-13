import { createPointerEvent, isPointInRegion } from "./eventTypes.js"

export class EventProcessor {
  constructor() {
    this.events = []
    this.maxEvents = 500
    this.lastFilteredEvents = null
    this.lastFilterCriteria = null
  }

  addEvent(event, region = null) {
    const processedEvent = createPointerEvent(event)

    if (region && !isPointInRegion(processedEvent.x, processedEvent.y, region)) {
      return null
    }

    if (this.events.length >= this.maxEvents) {
      this.events.shift()
    }

    this.events.push(processedEvent)

    this.lastFilteredEvents = null
    this.lastFilterCriteria = null

    return processedEvent
  }

  getEvents() {
    return this.events
  }

  getEventsCopy() {
    return [...this.events]
  }

  getEventsByType(type) {
    return this.events.filter((event) => event.type === type)
  }

  getRecentEvents(count = 10) {
    const startIndex = Math.max(0, this.events.length - count)
    return this.events.slice(startIndex)
  }

  clearEvents() {
    this.events = []
    this.lastFilteredEvents = null
    this.lastFilterCriteria = null
  }

  getEventsInTimeRange(startTime, endTime) {
    return this.events.filter((event) => event.timestamp >= startTime && event.timestamp <= endTime)
  }

  filterEvents(filters = {}) {
    const filterKey = JSON.stringify(filters)

    if (this.lastFilterCriteria === filterKey && this.lastFilteredEvents) {
      return this.lastFilteredEvents
    }

    let filtered = this.events

    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter((event) => filters.types.includes(event.type))
    }

    if (filters.startTime) {
      filtered = filtered.filter((event) => event.timestamp >= filters.startTime)
    }

    if (filters.endTime) {
      filtered = filtered.filter((event) => event.timestamp <= filters.endTime)
    }

    if (filters.region) {
      filtered = filtered.filter((event) => isPointInRegion(event.x, event.y, filters.region))
    }

    this.lastFilteredEvents = filtered
    this.lastFilterCriteria = filterKey

    return filtered
  }

  getStatistics() {
    if (this.events.length === 0) {
      return {
        totalCount: 0,
        countsByType: {},
        averageInterval: 0,
        sessionDuration: 0,
      }
    }

    const countsByType = {}
    let totalInterval = 0

    this.events.forEach((event, index) => {
      countsByType[event.type] = (countsByType[event.type] || 0) + 1

      if (index > 0) {
        totalInterval += event.timestamp - this.events[index - 1].timestamp
      }
    })

    const sessionDuration =
      this.events.length > 0
        ? this.events[this.events.length - 1].timestamp - this.events[0].timestamp
        : 0

    return {
      totalCount: this.events.length,
      countsByType,
      averageInterval: this.events.length > 1 ? totalInterval / (this.events.length - 1) : 0,
      sessionDuration,
    }
  }
}

export const eventProcessor = new EventProcessor()

export const createSyntheticPointerEvent = (type, x, y, pointerId = 1) => {
  return new PointerEvent(type, {
    pointerId,
    clientX: x,
    clientY: y,
    isPrimary: true,
  })
}

export const injectSyntheticEvent = (element, type, x, y, pointerId = 1) => {
  const syntheticEvent = createSyntheticPointerEvent(type, x, y, pointerId)
  element.dispatchEvent(syntheticEvent)
  return syntheticEvent
}
