import { useRef, useEffect, useCallback } from "react"
import { styled } from "styled-components"
import { getEventColorWithOpacity, hasValidCoordinates } from "../utils/colorUtils.js"
import { POINTER_EVENT_TYPES } from "../utils/eventTypes.js"

const HeatmapCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 999;
`

export const Heatmap = ({
  events = [],
  eventOpacity = 1.0,
  eventLifetime = 3000,
  showHeatmap = true,
  filterTypes = {
    pointerdown: true,
    pointerup: true,
    pointermove: true,
    pointerenter: true,
    pointerleave: true,
  },
}) => {
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)

  const getEventRadius = useCallback((eventType) => {
    return eventType === POINTER_EVENT_TYPES.POINTER_MOVE ? 3.75 : 15
  }, [])

  const getFadeOpacity = useCallback(
    (eventTimestamp, currentTime) => {
      if (eventLifetime === -1) return 1

      const age = currentTime - eventTimestamp
      if (age >= eventLifetime) return 0

      const fadeProgress = age / eventLifetime
      return Math.max(0, 1 - fadeProgress)
    },
    [eventLifetime],
  )

  const renderEvents = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const currentTime = Date.now()

    const eventsToRender = events.filter((event) => {
      if (!hasValidCoordinates(event)) return false
      if (filterTypes && typeof filterTypes === "object" && !filterTypes[event.type]) return false

      const fadeOpacity = getFadeOpacity(event.timestamp, currentTime)
      return fadeOpacity > 0
    })

    eventsToRender.forEach((event) => {
      const { x, y, type, timestamp } = event
      const radius = getEventRadius(type)
      const fadeOpacity = getFadeOpacity(timestamp, currentTime)
      const finalOpacity = eventOpacity * fadeOpacity

      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI)

      ctx.fillStyle = getEventColorWithOpacity(type, finalOpacity)
      ctx.fill()

      if (radius > 5) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${finalOpacity * 0.8})`
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })
  }, [events, eventOpacity, filterTypes, getEventRadius, getFadeOpacity])

  useEffect(() => {
    const animate = () => {
      renderEvents()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [renderEvents])

  useEffect(() => {
    const handleResize = () => {
      renderEvents()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [renderEvents])

  return <>{showHeatmap && <HeatmapCanvas ref={canvasRef} data-testid="heatmap-canvas" />}</>
}
