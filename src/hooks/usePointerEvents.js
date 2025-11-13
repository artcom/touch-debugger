import { useEffect, useRef } from "react"
import { eventProcessor } from "../utils/eventUtils.js"
import { POINTER_EVENT_TYPES } from "../utils/eventTypes.js"

export const usePointerEvents = (options = {}) => {
  const {
    enableConsoleLogging = true,
    region = null,
    roi = null,
    pauseProcessing = false,
    onEvent = null,
  } = options

  const processedEventsRef = useRef([])
  const lastFilteredEventsRef = useRef(null)
  const lastROIRef = useRef(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const handlePointerEvent = (event) => {
      if (pauseProcessing) return

      const processedEvent = eventProcessor.addEvent(event, region)

      if (!processedEvent) return

      if (roi && roi.width > 0 && roi.height > 0) {
        if (processedEvent.x === undefined || processedEvent.y === undefined) {
          return
        }

        if (
          processedEvent.x < roi.x ||
          processedEvent.x > roi.x + roi.width ||
          processedEvent.y < roi.y ||
          processedEvent.y > roi.y + roi.height
        ) {
          return
        }
      }

      if (enableConsoleLogging) {
        console.log(`Pointer Event: ${processedEvent.type}`, {
          type: processedEvent.type,
          x: processedEvent.x,
          y: processedEvent.y,
          pointerId: processedEvent.pointerId,
          timestamp: processedEvent.timestamp,
        })
      }

      processedEventsRef.current.push(processedEvent)

      lastFilteredEventsRef.current = null
      lastROIRef.current = null

      if (onEvent) {
        onEvent(processedEvent)
      }
    }

    const eventTypes = Object.values(POINTER_EVENT_TYPES)

    eventTypes.forEach((eventType) => {
      window.addEventListener(eventType, handlePointerEvent)
    })

    return () => {
      eventTypes.forEach((eventType) => {
        window.removeEventListener(eventType, handlePointerEvent)
      })
    }
  }, [enableConsoleLogging, region, roi, pauseProcessing, onEvent])

  const getRecentEvents = (count = 10) => {
    return processedEventsRef.current.slice(-count)
  }

  const getAllEvents = () => {
    return processedEventsRef.current
  }

  const getAllEventsCopy = () => {
    return [...processedEventsRef.current]
  }

  const clearEvents = () => {
    processedEventsRef.current = []
    lastFilteredEventsRef.current = null
    lastROIRef.current = null
    eventProcessor.clearEvents()
  }

  const getStatistics = () => {
    return eventProcessor.getStatistics()
  }

  const getFilteredEvents = (roi) => {
    if (
      lastROIRef.current &&
      roi &&
      lastROIRef.current.x === roi.x &&
      lastROIRef.current.y === roi.y &&
      lastROIRef.current.width === roi.width &&
      lastROIRef.current.height === roi.height &&
      lastFilteredEventsRef.current
    ) {
      return lastFilteredEventsRef.current
    }

    if (!roi || roi.width === 0 || roi.height === 0) {
      lastFilteredEventsRef.current = processedEventsRef.current
      lastROIRef.current = roi
      return processedEventsRef.current
    }

    const filtered = processedEventsRef.current.filter((event) => {
      if (event.x === undefined || event.y === undefined) {
        return false
      }

      return (
        event.x >= roi.x &&
        event.x <= roi.x + roi.width &&
        event.y >= roi.y &&
        event.y <= roi.y + roi.height
      )
    })

    lastFilteredEventsRef.current = filtered
    lastROIRef.current = roi

    return filtered
  }

  return {
    getRecentEvents,
    getAllEvents,
    getAllEventsCopy,
    getFilteredEvents,
    clearEvents,
    getStatistics,
  }
}
