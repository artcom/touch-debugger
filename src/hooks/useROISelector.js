import { useState, useCallback } from "react"

export const useROISelector = () => {
  const [roi, setRoi] = useState(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState(null)
  const [selectionEnd, setSelectionEnd] = useState(null)

  const [roiSliders, setRoiSliders] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })

  const startSelection = useCallback((x, y) => {
    setIsSelecting(true)
    setSelectionStart({ x, y })
    setSelectionEnd({ x, y })
  }, [])

  const updateSelection = useCallback(
    (x, y) => {
      if (!isSelecting) return
      setSelectionEnd({ x, y })
    },
    [isSelecting],
  )

  const finishSelection = useCallback(() => {
    if (!selectionStart || !selectionEnd) return

    const x = Math.min(selectionStart.x, selectionEnd.x)
    const y = Math.min(selectionStart.y, selectionEnd.y)
    const width = Math.abs(selectionEnd.x - selectionStart.x)
    const height = Math.abs(selectionEnd.y - selectionStart.y)

    const newRoi = { x, y, width, height }
    setRoi(newRoi)

    setRoiSliders({
      x: x,
      y: y,
      width,
      height,
    })

    setIsSelecting(false)
    setSelectionStart(null)
    setSelectionEnd(null)
  }, [selectionStart, selectionEnd])

  const cancelSelection = useCallback(() => {
    setIsSelecting(false)
    setSelectionStart(null)
    setSelectionEnd(null)
  }, [])

  const clearROI = useCallback(() => {
    setRoi(null)
    setIsSelecting(false)
    setSelectionStart(null)
    setSelectionEnd(null)

    setRoiSliders({
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    })
  }, [])

  const updateROIFromSliders = useCallback((newSliders) => {
    setRoiSliders(newSliders)

    if (newSliders.width > 0 && newSliders.height > 0) {
      setRoi({
        x: newSliders.x,
        y: newSliders.y,
        width: newSliders.width,
        height: newSliders.height,
      })
    } else {
      setRoi(null)
    }
  }, [])

  const isPointInROI = useCallback(
    (x, y) => {
      if (!roi || roi.width === 0 || roi.height === 0) return false

      return x >= roi.x && x <= roi.x + roi.width && y >= roi.y && y <= roi.y + roi.height
    },
    [roi],
  )

  const filterEventsByROI = useCallback(
    (events) => {
      if (!roi || roi.width === 0 || roi.height === 0) {
        return events
      }

      return events.filter((event) => {
        if (event.x === undefined || event.y === undefined) {
          return false
        }

        return isPointInROI(event.x, event.y)
      })
    },
    [roi, isPointInROI],
  )

  return {
    roi,
    roiSliders,
    isSelecting,
    selectionStart,
    selectionEnd,
    startSelection,
    updateSelection,
    finishSelection,
    cancelSelection,
    clearROI,
    updateROIFromSliders,
    isPointInROI,
    filterEventsByROI,
  }
}
