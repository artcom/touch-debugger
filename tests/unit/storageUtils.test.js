import { jest } from '@jest/globals';
import { storage } from '../../src/utils/storageUtils.js';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock console.error to avoid test output pollution
const originalConsoleError = console.error;

beforeEach(() => {
  console.error = jest.fn();
  localStorageMock.clear();
  // Reset the mock implementation
  localStorageMock.getItem.mockImplementation((key) => localStorageMock.__store[key] || null);
  localStorageMock.setItem.mockImplementation((key, value) => {
    localStorageMock.__store[key] = value;
  });
  localStorageMock.removeItem.mockImplementation((key) => {
    delete localStorageMock.__store[key];
  });
  localStorageMock.clear.mockImplementation(() => {
    localStorageMock.__store = {};
  });
  // Initialize store
  localStorageMock.__store = {};
});

afterEach(() => {
  console.error = originalConsoleError;
});

describe('storageUtils', () => {
  describe('saveRecording', () => {
    const mockRecording = {
      id: 'test-recording-1',
      startTime: Date.now(),
      events: { event1: { type: 'pointerdown' } },
    };

    it('should save a recording successfully', () => {
      const result = storage.saveRecording(mockRecording);
      
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pointer-events-recordings',
        expect.stringContaining('"test-recording-1"')
      );
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage quota exceeded');
      });

      const result = storage.saveRecording(mockRecording);
      
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to save recording:',
        expect.any(Error)
      );
    });
  });

  describe('getRecordings', () => {
    it('should return empty object when no recordings exist', () => {
      const result = storage.getRecordings();
      
      expect(result).toEqual({});
      expect(localStorageMock.getItem).toHaveBeenCalledWith('pointer-events-recordings');
    });

    it('should return recordings when they exist', () => {
      const mockRecordings = {
        'recording-1': { id: 'recording-1', events: [] },
        'recording-2': { id: 'recording-2', events: [] },
      };
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockRecordings));

      const result = storage.getRecordings();
      
      expect(result).toEqual(mockRecordings);
    });

    it('should handle JSON parse errors gracefully', () => {
      localStorageMock.getItem.mockReturnValueOnce('invalid json');

      const result = storage.getRecordings();
      
      expect(result).toEqual({});
      expect(console.error).toHaveBeenCalledWith(
        'Failed to get recordings:',
        expect.any(Error)
      );
    });
  });

  describe('getRecording', () => {
    beforeEach(() => {
      const mockRecordings = {
        'recording-1': { id: 'recording-1', events: [] },
        'recording-2': { id: 'recording-2', events: [] },
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockRecordings));
    });

    it('should return specific recording by ID', () => {
      const result = storage.getRecording('recording-1');
      
      expect(result).toEqual({ id: 'recording-1', events: [] });
    });

    it('should return null for non-existent recording', () => {
      const result = storage.getRecording('non-existent');
      
      expect(result).toBe(null);
    });
  });

  describe('deleteRecording', () => {
    beforeEach(() => {
      const mockRecordings = {
        'recording-1': { id: 'recording-1', events: [] },
        'recording-2': { id: 'recording-2', events: [] },
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockRecordings));
    });

    it('should delete recording successfully', () => {
      const result = storage.deleteRecording('recording-1');
      
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pointer-events-recordings',
        expect.stringContaining('"recording-2"')
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pointer-events-recordings',
        expect.not.stringContaining('"recording-1"')
      );
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const result = storage.deleteRecording('recording-1');
      
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to delete recording:',
        expect.any(Error)
      );
    });
  });

  describe('clearRecordings', () => {
    it('should clear all recordings successfully', () => {
      const result = storage.clearRecordings();
      
      expect(result).toBe(true);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('pointer-events-recordings');
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.removeItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const result = storage.clearRecordings();
      
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to clear recordings:',
        expect.any(Error)
      );
    });
  });

  describe('saveSettings', () => {
    const mockSettings = {
      logsOpacity: 0.8,
      showHeatmap: true,
      eventOpacity: 0.7,
    };

    it('should save settings successfully', () => {
      const result = storage.saveSettings(mockSettings);
      
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pointer-events-settings',
        JSON.stringify(mockSettings)
      );
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const result = storage.saveSettings(mockSettings);
      
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to save settings:',
        expect.any(Error)
      );
    });
  });

  describe('getSettings', () => {
    it('should return empty object when no settings exist', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);
      const result = storage.getSettings();
      
      expect(result).toEqual({});
      expect(localStorageMock.getItem).toHaveBeenCalledWith('pointer-events-settings');
    });

    it('should return settings when they exist', () => {
      const mockSettings = { logsOpacity: 0.8, showHeatmap: true };
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockSettings));

      const result = storage.getSettings();
      
      expect(result).toEqual(mockSettings);
    });

    it('should handle JSON parse errors gracefully', () => {
      localStorageMock.getItem.mockReturnValueOnce('invalid json');

      const result = storage.getSettings();
      
      expect(result).toEqual({});
      expect(console.error).toHaveBeenCalledWith(
        'Failed to get settings:',
        expect.any(Error)
      );
    });
  });

  describe('saveROI', () => {
    const mockROI = { x: 100, y: 200, width: 300, height: 400 };

    it('should save ROI successfully', () => {
      const result = storage.saveROI(mockROI);
      
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pointer-events-roi',
        JSON.stringify(mockROI)
      );
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const result = storage.saveROI(mockROI);
      
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to save ROI:',
        expect.any(Error)
      );
    });
  });

  describe('getROI', () => {
    it('should return null when no ROI exists', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);
      const result = storage.getROI();
      
      expect(result).toBe(null);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('pointer-events-roi');
    });

    it('should return ROI when it exists', () => {
      const mockROI = { x: 100, y: 200, width: 300, height: 400 };
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockROI));

      const result = storage.getROI();
      
      expect(result).toEqual(mockROI);
    });

    it('should handle JSON parse errors gracefully', () => {
      localStorageMock.getItem.mockReturnValueOnce('invalid json');

      const result = storage.getROI();
      
      expect(result).toBe(null);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to get ROI:',
        expect.any(Error)
      );
    });
  });

  describe('clearROI', () => {
    it('should clear ROI successfully', () => {
      const result = storage.clearROI();
      
      expect(result).toBe(true);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('pointer-events-roi');
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.removeItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const result = storage.clearROI();
      
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to clear ROI:',
        expect.any(Error)
      );
    });
  });

  describe('getStorageInfo', () => {
    it('should return storage information', () => {
      // Mock some data in localStorage
      localStorageMock.getItem.mockImplementation((key) => {
        const data = {
          'pointer-events-recordings': '{"rec1": {}, "rec2": {}}',
          'pointer-events-settings': '{"opacity": 0.8}',
          'pointer-events-roi': '{"x": 100, "y": 200}',
        };
        return data[key] || null;
      });

      const result = storage.getStorageInfo();
      
      expect(result).toHaveProperty('totalSize');
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('maxSize', 5 * 1024 * 1024);
      expect(result.items).toHaveProperty('pointer-events-recordings');
      expect(result.items).toHaveProperty('pointer-events-settings');
      expect(result.items).toHaveProperty('pointer-events-roi');
    });

    it('should handle storage info errors gracefully', () => {
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const result = storage.getStorageInfo();
      
      expect(result).toEqual({
        totalSize: 0,
        items: {},
        maxSize: 5 * 1024 * 1024,
      });
      expect(console.error).toHaveBeenCalledWith(
        'Failed to get storage info:',
        expect.any(Error)
      );
    });
  });

  describe('clearAll', () => {
    it('should clear all data successfully', () => {
      const result = storage.clearAll();
      
      expect(result).toBe(true);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('pointer-events-recordings');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('pointer-events-settings');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('pointer-events-roi');
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.removeItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      const result = storage.clearAll();
      
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to clear all data:',
        expect.any(Error)
      );
    });
  });
});
