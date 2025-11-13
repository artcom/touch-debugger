import {
  ButtonContainer,
  Button,
  Status,
  Section,
  SectionHeader,
  SectionTitle,
  FoldIcon,
  FoldedContent,
  SliderContainer,
  SliderLabel,
  Slider,
} from "./ControlPanel.styles.js"
import { useAppContext } from ".././AppContext"

export const ROISection = ({ windowDimensions, folded, onToggle }) => {
  const { roi, isSelecting, roiSliders, startSelection, clearROI, handleROISliderChange } =
    useAppContext()
  const getROIStatus = () => {
    if (isSelecting) return "🟡 Click and drag to select ROI..."
    if (roi) return `ROI: ${roi.width}×${roi.height} at (${roi.x}, ${roi.y})`
    return "No ROI defined"
  }

  return (
    <Section>
      <SectionHeader onClick={onToggle}>
        <SectionTitle>Region of Interest</SectionTitle>
        <FoldIcon folded={folded}>▼</FoldIcon>
      </SectionHeader>

      <FoldedContent folded={folded}>
        <ButtonContainer>
          <Button
            data-testid="define-roi-button"
            variant="record"
            onClick={startSelection}
            disabled={isSelecting}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {isSelecting ? "Selecting..." : "Define ROI"}
          </Button>

          <Button
            data-testid="clear-roi-button"
            variant="clear"
            onClick={clearROI}
            disabled={!roi}
            onMouseDown={(e) => e.stopPropagation()}
          >
            🗑 Clear
          </Button>
        </ButtonContainer>

        <Status>{getROIStatus()}</Status>

        {roi && (
          <div>
            <SliderContainer>
              <SliderLabel>
                <span>X</span>
                <span>{roiSliders.x}px</span>
              </SliderLabel>
              <Slider
                type="range"
                min="0"
                max={Math.max(1, windowDimensions.width - roiSliders.width)}
                value={roiSliders.x}
                onChange={(e) => handleROISliderChange("x", e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
              />
            </SliderContainer>

            <SliderContainer>
              <SliderLabel>
                <span>Y</span>
                <span>{roiSliders.y}px</span>
              </SliderLabel>
              <Slider
                type="range"
                min="0"
                max={Math.max(1, windowDimensions.height - roiSliders.height)}
                value={roiSliders.y}
                onChange={(e) => handleROISliderChange("y", e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
              />
            </SliderContainer>

            <SliderContainer>
              <SliderLabel>
                <span>Width</span>
                <span>{roiSliders.width}px</span>
              </SliderLabel>
              <Slider
                type="range"
                min="0"
                max={Math.max(1, windowDimensions.width - roiSliders.x)}
                value={roiSliders.width}
                onChange={(e) => handleROISliderChange("width", e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
              />
            </SliderContainer>

            <SliderContainer>
              <SliderLabel>
                <span>Height</span>
                <span>{roiSliders.height}px</span>
              </SliderLabel>
              <Slider
                type="range"
                min="0"
                max={Math.max(1, windowDimensions.height - roiSliders.y)}
                value={roiSliders.height}
                onChange={(e) => handleROISliderChange("height", e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
              />
            </SliderContainer>
          </div>
        )}
      </FoldedContent>
    </Section>
  )
}
