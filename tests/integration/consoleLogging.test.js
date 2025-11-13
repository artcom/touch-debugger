import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import { App } from '../../src/components/App.jsx';

// Mock console methods to capture calls
const mockConsoleLog = jest.fn();
const originalConsoleLog = console.log;

describe('Console Logging Integration', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
    console.log = mockConsoleLog;
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  it('should log pointer events to console when user interacts with app', async () => {
    const user = userEvent.setup();
    
    render(<App />);

    // Get the app container
    const appContainer = screen.getByText('Control Panel').closest('div');

    // Simulate pointer events using fireEvent
    fireEvent.pointerDown(appContainer, {
      pointerId: 1,
      clientX: 100,
      clientY: 200,
    });

    fireEvent.pointerUp(appContainer, {
      pointerId: 1,
      clientX: 100,
      clientY: 200,
    });

    fireEvent.pointerMove(appContainer, {
      pointerId: 1,
      clientX: 150,
      clientY: 250,
    });

    // Verify console was called with event information
    expect(mockConsoleLog).toHaveBeenCalledTimes(3);
    
    // Check that events are logged with correct types
    expect(mockConsoleLog).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('pointerdown'),
      expect.objectContaining({
        type: 'pointerdown',
      })
    );

    expect(mockConsoleLog).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('pointerup'),
      expect.objectContaining({
        type: 'pointerup',
      })
    );

    expect(mockConsoleLog).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining('pointermove'),
      expect.objectContaining({
        type: 'pointermove',
      })
    );
  });

  it('should handle multiple pointer events correctly', async () => {
    const user = userEvent.setup();
    
    render(<App />);

    const appContainer = screen.getByText('Control Panel').closest('div');

    // Simulate rapid pointer events
    for (let i = 0; i < 5; i++) {
      fireEvent.pointerMove(appContainer, {
        pointerId: 1,
        clientX: 100 + i * 10,
        clientY: 200 + i * 10,
      });
    }

    // Verify all events were logged
    expect(mockConsoleLog).toHaveBeenCalledTimes(5);
    
    // Verify all events are pointermove events
    for (let i = 0; i < 5; i++) {
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        i + 1,
        expect.stringContaining('pointermove'),
        expect.objectContaining({
          type: 'pointermove',
        })
      );
    }
  });

  it('should include timestamp in logged events', async () => {
    render(<App />);

    const appContainer = screen.getByText('Control Panel').closest('div');

    const beforeTime = Date.now();
    
    fireEvent.pointerDown(appContainer, {
      pointerId: 1,
      clientX: 100,
      clientY: 200,
    });

    const afterTime = Date.now();

    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    
    const loggedEvent = mockConsoleLog.mock.calls[0][1];
    expect(loggedEvent).toHaveProperty('timestamp');
    expect(loggedEvent.timestamp).toBeGreaterThanOrEqual(beforeTime);
    expect(loggedEvent.timestamp).toBeLessThanOrEqual(afterTime);
  });
});
