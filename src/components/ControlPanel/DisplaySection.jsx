import { useState } from "react"
import {
  SliderContainer,
  SliderLabel,
  Slider,
  Checkbox,
  FilterLabel,
  Section,
  SectionHeader,
  SectionTitle,
  FoldIcon,
  FoldedContent,
} from "./ControlPanel.styles.js"
import { useAppContext } from ".././AppContext"

export const DisplaySection = ({ folded, onToggle }) => {
  const {
    showHeatmap,
    eventOpacity,
    eventLifetime,
    setShowHeatmap,
    setEventOpacity,
    setEventLifetime,
  } = useAppContext()
  const [panelOpacity, setPanelOpacity] = useState(0.2)

  return (
    <Section>
      <SectionHeader onClick={onToggle}>
        <SectionTitle>Display</SectionTitle>
        <FoldIcon folded={folded}>▼</FoldIcon>
      </SectionHeader>

      <FoldedContent folded={folded}>
        <SliderContainer>
          <SliderLabel>
            <span>Panel Opacity</span>
            <span>{(panelOpacity * 100).toFixed(0)}%</span>
          </SliderLabel>
          <Slider
            variant="opacity"
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={panelOpacity}
            onChange={(e) => setPanelOpacity(parseFloat(e.target.value))}
            onMouseDown={(e) => e.stopPropagation()}
          />
        </SliderContainer>

        <SliderContainer>
          <SliderLabel>
            <span>Heatmap</span>
            <FilterLabel>
              <Checkbox
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
                onMouseDown={(e) => e.stopPropagation()}
              />
            </FilterLabel>
          </SliderLabel>
        </SliderContainer>

        <SliderContainer>
          <SliderLabel>
            <span>Event Opacity</span>
            <span>{(eventOpacity * 100).toFixed(0)}%</span>
          </SliderLabel>
          <Slider
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={eventOpacity}
            onChange={(e) => setEventOpacity(parseFloat(e.target.value))}
            onMouseDown={(e) => e.stopPropagation()}
          />
        </SliderContainer>

        <SliderContainer>
          <SliderLabel>
            <span>Event Lifetime</span>
          </SliderLabel>
          <select
            value={eventLifetime === -1 ? "infinite" : eventLifetime}
            onChange={(e) =>
              setEventLifetime(e.target.value === "infinite" ? -1 : parseInt(e.target.value))
            }
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              fontSize: "14px",
            }}
          >
            <option value="500">500ms</option>
            <option value="1000">1s</option>
            <option value="2000">2s</option>
            <option value="3000">3s</option>
            <option value="5000">5s</option>
            <option value="10000">10s</option>
            <option value="infinite">Infinite</option>
          </select>
        </SliderContainer>
      </FoldedContent>
    </Section>
  )
}
