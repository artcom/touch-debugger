import { useState, useRef, useEffect, useCallback } from "react"
import { storage } from "../utils/storageUtils.js"

export const useRecording = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordedEvents, setRecordedEvents] = useState([])
  const [statistics, setStatistics] = useState({
    totalEvents: 0,
    eventTypes: {},
    duration: 0,
    averageFrequency: 0,
  })

  const recordingStartTime = useRef(null)
  const playbackTimeoutsRef = useRef([])

  const calculateStatistics = useCallback((events) => {
    if (events.length === 0) {
      return {
        totalEvents: 0,
        eventTypes: {},
        duration: 0,
        averageFrequency: 0,
      }
    }

    const eventTypes = {}
    events.forEach((event) => {
      eventTypes[event.type] = (eventTypes[event.type] || 0) + 1
    })

    const firstTimestamp = events[0].timestamp
    const lastTimestamp = events[events.length - 1].timestamp
    const duration = lastTimestamp - firstTimestamp
    const averageFrequency = duration > 0 ? (events.length / duration) * 1000 : 0

    return {
      totalEvents: events.length,
      eventTypes,
      duration,
      averageFrequency,
    }
  }, [])

  useEffect(() => {
    setStatistics(calculateStatistics(recordedEvents))
  }, [recordedEvents, calculateStatistics])

  const addEvent = useCallback(
    (event) => {
      if (isRecording) {
        setRecordedEvents((prev) => [...prev, event])
      }
    },
    [isRecording],
  )

  const startRecording = useCallback(() => {
    setIsRecording(true)
    setIsPlaying(false)
    setRecordedEvents([])
    recordingStartTime.current = Date.now()

    playbackTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    playbackTimeoutsRef.current = []
  }, [])

  const stopRecording = useCallback(() => {
    setIsRecording(false)
    recordingStartTime.current = null

    if (recordedEvents.length > 0) {
      const recording = {
        id: `recording-${Date.now()}`,
        startTime: recordedEvents[0]?.timestamp || Date.now(),
        endTime: recordedEvents[recordedEvents.length - 1]?.timestamp || Date.now(),
        events: recordedEvents,
        statistics: calculateStatistics(recordedEvents),
      }

      storage.saveRecording(recording)
      console.log("Recording saved:", recording.id, "with", recording.events.length, "events")
    } else {
      console.log("No events to save")
    }
  }, [recordedEvents, calculateStatistics])

  const startPlayback = useCallback(() => {
    if (recordedEvents.length === 0) return

    setIsPlaying(true)
    setIsRecording(false)

    playbackTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    playbackTimeoutsRef.current = []

    const firstEventTime = recordedEvents[0].timestamp

    recordedEvents.forEach((event, index) => {
      const eventDelay = event.timestamp - firstEventTime

      const timeout = setTimeout(() => {
        try {
          const syntheticEvent = new PointerEvent(event.type, {
            pointerId: event.pointerId,
            clientX: event.x,
            clientY: event.y,
            bubbles: true,
          })

          window.dispatchEvent(syntheticEvent)
        } catch (error) {
          console.log("Synthetic event:", event.type, event.x, event.y)
        }

        if (index === recordedEvents.length - 1) {
          setIsPlaying(false)
          playbackTimeoutsRef.current = []
        }
      }, eventDelay)

      playbackTimeoutsRef.current.push(timeout)
    })
  }, [recordedEvents])

  const stopPlayback = useCallback(() => {
    setIsPlaying(false)
    playbackTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    playbackTimeoutsRef.current = []
  }, [])

  const clearRecording = useCallback(() => {
    setRecordedEvents([])
    setStatistics({
      totalEvents: 0,
      eventTypes: {},
      duration: 0,
      averageFrequency: 0,
    })
    setIsRecording(false)
    setIsPlaying(false)
    recordingStartTime.current = null
    playbackTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    playbackTimeoutsRef.current = []

    storage.clearRecordings()
  }, [])

  useEffect(() => {
    return () => {
      playbackTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
      playbackTimeoutsRef.current = []
    }
  }, [])

  return {
    isRecording,
    isPlaying,
    recordedEvents,
    statistics,
    startRecording,
    stopRecording,
    startPlayback,
    stopPlayback,
    clearRecording,
    addEvent,
  }
}
