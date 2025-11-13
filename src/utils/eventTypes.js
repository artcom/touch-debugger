export const POINTER_EVENT_TYPES = {
  POINTER_DOWN: "pointerdown",
  POINTER_UP: "pointerup",
  POINTER_MOVE: "pointermove",
  POINTER_ENTER: "pointerenter",
  POINTER_LEAVE: "pointerleave",
  CLICK: "click",
  DRAG_START: "dragstart",
  DRAG: "drag",
  DRAG_END: "dragend",
}

export const EVENT_COLORS = {
  [POINTER_EVENT_TYPES.POINTER_DOWN]: "#00ff00",
  [POINTER_EVENT_TYPES.POINTER_UP]: "#0080ff",
  [POINTER_EVENT_TYPES.POINTER_MOVE]: "#ff8000",
  [POINTER_EVENT_TYPES.POINTER_ENTER]: "#ffff00",
  [POINTER_EVENT_TYPES.POINTER_LEAVE]: "#ff0000",
  [POINTER_EVENT_TYPES.CLICK]: "#ff00ff",
  [POINTER_EVENT_TYPES.DRAG_START]: "#00ccff",
  [POINTER_EVENT_TYPES.DRAG]: "#0099cc",
  [POINTER_EVENT_TYPES.DRAG_END]: "#006699",
}

export const createPointerEvent = (event) => {
  return {
    type: event.type,
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    timestamp: Date.now(),
    rawEvent: event,
  }
}

export const createRecording = (events = {}) => {
  const now = Date.now()
  return {
    id: `recording-${now}`,
    startTime: now,
    endTime: null,
    events,
    statistics: {
      totalCount: 0,
      countsByType: {},
      averageInterval: 0,
      sessionDuration: 0,
    },
  }
}

export const createRegionOfInterest = (
  x1 = 0,
  y1 = 0,
  x2 = window.innerWidth,
  y2 = window.innerHeight,
) => {
  return {
    x1: Math.min(x1, x2),
    y1: Math.min(y1, y2),
    x2: Math.max(x1, x2),
    y2: Math.max(y1, y2),
  }
}

export const isPointInRegion = (x, y, region) => {
  return x >= region.x1 && x <= region.x2 && y >= region.y1 && y <= region.y2
}
