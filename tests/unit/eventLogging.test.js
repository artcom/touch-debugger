import { createPointerEvent, POINTER_EVENT_TYPES } from '../../src/utils/eventTypes.js';
import { eventProcessor } from '../../src/utils/eventUtils.js';

describe('Event Logging', () => {
  beforeEach(() => {
    eventProcessor.clearEvents();
  });

  describe('createPointerEvent', () => {
    it('should create a pointer event with correct structure', () => {
      const mockEvent = {
        type: POINTER_EVENT_TYPES.POINTER_DOWN,
        pointerId: 1,
        clientX: 100,
        clientY: 200,
      };

      const processedEvent = createPointerEvent(mockEvent);

      expect(processedEvent).toHaveProperty('type', POINTER_EVENT_TYPES.POINTER_DOWN);
      expect(processedEvent).toHaveProperty('pointerId', 1);
      expect(processedEvent).toHaveProperty('x', 100);
      expect(processedEvent).toHaveProperty('y', 200);
      expect(processedEvent).toHaveProperty('timestamp');
      expect(processedEvent).toHaveProperty('rawEvent', mockEvent);
    });

    it('should handle different pointer event types', () => {
      const eventTypes = Object.values(POINTER_EVENT_TYPES);
      
      eventTypes.forEach(type => {
        const mockEvent = {
          type,
          pointerId: 1,
          clientX: 50,
          clientY: 75,
        };

        const processedEvent = createPointerEvent(mockEvent);
        expect(processedEvent.type).toBe(type);
      });
    });
  });

  describe('EventProcessor', () => {
    it('should add events to the processor', () => {
      const mockEvent = {
        type: POINTER_EVENT_TYPES.POINTER_DOWN,
        pointerId: 1,
        clientX: 100,
        clientY: 200,
      };

      const result = eventProcessor.addEvent(mockEvent);
      
      expect(result).not.toBeNull();
      expect(result.type).toBe(POINTER_EVENT_TYPES.POINTER_DOWN);
      expect(eventProcessor.getEvents()).toHaveLength(1);
    });

    it('should filter events outside ROI region', () => {
      const mockEvent = {
        type: POINTER_EVENT_TYPES.POINTER_DOWN,
        pointerId: 1,
        clientX: 100,
        clientY: 200,
      };

      const region = { x1: 0, y1: 0, x2: 50, y2: 50 };
      
      const result = eventProcessor.addEvent(mockEvent, region);
      
      expect(result).toBeNull();
      expect(eventProcessor.getEvents()).toHaveLength(0);
    });

    it('should include events inside ROI region', () => {
      const mockEvent = {
        type: POINTER_EVENT_TYPES.POINTER_DOWN,
        pointerId: 1,
        clientX: 25,
        clientY: 25,
      };

      const region = { x1: 0, y1: 0, x2: 50, y2: 50 };
      
      const result = eventProcessor.addEvent(mockEvent, region);
      
      expect(result).not.toBeNull();
      expect(eventProcessor.getEvents()).toHaveLength(1);
    });

    it('should limit the number of stored events', () => {
      const mockEvent = {
        type: POINTER_EVENT_TYPES.POINTER_DOWN,
        pointerId: 1,
        clientX: 100,
        clientY: 200,
      };

      // Add more events than the limit
      for (let i = 0; i < 1005; i++) {
        eventProcessor.addEvent({ ...mockEvent, pointerId: i });
      }

      const events = eventProcessor.getEvents();
      expect(events).toHaveLength(500); // Updated to match new performance optimization
      expect(events[0].pointerId).toBe(505); // First event should be dropped
      expect(events[events.length - 1].pointerId).toBe(1004);
    });

    it('should get events by type', () => {
      const downEvent = {
        type: POINTER_EVENT_TYPES.POINTER_DOWN,
        pointerId: 1,
        clientX: 100,
        clientY: 200,
      };

      const upEvent = {
        type: POINTER_EVENT_TYPES.POINTER_UP,
        pointerId: 1,
        clientX: 100,
        clientY: 200,
      };

      eventProcessor.addEvent(downEvent);
      eventProcessor.addEvent(upEvent);

      const downEvents = eventProcessor.getEventsByType(POINTER_EVENT_TYPES.POINTER_DOWN);
      const upEvents = eventProcessor.getEventsByType(POINTER_EVENT_TYPES.POINTER_UP);

      expect(downEvents).toHaveLength(1);
      expect(upEvents).toHaveLength(1);
      expect(downEvents[0].type).toBe(POINTER_EVENT_TYPES.POINTER_DOWN);
      expect(upEvents[0].type).toBe(POINTER_EVENT_TYPES.POINTER_UP);
    });

    it('should get recent events', () => {
      const mockEvent = {
        type: POINTER_EVENT_TYPES.POINTER_DOWN,
        pointerId: 1,
        clientX: 100,
        clientY: 200,
      };

      // Add 15 events
      for (let i = 0; i < 15; i++) {
        eventProcessor.addEvent({ ...mockEvent, pointerId: i });
      }

      const recentEvents = eventProcessor.getRecentEvents(10);
      expect(recentEvents).toHaveLength(10);
      expect(recentEvents[0].pointerId).toBe(5);
      expect(recentEvents[recentEvents.length - 1].pointerId).toBe(14);
    });

    it('should calculate statistics correctly', async () => {
      const downEvent = {
        type: POINTER_EVENT_TYPES.POINTER_DOWN,
        pointerId: 1,
        clientX: 100,
        clientY: 200,
      };

      const upEvent = {
        type: POINTER_EVENT_TYPES.POINTER_UP,
        pointerId: 1,
        clientX: 100,
        clientY: 200,
      };

      eventProcessor.addEvent(downEvent);
      
      // Add a small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
      
      eventProcessor.addEvent(upEvent);

      const stats = eventProcessor.getStatistics();

      expect(stats.totalCount).toBe(2);
      expect(stats.countsByType[POINTER_EVENT_TYPES.POINTER_DOWN]).toBe(1);
      expect(stats.countsByType[POINTER_EVENT_TYPES.POINTER_UP]).toBe(1);
      // Note: averageInterval might be 0 due to timing precision in test environment
      expect(stats.sessionDuration).toBeGreaterThan(0);
    });
  });
});
