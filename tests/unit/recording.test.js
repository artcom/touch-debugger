import { renderHook, act } from '@testing-library/react';
import { jest } from '@jest/globals';
import { useRecording } from '../../src/hooks/useRecording.js';

// Mock setTimeout and clearTimeout for testing playback
const mockSetTimeout = jest.fn();
const mockClearTimeout = jest.fn();

global.setTimeout = mockSetTimeout;
global.clearTimeout = mockClearTimeout;

describe('useRecording Hook', () => {
  const mockEvents = [
    {
      type: 'pointerdown',
      x: 100,
      y: 200,
      pointerId: 1,
      timestamp: 1234567890,
    },
    {
      type: 'pointerup',
      x: 100,
      y: 200,
      pointerId: 1,
      timestamp: 1234567891,
    },
    {
      type: 'pointermove',
      x: 150,
      y: 250,
      pointerId: 1,
      timestamp: 1234567892,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetTimeout.mockImplementation((callback, delay) => {
      return setTimeout(callback, 0); // Execute immediately for testing
    });
  });

  it('should initialize with default recording state', () => {
    const { result } = renderHook(() => useRecording([]));

    expect(result.current.isRecording).toBe(false);
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.recordedEvents).toEqual([]);
    expect(result.current.statistics).toEqual({
      totalEvents: 0,
      eventTypes: {},
      duration: 0,
      averageFrequency: 0,
    });
  });

  it('should start recording when startRecording is called', () => {
    const { result } = renderHook(() => useRecording([]));

    act(() => {
      result.current.startRecording();
    });

    expect(result.current.isRecording).toBe(true);
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.recordedEvents).toEqual([]);
  });

  it('should stop recording when stopRecording is called', () => {
    const { result } = renderHook(() => useRecording([]));

    act(() => {
      result.current.startRecording();
    });

    act(() => {
      result.current.stopRecording();
    });

    expect(result.current.isRecording).toBe(false);
    expect(result.current.isPlaying).toBe(false);
  });

  it('should record events when recording is active', () => {
    const { result } = renderHook(() => useRecording(null));

    // Start recording
    act(() => {
      result.current.startRecording();
    });

    // Add events using addEvent method
    act(() => {
      mockEvents.forEach(event => {
        result.current.addEvent(event);
      });
    });

    // Stop recording
    act(() => {
      result.current.stopRecording();
    });

    expect(result.current.recordedEvents).toEqual(mockEvents);
    expect(result.current.statistics.totalEvents).toBe(mockEvents.length);
  });

  it('should not record events when recording is stopped', () => {
    const { result } = renderHook(() => useRecording(null));

    // Don't start recording, just add events
    act(() => {
      mockEvents.forEach(event => {
        result.current.addEvent(event);
      });
    });

    expect(result.current.recordedEvents).toEqual([]);
    expect(result.current.statistics.totalEvents).toBe(0);
  });

  it('should calculate statistics correctly', () => {
    const { result } = renderHook(() => useRecording(null));

    act(() => {
      result.current.startRecording();
    });

    act(() => {
      mockEvents.forEach(event => {
        result.current.addEvent(event);
      });
    });

    act(() => {
      result.current.stopRecording();
    });

    const stats = result.current.statistics;
    expect(stats.totalEvents).toBe(3);
    expect(stats.eventTypes).toEqual({
      pointerdown: 1,
      pointerup: 1,
      pointermove: 1,
    });
    expect(stats.duration).toBeGreaterThan(0);
    expect(stats.averageFrequency).toBeGreaterThan(0);
  });

  it('should start playback when startPlayback is called', () => {
    const { result } = renderHook(() => useRecording(null));

    // First add some events
    act(() => {
      mockEvents.forEach(event => {
        result.current.addEvent(event);
      });
    });

    act(() => {
      result.current.startPlayback();
    });

    expect(result.current.isRecording).toBe(false);
  });

  it('should stop playback when stopPlayback is called', () => {
    const { result } = renderHook(() => useRecording(null));

    // First add some events and start playback
    act(() => {
      mockEvents.forEach(event => {
        result.current.addEvent(event);
      });
    });

    act(() => {
      result.current.startPlayback();
    });

    act(() => {
      result.current.stopPlayback();
    });

    expect(result.current.isRecording).toBe(false);
  });

  it('should clear recording when clearRecording is called', () => {
    const { result } = renderHook(() => useRecording(null));

    // Record some events
    act(() => {
      result.current.startRecording();
    });

    act(() => {
      mockEvents.forEach(event => {
        result.current.addEvent(event);
      });
    });

    act(() => {
      result.current.stopRecording();
    });

    expect(result.current.recordedEvents).toEqual(mockEvents);

    // Clear recording
    act(() => {
      result.current.clearRecording();
    });

    expect(result.current.recordedEvents).toEqual([]);
    expect(result.current.statistics.totalEvents).toBe(0);
  });

  it('should not start playback if no recorded events', () => {
    const { result } = renderHook(() => useRecording(null));

    act(() => {
      result.current.startPlayback();
    });

    expect(result.current.isPlaying).toBe(false);
    expect(mockSetTimeout).not.toHaveBeenCalled();
  });

  it('should handle duplicate events during recording', () => {
    const duplicateEvents = [
      ...mockEvents,
      mockEvents[0], // Duplicate first event
    ];

    const { result } = renderHook(() => useRecording(null));

    act(() => {
      result.current.startRecording();
    });

    act(() => {
      duplicateEvents.forEach(event => {
        result.current.addEvent(event);
      });
    });

    act(() => {
      result.current.stopRecording();
    });

    expect(result.current.recordedEvents).toEqual(duplicateEvents);
    expect(result.current.statistics.totalEvents).toBe(4);
  });

  it('should handle empty events array during recording', () => {
    const { result, rerender } = renderHook(
      ({ events }) => useRecording(events),
      { initialProps: { events: [] } }
    );

    act(() => {
      result.current.startRecording();
    });

    rerender({ events: [] });

    act(() => {
      result.current.stopRecording();
    });

    expect(result.current.recordedEvents).toEqual([]);
    expect(result.current.statistics.totalEvents).toBe(0);
  });

  it('should calculate duration correctly for single event', () => {
    const singleEvent = [mockEvents[0]];

    const { result, rerender } = renderHook(
      ({ events }) => useRecording(events),
      { initialProps: { events: [] } }
    );

    act(() => {
      result.current.startRecording();
    });

    rerender({ events: singleEvent });

    act(() => {
      result.current.stopRecording();
    });

    expect(result.current.statistics.duration).toBe(0);
    expect(result.current.statistics.averageFrequency).toBe(0);
  });
});
