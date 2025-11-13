import { POINTER_EVENT_TYPES } from "./eventTypes.js"

export const EVENT_COLORS = {
  [POINTER_EVENT_TYPES.POINTER_DOWN]: "#ff4444",
  [POINTER_EVENT_TYPES.POINTER_UP]: "#44ff44",
  [POINTER_EVENT_TYPES.POINTER_MOVE]: "#4444ff",
  [POINTER_EVENT_TYPES.POINTER_ENTER]: "#ffaa44",
  [POINTER_EVENT_TYPES.POINTER_LEAVE]: "#ff44aa",
  [POINTER_EVENT_TYPES.CLICK]: "#ff8844",
  [POINTER_EVENT_TYPES.DRAG_START]: "#44aaff",
  [POINTER_EVENT_TYPES.DRAG]: "#44ffff",
  [POINTER_EVENT_TYPES.DRAG_END]: "#ff44ff",
}

export const EVENT_COLORS_RGB = {
  [POINTER_EVENT_TYPES.POINTER_DOWN]: "rgb(255, 68, 68)",
  [POINTER_EVENT_TYPES.POINTER_UP]: "rgb(68, 255, 68)",
  [POINTER_EVENT_TYPES.POINTER_MOVE]: "rgb(68, 68, 255)",
  [POINTER_EVENT_TYPES.POINTER_ENTER]: "rgb(255, 170, 68)",
  [POINTER_EVENT_TYPES.POINTER_LEAVE]: "rgb(255, 68, 170)",
  [POINTER_EVENT_TYPES.CLICK]: "rgb(255, 136, 68)",
  [POINTER_EVENT_TYPES.DRAG_START]: "rgb(68, 170, 255)",
  [POINTER_EVENT_TYPES.DRAG]: "rgb(68, 255, 255)",
  [POINTER_EVENT_TYPES.DRAG_END]: "rgb(255, 68, 255)",
}

export const getEventColor = (eventType) => {
  return EVENT_COLORS[eventType] || "#ffffff"
}

export const rgbToRgba = (color, opacity) => {
  if (color.startsWith("#")) {
    return hexToRgba(color, opacity)
  }

  const matches = color.match(/\d+/g)
  if (!matches || matches.length < 3) {
    return `rgba(255, 255, 255, ${opacity})`
  }

  const [r, g, b] = matches
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export const getEventColorWithOpacity = (eventType, opacity) => {
  const baseColor = getEventColor(eventType)
  return rgbToRgba(baseColor, opacity)
}

export const filterEventsByType = (events, filterTypes) => {
  return events.filter((event) => filterTypes[event.type] === true)
}

export const hasValidCoordinates = (event) => {
  return (
    event.x !== undefined &&
    event.y !== undefined &&
    typeof event.x === "number" &&
    typeof event.y === "number" &&
    !isNaN(event.x) &&
    !isNaN(event.y)
  )
}

export const hexToRgba = (hex, alpha = 1) => {
  hex = hex.replace("#", "")

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
