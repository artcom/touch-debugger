import { jest } from '@jest/globals';
import {
  POINTER_EVENT_TYPES,
  EVENT_COLORS,
  createPointerEvent,
  createRecording,
  createRegionOfInterest,
  isPointInRegion,
} from '../../src/utils/eventTypes.js';

// Mock window for testing
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

describe('eventTypes', () => {
  describe('POINTER_EVENT_TYPES', () => {
    it('should have correct event type constants', () => {
      expect(POINTER_EVENT_TYPES).toEqual({
        POINTER_DOWN: 'pointerdown',
        POINTER_UP: 'pointerup',
        POINTER_MOVE: 'pointermove',
        POINTER_ENTER: 'pointerenter',
        POINTER_LEAVE: 'pointerleave',
        CLICK: 'click',
        DRAG_START: 'dragstart',
        DRAG: 'drag',
        DRAG_END: 'dragend',
      });
    });
  });

  describe('EVENT_COLORS', () => {
    it('should have correct color mappings', () => {
      expect(EVENT_COLORS).toEqual({
        pointerdown: '#00ff00',
        pointerup: '#0080ff',
        pointermove: '#ff8000',
        pointerenter: '#ffff00',
        pointerleave: '#ff0000',
        click: '#ff00ff',
        dragstart: '#00ccff',
        drag: '#0099cc',
        dragend: '#006699',
      });
    });
  });

  describe('createPointerEvent', () => {
    const mockEvent = {
      type: 'pointerdown',
      pointerId: 1,
      clientX: 100,
      clientY: 200,
    };

    it('should create a pointer event with correct properties', () => {
      const result = createPointerEvent(mockEvent);
      
      expect(result).toEqual({
        type: 'pointerdown',
        pointerId: 1,
        x: 100,
        y: 200,
        timestamp: expect.any(Number),
        rawEvent: mockEvent,
      });
    });

    it('should include current timestamp', () => {
      const before = Date.now();
      const result = createPointerEvent(mockEvent);
      const after = Date.now();
      
      expect(result.timestamp).toBeGreaterThanOrEqual(before);
      expect(result.timestamp).toBeLessThanOrEqual(after);
    });

    it('should handle different event types', () => {
      const events = [
        { type: 'pointerup', pointerId: 1, clientX: 0, clientY: 0 },
        { type: 'pointermove', pointerId: 2, clientX: 50, clientY: 75 },
        { type: 'pointerenter', pointerId: 3, clientX: 100, clientY: 100 },
        { type: 'pointerleave', pointerId: 4, clientX: 200, clientY: 300 },
      ];

      events.forEach(event => {
        const result = createPointerEvent(event);
        expect(result.type).toBe(event.type);
        expect(result.pointerId).toBe(event.pointerId);
        expect(result.x).toBe(event.clientX);
        expect(result.y).toBe(event.clientY);
        expect(result.rawEvent).toBe(event);
      });
    });

    it('should handle events with negative coordinates', () => {
      const negativeEvent = {
        type: 'pointerdown',
        pointerId: 1,
        clientX: -100,
        clientY: -200,
      };

      const result = createPointerEvent(negativeEvent);
      expect(result.x).toBe(-100);
      expect(result.y).toBe(-200);
    });
  });

  describe('createRecording', () => {
    it('should create a recording with default structure', () => {
      const result = createRecording();
      
      expect(result).toEqual({
        id: expect.stringMatching(/^recording-\d+$/),
        startTime: expect.any(Number),
        endTime: null,
        events: {},
        statistics: {
          totalCount: 0,
          countsByType: {},
          averageInterval: 0,
          sessionDuration: 0,
        },
      });
    });

    it('should create a recording with provided events', () => {
      const events = { 'event1': { type: 'pointerdown' } };
      const result = createRecording(events);
      
      expect(result.events).toBe(events);
      expect(result.id).toMatch(/^recording-\d+$/);
    });

    it('should generate unique IDs for different recordings', () => {
      // Mock Date.now to return different timestamps
      let callCount = 0;
      const originalDateNow = Date.now;
      Date.now = jest.fn(() => {
        callCount++;
        return 1000000000000 + callCount;
      });

      const recording1 = createRecording();
      const recording2 = createRecording();
      
      expect(recording1.id).not.toBe(recording2.id);
      expect(recording1.startTime).toBeLessThan(recording2.startTime);
      
      // Restore original Date.now
      Date.now = originalDateNow;
    });

    it('should include current timestamp as startTime', () => {
      const before = Date.now();
      const result = createRecording();
      const after = Date.now();
      
      expect(result.startTime).toBeGreaterThanOrEqual(before);
      expect(result.startTime).toBeLessThanOrEqual(after);
    });
  });

  describe('createRegionOfInterest', () => {
    it('should create ROI with default window dimensions', () => {
      const result = createRegionOfInterest();
      
      expect(result).toEqual({
        x1: 0,
        y1: 0,
        x2: 1024,
        y2: 768,
      });
    });

    it('should create ROI with provided coordinates', () => {
      const result = createRegionOfInterest(100, 200, 300, 400);
      
      expect(result).toEqual({
        x1: 100,
        y1: 200,
        x2: 300,
        y2: 400,
      });
    });

    it('should handle reversed coordinates', () => {
      const result = createRegionOfInterest(300, 400, 100, 200);
      
      expect(result).toEqual({
        x1: 100,
        y1: 200,
        x2: 300,
        y2: 400,
      });
    });

    it('should handle negative coordinates', () => {
      const result = createRegionOfInterest(-100, -200, -50, -100);
      
      expect(result).toEqual({
        x1: -100,
        y1: -200,
        x2: -50,
        y2: -100,
      });
    });

    it('should handle mixed positive and negative coordinates', () => {
      const result = createRegionOfInterest(-100, 200, 300, -50);
      
      expect(result).toEqual({
        x1: -100,
        y1: -50,
        x2: 300,
        y2: 200,
      });
    });
  });

  describe('isPointInRegion', () => {
    const region = { x1: 100, y1: 200, x2: 300, y2: 400 };

    it('should return true for points inside the region', () => {
      expect(isPointInRegion(150, 250, region)).toBe(true);
      expect(isPointInRegion(200, 300, region)).toBe(true);
      expect(isPointInRegion(299, 399, region)).toBe(true);
    });

    it('should return true for points on the region boundaries', () => {
      expect(isPointInRegion(100, 200, region)).toBe(true);
      expect(isPointInRegion(300, 400, region)).toBe(true);
      expect(isPointInRegion(100, 300, region)).toBe(true);
      expect(isPointInRegion(200, 400, region)).toBe(true);
    });

    it('should return false for points outside the region', () => {
      expect(isPointInRegion(99, 250, region)).toBe(false);
      expect(isPointInRegion(301, 300, region)).toBe(false);
      expect(isPointInRegion(200, 199, region)).toBe(false);
      expect(isPointInRegion(200, 401, region)).toBe(false);
    });

    it('should handle negative coordinates', () => {
      const negativeRegion = { x1: -100, y1: -200, x2: 100, y2: 200 };
      
      expect(isPointInRegion(0, 0, negativeRegion)).toBe(true);
      expect(isPointInRegion(-50, -100, negativeRegion)).toBe(true);
      expect(isPointInRegion(-101, 0, negativeRegion)).toBe(false);
      expect(isPointInRegion(0, -201, negativeRegion)).toBe(false);
    });

    it('should handle zero-size regions', () => {
      const pointRegion = { x1: 100, y1: 200, x2: 100, y2: 200 };
      
      expect(isPointInRegion(100, 200, pointRegion)).toBe(true);
      expect(isPointInRegion(101, 200, pointRegion)).toBe(false);
      expect(isPointInRegion(100, 201, pointRegion)).toBe(false);
    });

    it('should handle single-axis regions', () => {
      const horizontalLine = { x1: 100, y1: 200, x2: 300, y2: 200 };
      const verticalLine = { x1: 100, y1: 200, x2: 100, y2: 400 };
      
      expect(isPointInRegion(200, 200, horizontalLine)).toBe(true);
      expect(isPointInRegion(200, 201, horizontalLine)).toBe(false);
      
      expect(isPointInRegion(100, 300, verticalLine)).toBe(true);
      expect(isPointInRegion(101, 300, verticalLine)).toBe(false);
    });
  });
});
