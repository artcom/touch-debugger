import { useState, useCallback } from "react"
import { GlobalStyles } from "../GlobalStyles"
import { usePointerEvents } from "../hooks/usePointerEvents.js"
import { useRecording } from "../hooks/useRecording.js"
import { useROISelector } from "../hooks/useROISelector.js"
import { useDisplayControls } from "../hooks/useDisplayControls.js"
import { useEventFilters } from "../hooks/useEventFilters.js"
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts.js"
import { useROIMouseEvents } from "../hooks/useROIMouseEvents.js"
import { ROISelectionOverlay, ROIIndicator } from "./App.styles.js"
import { Heatmap } from "./Heatmap.jsx"
import { ControlPanel } from "./ControlPanel/index.js"
import { AppProvider } from "./AppContext"

export const App = () => {
  const [liveEvents, setLiveEvents] = useState([])

  const {
    roi,
    roiSliders,
    isSelecting,
    selectionStart,
    selectionEnd,
    startSelection,
    updateSelection,
    finishSelection,
    clearROI,
    updateROIFromSliders,
  } = useROISelector()

  const {
    showHeatmap,
    setShowHeatmap,
    showControlPanel,
    setShowControlPanel,
    eventOpacity,
    setEventOpacity,
    eventLifetime,
    setEventLifetime,
  } = useDisplayControls()

  const { filterTypes, handleFilterChange, filterEvents } = useEventFilters()

  const recording = useRecording()

  const { getAllEvents } = usePointerEvents({
    enableConsoleLogging: true,
    roi: roi,
    pauseProcessing: isSelecting,
    onEvent: (event) => {
      setLiveEvents((prev) => [...prev, event])

      recording.addEvent(event)
    },
  })

  const allEvents = getAllEvents()

  const filteredEvents = filterEvents(allEvents)

  const handleROISliderChange = useCallback(
    (sliderName, value) => {
      updateROIFromSliders({
        ...roiSliders,
        [sliderName]: parseInt(value),
      })
    },
    [updateROIFromSliders, roiSliders],
  )

  useKeyboardShortcuts({
    onSpacebarToggle: () => setShowControlPanel((prev) => !prev),
    onEscape: clearROI,
    isSelecting,
  })

  useROIMouseEvents(isSelecting, startSelection, updateSelection, finishSelection)

  const contextValue = {
    recording,

    liveEvents,
    filteredEvents,

    roi,
    isSelecting,
    selectionStart,
    selectionEnd,
    roiSliders,
    startSelection,
    clearROI,
    handleROISliderChange,

    showHeatmap,
    eventOpacity,
    eventLifetime,
    setShowHeatmap,
    setEventOpacity,
    setEventLifetime,

    filterTypes,
    handleFilterChange,

    showControlPanel,
    setShowControlPanel,
  }

  return (
    <AppProvider value={contextValue}>
      <GlobalStyles />

      {isSelecting && (
        <ROISelectionOverlay
          selectionStart={selectionStart}
          selectionEnd={selectionEnd}
          data-testid="roi-selection-overlay"
        />
      )}

      {roi && roi.width > 0 && roi.height > 0 && (
        <ROIIndicator
          x={roi.x}
          y={roi.y}
          width={roi.width}
          height={roi.height}
          data-testid="roi-indicator"
        />
      )}

      <Heatmap
        events={filteredEvents}
        eventOpacity={eventOpacity}
        eventLifetime={eventLifetime}
        showHeatmap={showHeatmap}
      />

      {showControlPanel && <ControlPanel />}
    </AppProvider>
  )
}
