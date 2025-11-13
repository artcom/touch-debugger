import { useState, useCallback } from "react"

export const useEventFilters = () => {
  const [filterTypes, setFilterTypes] = useState({
    pointerdown: true,
    pointerup: true,
    pointermove: true,
    pointerenter: true,
    pointerleave: true,
    click: true,
    dragstart: true,
    drag: true,
    dragend: true,
  })

  const handleFilterChange = useCallback((type, enabled) => {
    setFilterTypes((prev) => ({
      ...prev,
      [type]: enabled,
    }))
  }, [])

  const filterEvents = useCallback(
    (events) => {
      return events.filter((event) => filterTypes[event.type])
    },
    [filterTypes],
  )

  return {
    filterTypes,
    handleFilterChange,
    filterEvents,
  }
}
