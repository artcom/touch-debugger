import {
  EVENT_COLORS,
  getEventColor,
  hexToRgba,
  getEventColorWithOpacity,
  filterEventsByType,
  hasValidCoordinates,
} from '../../src/utils/colorUtils.js';
import { POINTER_EVENT_TYPES } from '../../src/utils/eventTypes.js';

describe('colorUtils', () => {
  describe('EVENT_COLORS', () => {
    it('should have correct color mappings', () => {
      expect(EVENT_COLORS).toEqual({
        [POINTER_EVENT_TYPES.POINTER_DOWN]: '#ff4444',
        [POINTER_EVENT_TYPES.POINTER_UP]: '#44ff44',
        [POINTER_EVENT_TYPES.POINTER_MOVE]: '#4444ff',
        [POINTER_EVENT_TYPES.POINTER_ENTER]: '#ffaa44',
        [POINTER_EVENT_TYPES.POINTER_LEAVE]: '#ff44aa',
        [POINTER_EVENT_TYPES.CLICK]: '#ff8844',
        [POINTER_EVENT_TYPES.DRAG_START]: '#44aaff',
        [POINTER_EVENT_TYPES.DRAG]: '#44ffff',
        [POINTER_EVENT_TYPES.DRAG_END]: '#ff44ff',
      });
    });
  });

  describe('getEventColor', () => {
    it('should return correct color for known event types', () => {
      expect(getEventColor(POINTER_EVENT_TYPES.POINTER_DOWN)).toBe('#ff4444');
      expect(getEventColor(POINTER_EVENT_TYPES.POINTER_UP)).toBe('#44ff44');
      expect(getEventColor(POINTER_EVENT_TYPES.POINTER_MOVE)).toBe('#4444ff');
      expect(getEventColor(POINTER_EVENT_TYPES.POINTER_ENTER)).toBe('#ffaa44');
      expect(getEventColor(POINTER_EVENT_TYPES.POINTER_LEAVE)).toBe('#ff44aa');
    });

    it('should return white for unknown event types', () => {
      expect(getEventColor('unknown')).toBe('#ffffff');
      expect(getEventColor('')).toBe('#ffffff');
      expect(getEventColor(null)).toBe('#ffffff');
      expect(getEventColor(undefined)).toBe('#ffffff');
    });
  });

  describe('hexToRgba', () => {
    it('should convert hex colors to rgba correctly', () => {
      expect(hexToRgba('#00ff00', 0.5)).toBe('rgba(0, 255, 0, 0.5)');
      expect(hexToRgba('#0080ff', 0.8)).toBe('rgba(0, 128, 255, 0.8)');
      expect(hexToRgba('#ff8000', 1)).toBe('rgba(255, 128, 0, 1)');
      expect(hexToRgba('#ffff00', 0)).toBe('rgba(255, 255, 0, 0)');
      expect(hexToRgba('#ff0000', 0.3)).toBe('rgba(255, 0, 0, 0.3)');
    });

    it('should handle hex colors without #', () => {
      expect(hexToRgba('00ff00', 0.5)).toBe('rgba(0, 255, 0, 0.5)');
      expect(hexToRgba('0080ff', 0.8)).toBe('rgba(0, 128, 255, 0.8)');
    });

    it('should handle edge cases', () => {
      expect(hexToRgba('#000000', 0.5)).toBe('rgba(0, 0, 0, 0.5)');
      expect(hexToRgba('#ffffff', 1)).toBe('rgba(255, 255, 255, 1)');
    });
  });

  describe('getEventColorWithOpacity', () => {
    it('should return rgba color for known event types', () => {
      expect(getEventColorWithOpacity(POINTER_EVENT_TYPES.POINTER_DOWN, 0.5)).toBe('rgba(255, 68, 68, 0.5)');
      expect(getEventColorWithOpacity(POINTER_EVENT_TYPES.POINTER_UP, 0.8)).toBe('rgba(68, 255, 68, 0.8)');
      expect(getEventColorWithOpacity(POINTER_EVENT_TYPES.POINTER_MOVE, 1)).toBe('rgba(68, 68, 255, 1)');
    });

    it('should return rgba white for unknown event types', () => {
      expect(getEventColorWithOpacity('unknown', 0.5)).toBe('rgba(255, 255, 255, 0.5)');
      expect(getEventColorWithOpacity('', 0.8)).toBe('rgba(255, 255, 255, 0.8)');
    });

    it('should handle different opacity values', () => {
      expect(getEventColorWithOpacity(POINTER_EVENT_TYPES.POINTER_DOWN, 0)).toBe('rgba(255, 68, 68, 0)');
      expect(getEventColorWithOpacity(POINTER_EVENT_TYPES.POINTER_DOWN, 1)).toBe('rgba(255, 68, 68, 1)');
      expect(getEventColorWithOpacity(POINTER_EVENT_TYPES.POINTER_DOWN, 0.75)).toBe('rgba(255, 68, 68, 0.75)');
    });
  });

  describe('filterEventsByType', () => {
    const mockEvents = [
      { type: POINTER_EVENT_TYPES.POINTER_DOWN, x: 100, y: 200 },
      { type: POINTER_EVENT_TYPES.POINTER_UP, x: 150, y: 250 },
      { type: POINTER_EVENT_TYPES.POINTER_MOVE, x: 200, y: 300 },
      { type: POINTER_EVENT_TYPES.POINTER_ENTER, x: 250, y: 350 },
      { type: POINTER_EVENT_TYPES.POINTER_LEAVE, x: 300, y: 400 },
    ];

    it('should filter events based on enabled types', () => {
      const filterTypes = {
        [POINTER_EVENT_TYPES.POINTER_DOWN]: true,
        [POINTER_EVENT_TYPES.POINTER_UP]: true,
        [POINTER_EVENT_TYPES.POINTER_MOVE]: false,
        [POINTER_EVENT_TYPES.POINTER_ENTER]: false,
        [POINTER_EVENT_TYPES.POINTER_LEAVE]: true,
      };

      const filtered = filterEventsByType(mockEvents, filterTypes);
      expect(filtered).toHaveLength(3);
      expect(filtered[0].type).toBe(POINTER_EVENT_TYPES.POINTER_DOWN);
      expect(filtered[1].type).toBe(POINTER_EVENT_TYPES.POINTER_UP);
      expect(filtered[2].type).toBe(POINTER_EVENT_TYPES.POINTER_LEAVE);
    });

    it('should return all events when all types are enabled', () => {
      const filterTypes = {
        [POINTER_EVENT_TYPES.POINTER_DOWN]: true,
        [POINTER_EVENT_TYPES.POINTER_UP]: true,
        [POINTER_EVENT_TYPES.POINTER_MOVE]: true,
        [POINTER_EVENT_TYPES.POINTER_ENTER]: true,
        [POINTER_EVENT_TYPES.POINTER_LEAVE]: true,
      };

      const filtered = filterEventsByType(mockEvents, filterTypes);
      expect(filtered).toHaveLength(5);
    });

    it('should return empty array when no types are enabled', () => {
      const filterTypes = {
        [POINTER_EVENT_TYPES.POINTER_DOWN]: false,
        [POINTER_EVENT_TYPES.POINTER_UP]: false,
        [POINTER_EVENT_TYPES.POINTER_MOVE]: false,
        [POINTER_EVENT_TYPES.POINTER_ENTER]: false,
        [POINTER_EVENT_TYPES.POINTER_LEAVE]: false,
      };

      const filtered = filterEventsByType(mockEvents, filterTypes);
      expect(filtered).toHaveLength(0);
    });

    it('should handle empty events array', () => {
      const filtered = filterEventsByType([], { [POINTER_EVENT_TYPES.POINTER_DOWN]: true });
      expect(filtered).toHaveLength(0);
    });

    it('should handle events with unknown types', () => {
      const eventsWithUnknown = [
        ...mockEvents,
        { type: 'unknown', x: 350, y: 450 },
      ];

      const filterTypes = {
        [POINTER_EVENT_TYPES.POINTER_DOWN]: true,
        [POINTER_EVENT_TYPES.POINTER_UP]: true,
      };

      const filtered = filterEventsByType(eventsWithUnknown, filterTypes);
      expect(filtered).toHaveLength(2);
      expect(filtered.every(event => event.type !== 'unknown')).toBe(true);
    });
  });

  describe('hasValidCoordinates', () => {
    it('should return true for events with valid coordinates', () => {
      expect(hasValidCoordinates({ x: 100, y: 200 })).toBe(true);
      expect(hasValidCoordinates({ x: 0, y: 0 })).toBe(true);
      expect(hasValidCoordinates({ x: -100, y: -200 })).toBe(true);
      expect(hasValidCoordinates({ x: 100.5, y: 200.5 })).toBe(true);
    });

    it('should return false for events with undefined coordinates', () => {
      expect(hasValidCoordinates({ x: undefined, y: 200 })).toBe(false);
      expect(hasValidCoordinates({ x: 100, y: undefined })).toBe(false);
      expect(hasValidCoordinates({ x: undefined, y: undefined })).toBe(false);
    });

    it('should return false for events with non-number coordinates', () => {
      expect(hasValidCoordinates({ x: '100', y: 200 })).toBe(false);
      expect(hasValidCoordinates({ x: 100, y: '200' })).toBe(false);
      expect(hasValidCoordinates({ x: '100', y: '200' })).toBe(false);
      expect(hasValidCoordinates({ x: null, y: 200 })).toBe(false);
      expect(hasValidCoordinates({ x: 100, y: null })).toBe(false);
    });

    it('should return false for events with NaN coordinates', () => {
      expect(hasValidCoordinates({ x: NaN, y: 200 })).toBe(false);
      expect(hasValidCoordinates({ x: 100, y: NaN })).toBe(false);
      expect(hasValidCoordinates({ x: NaN, y: NaN })).toBe(false);
    });

    it('should handle events with additional properties', () => {
      expect(hasValidCoordinates({ 
        x: 100, 
        y: 200, 
        type: 'pointerdown', 
        timestamp: 1234567890 
      })).toBe(true);
    });

    it('should handle empty event objects', () => {
      expect(hasValidCoordinates({})).toBe(false);
    });
  });
});
