import { useEffect, useCallback } from "react"
import { POINTER_EVENT_TYPES } from "../utils/eventTypes.js"

export const useROIMouseEvents = (
  isSelecting,
  startSelection,
  updateSelection,
  finishSelection,
) => {
  const getCoordinates = (e) => {
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0]
      return { x: touch.clientX, y: touch.clientY }
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      const touch = e.changedTouches[0]
      return { x: touch.clientX, y: touch.clientY }
    } else if (typeof e.clientX === "number" && typeof e.clientY === "number") {
      return { x: e.clientX, y: e.clientY }
    } else {
      console.warn("Unable to extract coordinates from event:", e)
      return { x: 0, y: 0 }
    }
  }

  const handleGlobalPointerUp = useCallback(() => {
    if (isSelecting) {
      finishSelection()
    }
  }, [isSelecting, finishSelection])

  const handleGlobalPointerMove = useCallback(
    (e) => {
      if (isSelecting) {
        const { x, y } = getCoordinates(e)
        updateSelection(x, y)
      }
    },
    [isSelecting, updateSelection],
  )

  const handleGlobalPointerDown = useCallback(
    (e) => {
      if (isSelecting) {
        const { x, y } = getCoordinates(e)
        startSelection(x, y)
      }
    },
    [isSelecting, startSelection],
  )

  const handleGlobalMouseUp = useCallback(() => {
    if (isSelecting) {
      finishSelection()
    }
  }, [isSelecting, finishSelection])

  const handleGlobalMouseMove = useCallback(
    (e) => {
      if (isSelecting) {
        const { x, y } = getCoordinates(e)
        updateSelection(x, y)
      }
    },
    [isSelecting, updateSelection],
  )

  const handleGlobalMouseDown = useCallback(
    (e) => {
      if (isSelecting) {
        const { x, y } = getCoordinates(e)
        startSelection(x, y)
      }
    },
    [isSelecting, startSelection],
  )

  const handleGlobalTouchEnd = useCallback(() => {
    if (isSelecting) {
      finishSelection()
    }
  }, [isSelecting, finishSelection])

  const handleGlobalTouchMove = useCallback(
    (e) => {
      if (isSelecting) {
        e.preventDefault()
        const { x, y } = getCoordinates(e)
        updateSelection(x, y)
      }
    },
    [isSelecting, updateSelection],
  )

  const handleGlobalTouchStart = useCallback(
    (e) => {
      if (isSelecting) {
        e.preventDefault()
        const { x, y } = getCoordinates(e)
        startSelection(x, y)
      }
    },
    [isSelecting, startSelection],
  )

  useEffect(() => {
    if (isSelecting) {
      document.addEventListener(POINTER_EVENT_TYPES.POINTER_UP, handleGlobalPointerUp)
      document.addEventListener(POINTER_EVENT_TYPES.POINTER_MOVE, handleGlobalPointerMove)
      document.addEventListener(POINTER_EVENT_TYPES.POINTER_DOWN, handleGlobalPointerDown)

      document.addEventListener("mouseup", handleGlobalMouseUp)
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mousedown", handleGlobalMouseDown)

      document.addEventListener("touchend", handleGlobalTouchEnd)
      document.addEventListener("touchmove", handleGlobalTouchMove, { passive: false })
      document.addEventListener("touchstart", handleGlobalTouchStart, { passive: false })

      return () => {
        document.removeEventListener(POINTER_EVENT_TYPES.POINTER_UP, handleGlobalPointerUp)
        document.removeEventListener(POINTER_EVENT_TYPES.POINTER_MOVE, handleGlobalPointerMove)
        document.removeEventListener(POINTER_EVENT_TYPES.POINTER_DOWN, handleGlobalPointerDown)

        document.removeEventListener("mouseup", handleGlobalMouseUp)
        document.removeEventListener("mousemove", handleGlobalMouseMove)
        document.removeEventListener("mousedown", handleGlobalMouseDown)

        document.removeEventListener("touchend", handleGlobalTouchEnd)
        document.removeEventListener("touchmove", handleGlobalTouchMove)
        document.removeEventListener("touchstart", handleGlobalTouchStart)
      }
    }
  }, [
    isSelecting,
    handleGlobalPointerUp,
    handleGlobalPointerMove,
    handleGlobalPointerDown,
    handleGlobalMouseUp,
    handleGlobalMouseMove,
    handleGlobalMouseDown,
    handleGlobalTouchEnd,
    handleGlobalTouchMove,
    handleGlobalTouchStart,
  ])
}
