import { useState, useCallback } from "react"

export const useFoldableSections = (initialSections = {}) => {
  const defaultSections = {
    recording: false,
    display: false,
    filters: false,
    roi: false,
    statistics: false,
    logs: false,
    ...initialSections,
  }

  const [foldedSections, setFoldedSections] = useState(defaultSections)

  const toggleSection = useCallback((section) => {
    setFoldedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }, [])

  const isSectionFolded = useCallback(
    (section) => {
      return foldedSections[section] || false
    },
    [foldedSections],
  )

  return {
    foldedSections,
    toggleSection,
    isSectionFolded,
  }
}
