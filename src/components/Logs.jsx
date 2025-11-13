import { styled } from "styled-components"
import { EVENT_COLORS_RGB } from "../utils/colorUtils.js"

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

const formatCoordinates = (x, y) => {
  const xCoord = x !== undefined ? Math.round(x) : "--"
  const yCoord = y !== undefined ? Math.round(y) : "--"
  return `x: ${xCoord}, y: ${yCoord}`
}

const LogsContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
  font-size: 12px;
  color: rgb(255, 255, 255);
  z-index: 1001;
  min-width: 200px;
  opacity: ${(props) => props.opacity};
`

const Title = styled.h3`
  margin: 0px 0px 12px 0px;
  font-size: 14px;
  color: rgb(255, 255, 0);
  border-bottom: 1px solid #333;
  padding-bottom: 8px;
`

const EmptyState = styled.div`
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
`

const LogEntry = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "eventType",
})`
  margin-bottom: 8px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  border-left: 3px solid ${(props) => EVENT_COLORS_RGB[props.eventType] || "rgb(128, 128, 128)"};
`

const EventType = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "eventType",
})`
  color: ${(props) => EVENT_COLORS_RGB[props.eventType] || "rgb(128, 128, 128)"};
  font-weight: bold;
  text-transform: uppercase;
`

const Coordinates = styled.span`
  color: #ccc;
  margin-left: 8px;
`

const Timestamp = styled.div`
  color: #888;
  font-size: 10px;
  margin-top: 2px;
`

export const Logs = ({ events = [], opacity = 0.8 }) => {
  const recentEvents = [...events].reverse().slice(0, 50)

  if (recentEvents.length === 0) {
    return (
      <LogsContainer opacity={opacity} data-testid="logs-container">
        <Title>Event Logs</Title>
        <EmptyState>No events to display</EmptyState>
      </LogsContainer>
    )
  }

  return (
    <LogsContainer opacity={opacity} data-testid="logs-container">
      <Title>Event Logs</Title>
      {recentEvents.map((event, index) => (
        <LogEntry
          key={`${event.timestamp}-${event.pointerId}-${index}`}
          eventType={event.type}
          data-testid={`log-entry-${index}`}
        >
          <EventType eventType={event.type}>{event.type}</EventType>
          <Coordinates>{formatCoordinates(event.x, event.y)}</Coordinates>
          <Timestamp data-testid={`timestamp-${index}`}>
            {formatTimestamp(event.timestamp)}
          </Timestamp>
        </LogEntry>
      ))}
    </LogsContainer>
  )
}
