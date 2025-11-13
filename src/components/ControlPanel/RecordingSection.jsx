import {
  ButtonContainer,
  Button,
  Status,
  Section,
  SectionHeader,
  SectionTitle,
  FoldIcon,
  FoldedContent,
} from "./ControlPanel.styles.js"
import { useAppContext } from ".././AppContext"

export const RecordingSection = ({ savedRecordings, folded, onToggle }) => {
  const { recording } = useAppContext()
  const getRecordingStatus = () => {
    if (recording.isRecording) return "🔴 Recording..."
    if (recording.isPlaying) return "▶️ Playing..."

    if (recording.recordedEvents.length > 0)
      return `✅ ${recording.recordedEvents.length} events recorded`

    const savedCount = Object.values(savedRecordings).reduce(
      (sum, rec) => sum + (rec.events?.length || 0),
      0,
    )
    if (savedCount > 0) return `📁 ${savedCount} saved events`

    return "Ready to record"
  }

  const hasRecordings =
    recording.recordedEvents.length > 0 || Object.keys(savedRecordings).length > 0

  return (
    <Section>
      <SectionHeader onClick={onToggle}>
        <SectionTitle>Recording</SectionTitle>
        <FoldIcon folded={folded}>▼</FoldIcon>
      </SectionHeader>

      <FoldedContent folded={folded}>
        <ButtonContainer>
          {recording.isRecording ? (
            <Button
              data-testid="stop-record-button"
              variant="record"
              onClick={recording.stopRecording}
              onMouseDown={(e) => e.stopPropagation()}
            >
              ■ Stop
            </Button>
          ) : (
            <Button
              data-testid="record-button"
              variant="record"
              onClick={recording.startRecording}
              onMouseDown={(e) => e.stopPropagation()}
            >
              ● Record
            </Button>
          )}

          {recording.isPlaying ? (
            <Button
              data-testid="stop-play-button"
              variant="play"
              onClick={recording.stopPlayback}
              onMouseDown={(e) => e.stopPropagation()}
            >
              ■ Stop
            </Button>
          ) : (
            <Button
              data-testid="play-button"
              variant="play"
              onClick={recording.startPlayback}
              disabled={recording.isRecording || !hasRecordings}
              onMouseDown={(e) => e.stopPropagation()}
            >
              ▶ Play
            </Button>
          )}

          <Button
            data-testid="clear-button"
            variant="clear"
            onClick={recording.clearRecording}
            disabled={!hasRecordings}
            onMouseDown={(e) => e.stopPropagation()}
          >
            Clear
          </Button>
        </ButtonContainer>

        <Status>{getRecordingStatus()}</Status>
      </FoldedContent>
    </Section>
  )
}
