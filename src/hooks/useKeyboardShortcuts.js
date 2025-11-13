import { useEffect, useCallback } from "react"

export const useKeyboardShortcuts = ({ onSpacebarToggle, onEscape, isSelecting }) => {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.code === "Space" && !e.target.matches("input, textarea, button")) {
        e.preventDefault()
        onSpacebarToggle?.()
      }

      if (e.key === "Escape" && isSelecting) {
        onEscape?.()
      }
    },
    [onSpacebarToggle, onEscape, isSelecting],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])
}
