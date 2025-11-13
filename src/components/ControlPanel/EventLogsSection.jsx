import {
  LogsContainer,
  LogHeader,
  LogEntry,
  LogType,
  LogCoordinates,
  LogTimestamp,
  EmptyState,
  Section,
  SectionHeader,
  SectionTitle,
  FoldIcon,
  FoldedContent,
} from "./ControlPanel.styles.js"
import { useAppContext } from ".././AppContext"

export const EventLogsSection = ({ folded, onToggle }) => {
  const { liveEvents, filterTypes } = useAppContext()

  const filteredLogEvents = liveEvents.filter((event) => filterTypes[event.type])

  return (
    <Section>
      <SectionHeader onClick={onToggle}>
        <SectionTitle>Event Logs</SectionTitle>
        <FoldIcon folded={folded}>▼</FoldIcon>
      </SectionHeader>

      <FoldedContent folded={folded}>
        <LogsContainer>
          <LogHeader>Recent Events ({filteredLogEvents.length})</LogHeader>

          {filteredLogEvents.length === 0 ? (
            <EmptyState>
              {liveEvents.length === 0
                ? "No events yet. Start recording or interact with the screen."
                : "No events match current filters. Adjust filters to see events."}
            </EmptyState>
          ) : (
            filteredLogEvents
              .slice(-20)
              .reverse()
              .map((event, index) => (
                <LogEntry key={index}>
                  <LogType type={event.type}>{event.type}</LogType>
                  <LogCoordinates>
                    x: {event.x?.toFixed(0) || "N/A"}, y: {event.y?.toFixed(0) || "N/A"}
                  </LogCoordinates>
                  <LogTimestamp>{new Date(event.timestamp).toLocaleTimeString()}</LogTimestamp>
                </LogEntry>
              ))
          )}
        </LogsContainer>
      </FoldedContent>
    </Section>
  )
}
