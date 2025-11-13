import {
  StatItem,
  StatLabel,
  StatValue,
  EventTypesHeader,
  NoEventsMessage,
  Section,
  SectionHeader,
  SectionTitle,
  FoldIcon,
  FoldedContent,
} from "./ControlPanel.styles.js"
import { useAppContext } from ".././AppContext"

export const StatisticsSection = ({ folded, onToggle }) => {
  const { recording } = useAppContext()
  const formatDuration = (duration) => {
    if (duration === 0) return "0ms"
    if (duration < 1000) return `${duration}ms`
    return `${(duration / 1000).toFixed(2)}s`
  }

  return (
    <Section>
      <SectionHeader onClick={onToggle}>
        <SectionTitle>Statistics</SectionTitle>
        <FoldIcon folded={folded}>▼</FoldIcon>
      </SectionHeader>

      <FoldedContent folded={folded}>
        <StatItem>
          <StatLabel>Total Events:</StatLabel>
          <StatValue>{recording.statistics.totalEvents || 0}</StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>Duration:</StatLabel>
          <StatValue>{formatDuration(recording.statistics.duration || 0)}</StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>Frequency:</StatLabel>
          <StatValue>
            {(recording.statistics.averageFrequency || 0).toFixed(1)} events/sec
          </StatValue>
        </StatItem>

        {recording.statistics.eventTypes &&
          Object.keys(recording.statistics.eventTypes).length > 0 && (
            <div>
              <EventTypesHeader>Event Types:</EventTypesHeader>
              {Object.entries(recording.statistics.eventTypes).map(([type, count]) => (
                <StatItem key={type}>
                  <StatLabel eventType={type}>{type}:</StatLabel>
                  <StatValue>{count}</StatValue>
                </StatItem>
              ))}
            </div>
          )}

        {(!recording.statistics.totalEvents || recording.statistics.totalEvents === 0) && (
          <NoEventsMessage>No events recorded yet</NoEventsMessage>
        )}
      </FoldedContent>
    </Section>
  )
}
