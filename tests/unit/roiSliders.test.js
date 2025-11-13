import { renderHook, act } from '@testing-library/react';
import { useROISelector } from '../../src/hooks/useROISelector.js';

describe('ROI Slider Functionality', () => {
  test('should initialize with default slider values', () => {
    const { result } = renderHook(() => useROISelector());
    
    expect(result.current.roiSliders).toEqual({
      x: 0,
      y: 0,
      width: 0,
      height: 0
    });
  });

  test('should update ROI from slider values', () => {
    const { result } = renderHook(() => useROISelector());
    
    act(() => {
      result.current.updateROIFromSliders({
        x: 100,
        y: 50,
        width: 200,
        height: 150
      });
    });

    expect(result.current.roi).toEqual({
      x: 100,
      y: 50,
      width: 200,
      height: 150
    });

    expect(result.current.roiSliders).toEqual({
      x: 100,
      y: 50,
      width: 200,
      height: 150
    });
  });

  test('should not set ROI when width or height is zero', () => {
    const { result } = renderHook(() => useROISelector());
    
    act(() => {
      result.current.updateROIFromSliders({
        left: 100,
        top: 50,
        width: 0,
        height: 150
      });
    });

    expect(result.current.roi).toBeNull();
  });

  test('should update sliders when ROI is set via selection', () => {
    const { result } = renderHook(() => useROISelector());
    
    act(() => {
      result.current.startSelection(10, 20);
    });

    act(() => {
      result.current.updateSelection(210, 170);
    });

    act(() => {
      result.current.finishSelection();
    });

    expect(result.current.roi).toEqual({
      x: 10,
      y: 20,
      width: 200,
      height: 150
    });

    expect(result.current.roiSliders).toEqual({
      x: 10,
      y: 20,
      width: 200,
      height: 150
    });
  });

  test('should reset sliders when ROI is cleared', () => {
    const { result } = renderHook(() => useROISelector());
    
    // First set an ROI
    act(() => {
      result.current.updateROIFromSliders({
        left: 100,
        top: 50,
        width: 200,
        height: 150
      });
    });

    expect(result.current.roi).not.toBeNull();

    // Then clear it
    act(() => {
      result.current.clearROI();
    });

    expect(result.current.roi).toBeNull();
    expect(result.current.roiSliders).toEqual({
      left: 0,
      top: 0,
      width: 0,
      height: 0
    });
  });
});
