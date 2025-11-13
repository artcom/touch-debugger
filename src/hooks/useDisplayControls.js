import { useState } from "react"

const searchParams = new URL(window.location.href).searchParams

export const useDisplayControls = () => {
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [showControlPanel, setShowControlPanel] = useState(searchParams.has("controls"))
  const [eventOpacity, setEventOpacity] = useState(1.0)
  const [eventLifetime, setEventLifetime] = useState(3000)
  const [logsOpacity, setLogsOpacity] = useState(0.8)

  return {
    showHeatmap,
    setShowHeatmap,
    showControlPanel,
    setShowControlPanel,
    eventOpacity,
    setEventOpacity,
    eventLifetime,
    setEventLifetime,
    logsOpacity,
    setLogsOpacity,
  }
}
