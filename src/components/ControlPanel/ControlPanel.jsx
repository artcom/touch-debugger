import { useState, useEffect } from "react"
import { storage } from "../../utils/storageUtils.js"
import { useAppContext } from ".././AppContext"
import { useDraggable } from "../../hooks/useDraggable.js"
import { useFoldableSections } from "../../hooks/useFoldableSections.js"
import { RecordingSection } from "./RecordingSection.jsx"
import { DisplaySection } from "./DisplaySection.jsx"
import { EventFiltersSection } from "./EventFiltersSection.jsx"
import { ROISection } from "./ROISection.jsx"
import { StatisticsSection } from "./StatisticsSection.jsx"
import { EventLogsSection } from "./EventLogsSection.jsx"
import { Container, Header, Title, DragHandle, Content } from "./ControlPanel.styles.js"

export const ControlPanel = () => {
  const { recording } = useAppContext()

  const [savedRecordings, setSavedRecordings] = useState({})
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const { position, handleMouseDown } = useDraggable({
    x: window.innerWidth - 340,
    y: 20,
  })

  const { foldedSections, toggleSection } = useFoldableSections()

  useEffect(() => {
    const recordings = storage.getRecordings()
    setSavedRecordings(recordings)
  }, [])

  useEffect(() => {
    if (recording.recordedEvents.length === 0) {
      const recordings = storage.getRecordings()
      setSavedRecordings(recordings)
    }
  }, [recording.recordedEvents])

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <Container position={position} opacity={0.95} data-testid="control-panel">
      <Header onMouseDown={handleMouseDown}>
        <Title>Control Panel</Title>
        <DragHandle>⋮⋮</DragHandle>
      </Header>

      <Content>
        <RecordingSection
          savedRecordings={savedRecordings}
          folded={foldedSections.recording}
          onToggle={() => toggleSection("recording")}
        />

        <DisplaySection folded={foldedSections.display} onToggle={() => toggleSection("display")} />

        <EventFiltersSection
          folded={foldedSections.filters}
          onToggle={() => toggleSection("filters")}
        />

        <ROISection
          windowDimensions={windowDimensions}
          folded={foldedSections.roi}
          onToggle={() => toggleSection("roi")}
        />

        <StatisticsSection
          folded={foldedSections.statistics}
          onToggle={() => toggleSection("statistics")}
        />

        <EventLogsSection folded={foldedSections.logs} onToggle={() => toggleSection("logs")} />
      </Content>
    </Container>
  )
}
