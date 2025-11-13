import { renderHook, act } from '@testing-library/react';
import { jest } from '@jest/globals';
import { useROISelector } from '../../src/hooks/useROISelector.js';

describe('useROISelector Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with no ROI defined', () => {
    const { result } = renderHook(() => useROISelector());

    expect(result.current.roi).toBeNull();
    expect(result.current.isSelecting).toBe(false);
    expect(result.current.selectionStart).toBeNull();
    expect(result.current.selectionEnd).toBeNull();
  });

  it('should start ROI selection when startSelection is called', () => {
    const { result } = renderHook(() => useROISelector());

    act(() => {
      result.current.startSelection(100, 200);
    });

    expect(result.current.isSelecting).toBe(true);
    expect(result.current.selectionStart).toEqual({ x: 100, y: 200 });
    expect(result.current.selectionEnd).toEqual({ x: 100, y: 200 });
  });

  it('should update selection during selection process', () => {
    const { result } = renderHook(() => useROISelector());

    act(() => {
      result.current.startSelection(100, 200);
    });

    act(() => {
      result.current.updateSelection(150, 250);
    });

    expect(result.current.isSelecting).toBe(true);
    expect(result.current.selectionStart).toEqual({ x: 100, y: 200 });
    expect(result.current.selectionEnd).toEqual({ x: 150, y: 250 });
  });

  it('should complete ROI selection when finishSelection is called', () => {
    const { result } = renderHook(() => useROISelector());

    act(() => {
      result.current.startSelection(100, 200);
    });

    act(() => {
      result.current.updateSelection(150, 250);
    });

    act(() => {
      result.current.finishSelection();
    });

    expect(result.current.isSelecting).toBe(false);
    expect(result.current.roi).toEqual({
      x: 100,
      y: 200,
      width: 50,
      height: 50,
    });
    expect(result.current.selectionStart).toBeNull();
    expect(result.current.selectionEnd).toBeNull();
  });

  it('should handle negative width/height in ROI selection', () => {
    const { result } = renderHook(() => useROISelector());

    act(() => {
      result.current.startSelection(150, 250);
    });

    act(() => {
      result.current.updateSelection(100, 200);
    });

    act(() => {
      result.current.finishSelection();
    });

    expect(result.current.roi).toEqual({
      x: 100,
      y: 200,
      width: 50,
      height: 50,
    });
  });

  it('should cancel ROI selection when cancelSelection is called', () => {
    const { result } = renderHook(() => useROISelector());

    act(() => {
      result.current.startSelection(100, 200);
    });

    act(() => {
      result.current.updateSelection(150, 250);
    });

    act(() => {
      result.current.cancelSelection();
    });

    expect(result.current.isSelecting).toBe(false);
    expect(result.current.roi).toBeNull();
    expect(result.current.selectionStart).toBeNull();
    expect(result.current.selectionEnd).toBeNull();
  });

  it('should clear ROI when clearROI is called', () => {
    const { result } = renderHook(() => useROISelector());

    // Set up an ROI first
    act(() => {
      result.current.startSelection(100, 200);
    });

    act(() => {
      result.current.updateSelection(150, 250);
    });

    act(() => {
      result.current.finishSelection();
    });

    expect(result.current.roi).not.toBeNull();

    // Clear the ROI
    act(() => {
      result.current.clearROI();
    });

    expect(result.current.roi).toBeNull();
  });

  it('should check if point is inside ROI correctly', () => {
    const { result } = renderHook(() => useROISelector());

    // Set up an ROI: x: 100, y: 200, width: 50, height: 50
    act(() => {
      result.current.startSelection(100, 200);
    });

    act(() => {
      result.current.updateSelection(150, 250);
    });

    act(() => {
      result.current.finishSelection();
    });

    // Point inside ROI
    expect(result.current.isPointInROI(125, 225)).toBe(true);
    expect(result.current.isPointInROI(100, 200)).toBe(true);
    expect(result.current.isPointInROI(150, 250)).toBe(true);

    // Point outside ROI
    expect(result.current.isPointInROI(99, 225)).toBe(false);
    expect(result.current.isPointInROI(151, 225)).toBe(false);
    expect(result.current.isPointInROI(125, 199)).toBe(false);
    expect(result.current.isPointInROI(125, 251)).toBe(false);
  });

  it('should return false for isPointInROI when no ROI is defined', () => {
    const { result } = renderHook(() => useROISelector());

    expect(result.current.isPointInROI(100, 200)).toBe(false);
  });

  it('should filter events based on ROI correctly', () => {
    const { result } = renderHook(() => useROISelector());

    // Set up an ROI: x: 100, y: 200, width: 50, height: 50
    act(() => {
      result.current.startSelection(100, 200);
    });

    act(() => {
      result.current.updateSelection(150, 250);
    });

    act(() => {
      result.current.finishSelection();
    });

    const events = [
      { type: 'pointerdown', x: 125, y: 225, pointerId: 1, timestamp: 1234567890 }, // Inside ROI
      { type: 'pointerup', x: 99, y: 225, pointerId: 1, timestamp: 1234567891 },   // Outside ROI
      { type: 'pointermove', x: 150, y: 250, pointerId: 1, timestamp: 1234567892 }, // Inside ROI
      { type: 'pointerenter', x: 200, y: 300, pointerId: 1, timestamp: 1234567893 }, // Outside ROI
    ];

    const filteredEvents = result.current.filterEventsByROI(events);

    expect(filteredEvents).toHaveLength(2);
    expect(filteredEvents[0]).toEqual(events[0]); // Inside ROI
    expect(filteredEvents[1]).toEqual(events[2]); // Inside ROI
  });

  it('should return all events when no ROI is defined', () => {
    const { result } = renderHook(() => useROISelector());

    const events = [
      { type: 'pointerdown', x: 125, y: 225, pointerId: 1, timestamp: 1234567890 },
      { type: 'pointerup', x: 99, y: 225, pointerId: 1, timestamp: 1234567891 },
    ];

    const filteredEvents = result.current.filterEventsByROI(events);

    expect(filteredEvents).toEqual(events);
  });

  it('should handle events with missing coordinates gracefully', () => {
    const { result } = renderHook(() => useROISelector());

    // Set up an ROI
    act(() => {
      result.current.startSelection(100, 200);
    });

    act(() => {
      result.current.updateSelection(150, 250);
    });

    act(() => {
      result.current.finishSelection();
    });

    const events = [
      { type: 'pointerdown', x: 125, y: 225, pointerId: 1, timestamp: 1234567890 }, // Valid
      { type: 'pointerup', pointerId: 1, timestamp: 1234567891 },                   // Missing coordinates
      { type: 'pointermove', x: 150, pointerId: 1, timestamp: 1234567892 },        // Missing y
    ];

    const filteredEvents = result.current.filterEventsByROI(events);

    expect(filteredEvents).toHaveLength(1);
    expect(filteredEvents[0]).toEqual(events[0]); // Only valid event inside ROI
  });

  it('should handle zero-size ROI correctly', () => {
    const { result } = renderHook(() => useROISelector());

    // Create zero-size ROI
    act(() => {
      result.current.startSelection(100, 200);
    });

    act(() => {
      result.current.updateSelection(100, 200);
    });

    act(() => {
      result.current.finishSelection();
    });

    expect(result.current.roi).toEqual({
      x: 100,
      y: 200,
      width: 0,
      height: 0,
    });

    // Events at exact ROI boundary should be included
    const events = [
      { type: 'pointerdown', x: 100, y: 200, pointerId: 1, timestamp: 1234567890 },
    ];

    const filteredEvents = result.current.filterEventsByROI(events);
    expect(filteredEvents).toHaveLength(1);
  });
});
