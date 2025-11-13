import {
  Checkbox,
  FilterLabel,
  Section,
  SectionHeader,
  SectionTitle,
  FoldIcon,
  FoldedContent,
} from "./ControlPanel.styles.js"
import { useAppContext } from ".././AppContext"

export const EventFiltersSection = ({ folded, onToggle }) => {
  const { filterTypes, handleFilterChange } = useAppContext()
  return (
    <Section>
      <SectionHeader onClick={onToggle}>
        <SectionTitle>Event Filters</SectionTitle>
        <FoldIcon folded={folded}>▼</FoldIcon>
      </SectionHeader>

      <FoldedContent folded={folded}>
        {Object.entries(filterTypes).map(([type, enabled]) => (
          <FilterLabel key={type} eventType={type} enabled={enabled}>
            <Checkbox
              type="checkbox"
              checked={enabled}
              onChange={(e) => handleFilterChange(type, e.target.checked)}
              onMouseDown={(e) => e.stopPropagation()}
            />
            <span>{type}</span>
          </FilterLabel>
        ))}
      </FoldedContent>
    </Section>
  )
}
