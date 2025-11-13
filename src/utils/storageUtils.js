const STORAGE_KEYS = {
  RECORDINGS: "pointer-events-recordings",
  SETTINGS: "pointer-events-settings",
  ROI: "pointer-events-roi",
}

export const storage = {
  saveRecording(recording) {
    try {
      const recordings = this.getRecordings()
      recordings[recording.id] = recording
      localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(recordings))
      return true
    } catch (error) {
      console.error("Failed to save recording:", error)
      return false
    }
  },

  getRecordings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RECORDINGS)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error("Failed to get recordings:", error)
      return {}
    }
  },

  getRecording(id) {
    const recordings = this.getRecordings()
    return recordings[id] || null
  },

  deleteRecording(id) {
    try {
      const recordings = this.getRecordings()
      delete recordings[id]
      localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(recordings))
      return true
    } catch (error) {
      console.error("Failed to delete recording:", error)
      return false
    }
  },

  clearRecordings() {
    try {
      localStorage.removeItem(STORAGE_KEYS.RECORDINGS)
      return true
    } catch (error) {
      console.error("Failed to clear recordings:", error)
      return false
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
      return true
    } catch (error) {
      console.error("Failed to save settings:", error)
      return false
    }
  },

  getSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error("Failed to get settings:", error)
      return {}
    }
  },

  saveROI(roi) {
    try {
      localStorage.setItem(STORAGE_KEYS.ROI, JSON.stringify(roi))
      return true
    } catch (error) {
      console.error("Failed to save ROI:", error)
      return false
    }
  },

  getROI() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ROI)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error("Failed to get ROI:", error)
      return null
    }
  },

  clearROI() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ROI)
      return true
    } catch (error) {
      console.error("Failed to clear ROI:", error)
      return false
    }
  },

  getStorageInfo() {
    try {
      let totalSize = 0
      const items = {}

      Object.values(STORAGE_KEYS).forEach((key) => {
        const item = localStorage.getItem(key)
        if (item) {
          const size = new Blob([item]).size
          totalSize += size
          items[key] = {
            size,
            itemCount: item
              ? key === STORAGE_KEYS.RECORDINGS
                ? Object.keys(JSON.parse(item)).length
                : 1
              : 0,
          }
        }
      })

      return {
        totalSize,
        items,
        maxSize: 5 * 1024 * 1024,
      }
    } catch (error) {
      console.error("Failed to get storage info:", error)
      return { totalSize: 0, items: {}, maxSize: 5 * 1024 * 1024 }
    }
  },

  clearAll() {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
      return true
    } catch (error) {
      console.error("Failed to clear all data:", error)
      return false
    }
  },
}
