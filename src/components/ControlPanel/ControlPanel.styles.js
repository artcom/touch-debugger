import { styled } from "styled-components"
import { EVENT_COLORS, EVENT_COLORS_RGB } from "../../utils/colorUtils.js"

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) => !["position", "opacity"].includes(prop),
})`
  position: fixed;
  left: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
  background: rgba(0, 0, 0, ${(props) => props.opacity});
  border: 1px solid #333;
  border-radius: 12px;
  padding: 0px;
  font-size: 12px;
  color: rgba(255, 255, 255, ${(props) => props.opacity});
  z-index: 1000;
  min-width: 320px;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 2px solid #333;
  background-color: rgba(255, 255, 0, 0.1);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  cursor: move;
  user-select: none;
`

export const Title = styled.h2`
  margin: 0px;
  font-size: 16px;
  color: rgb(255, 255, 0);
  font-weight: bold;
`

export const DragHandle = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  color: rgb(200, 200, 200);
  cursor: grab;
`

export const Content = styled.div`
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
`

export const Section = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  margin-bottom: 10px;
`

export const SectionTitle = styled.h3`
  margin: 0px;
  font-size: 13px;
  color: rgb(255, 255, 255);
  font-weight: bold;
`

export const FoldIcon = styled.span.withConfig({
  shouldForwardProp: (prop) => !["folded"].includes(prop),
})`
  font-size: 12px;
  color: rgb(200, 200, 200);
  transition: transform 0.2s ease;
  transform: ${(props) => (props.folded ? "rotate(-90deg)" : "rotate(0deg)")};
`

export const FoldedContent = styled.div.withConfig({
  shouldForwardProp: (prop) => !["folded"].includes(prop),
})`
  display: ${(props) => (props.folded ? "none" : "block")};
`

export const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`

export const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => !["variant"].includes(prop),
})`
  padding: 8px 12px;
  border-radius: 6px;
  background: ${(props) => {
    if (props.variant === "record") return "rgba(255, 0, 0, 0.3)"
    if (props.variant === "play") return "rgba(0, 255, 0, 0.3)"
    if (props.variant === "clear") return "rgba(255, 100, 0, 0.3)"
    return "rgba(255, 255, 255, 0.1)"
  }};
  color: white;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-size: 11px;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 70px;
  border: 1px solid
    ${(props) => {
      if (props.variant === "record") return "rgb(255, 0, 0)"
      if (props.variant === "play") return "rgb(0, 255, 0)"
      if (props.variant === "clear") return "rgb(255, 100, 0)"
      return "#555"
    }};
  opacity: ${(props) => (props.disabled ? "0.4" : "1")};

  &:hover {
    background: ${(props) => {
      if (props.disabled) return "rgba(255, 255, 255, 0.1)"
      if (props.variant === "record") return "rgba(255, 0, 0, 0.5)"
      if (props.variant === "play") return "rgba(0, 255, 0, 0.5)"
      if (props.variant === "clear") return "rgba(255, 100, 0, 0.5)"
      return "rgba(255, 255, 255, 0.2)"
    }};
    border: 1px solid ${(props) => (props.disabled ? "#555" : "#777")};
    transform: ${(props) => (props.disabled ? "none" : "translateY(-1px)")};
  }
`

export const Status = styled.div`
  font-size: 10px;
  color: rgb(204, 204, 204);
  font-style: italic;
  text-align: center;
  padding: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  margin-top: 8px;
`

export const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 11px;
`

export const StatLabel = styled.span.withConfig({
  shouldForwardProp: (prop) => !["eventType"].includes(prop),
})`
  font-weight: bold;
  color: ${(props) =>
    props.eventType
      ? EVENT_COLORS_RGB[props.eventType] || "rgb(200, 200, 200)"
      : "rgb(200, 200, 200)"};
`

export const StatValue = styled.span`
  color: rgb(255, 255, 255);
`

export const LogsContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #333;
  border-radius: 6px;
  padding: 12px;
  max-height: 200px;
  overflow-y: auto;
  font-size: 11px;
`

export const LogHeader = styled.h4`
  margin: 0px 0px 8px 0px;
  font-size: 12px;
  color: rgb(255, 255, 0);
  border-bottom: 1px solid #333;
  padding-bottom: 4px;
`

export const LogEntry = styled.div`
  margin-bottom: 4px;
  padding: 2px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 10px;
  line-height: 1.3;
`

export const LogType = styled.span.withConfig({
  shouldForwardProp: (prop) => !["type"].includes(prop),
})`
  display: inline-block;
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 9px;
  font-weight: bold;
  margin-right: 6px;
  background-color: ${(props) => EVENT_COLORS[props.type] || "#888888"};
  color: white;
`

export const SliderContainer = styled.div`
  margin-bottom: 12px;
`

export const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 11px;
  color: rgb(200, 200, 200);
`

export const Slider = styled.input.withConfig({
  shouldForwardProp: (prop) => !["variant"].includes(prop),
})`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: ${(props) => (props.variant === "opacity" ? "rgb(51, 51, 51)" : "#333")};
  outline: none;
  cursor: pointer;
`

export const Checkbox = styled.input`
  margin-right: 8px;
  cursor: pointer;
`

export const FilterLabel = styled.label.withConfig({
  shouldForwardProp: (prop) => !["eventType", "enabled"].includes(prop),
})`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 11px;
  color: ${(props) => EVENT_COLORS_RGB[props.eventType] || "rgb(200, 200, 200)"};
  font-weight: ${(props) => (props.enabled ? "bold" : "normal")};
`

export const EmptyState = styled.div`
  text-align: center;
  color: rgb(150, 150, 150);
  font-style: italic;
  font-size: 10px;
  padding: 20px 0;
`

export const EventTypesHeader = styled.div`
  margin-bottom: 6px;
  font-weight: bold;
  color: rgb(200, 200, 200);
  font-size: 11px;
  margin-top: 12px;
`

export const NoEventsMessage = styled.div`
  font-style: italic;
  text-align: center;
  margin-top: 8px;
  font-size: 10px;
  color: rgb(200, 200, 200);
`

export const LogCoordinates = styled.span`
  color: rgb(200, 200, 200);
`

export const LogTimestamp = styled.span`
  float: right;
  color: rgb(150, 150, 150);
  font-size: 9px;
`
