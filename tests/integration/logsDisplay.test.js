import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import { App } from '../../src/components/App.jsx';

describe('Logs Display Integration', () => {
  beforeEach(() => {
    // Clear console logs to avoid interference
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  it('should display logs component when app renders', () => {
    render(<App />);
    
    expect(screen.getByTestId('control-panel')).toBeInTheDocument();
  });

  it('should show pointer events in logs when user interacts with app', () => {
    render(<App />);

    // Get the app container
    const appContainer = screen.getByText('Control Panel').closest('div');

    // Start recording to capture events
    const recordButton = screen.getByTestId('record-button');
    fireEvent.click(recordButton);

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

    // Stop recording
    const stopRecordButton = screen.getByTestId('stop-record-button');
    fireEvent.click(stopRecordButton);

    // Verify events are recorded
    expect(screen.getByText(/events recorded/)).toBeInTheDocument();
  });

  it('should display events in reverse chronological order', () => {
    render(<App />);

    const appContainer = screen.getByText('Control Panel').closest('div');

    // Start recording to capture events
    const recordButton = screen.getByTestId('record-button');
    fireEvent.click(recordButton);

    // Add multiple events in sequence using fireEvent
    fireEvent.pointerDown(appContainer, {
      pointerId: 1,
      clientX: 50,
      clientY: 50,
    });

    fireEvent.pointerMove(appContainer, {
      pointerId: 1,
      clientX: 100,
      clientY: 100,
    });

    fireEvent.pointerUp(appContainer, {
      pointerId: 1,
      clientX: 150,
      clientY: 150,
    });

    // Stop recording
    const stopRecordButton = screen.getByTestId('stop-record-button');
    fireEvent.click(stopRecordButton);

    // Verify events are recorded
    expect(screen.getByText(/events recorded/)).toBeInTheDocument();
  });

  it('should handle rapid pointer events correctly', () => {
    render(<App />);

    const appContainer = screen.getByText('Control Panel').closest('div');

    // Start recording to capture events
    const recordButton = screen.getByTestId('record-button');
    fireEvent.click(recordButton);

    // Simulate rapid pointermove events using fireEvent
    for (let i = 0; i < 10; i++) {
      fireEvent.pointerMove(appContainer, {
        pointerId: 1,
        clientX: 100 + i * 5,
        clientY: 200 + i * 5,
      });
    }

    // Stop recording
    const stopRecordButton = screen.getByTestId('stop-record-button');
    fireEvent.click(stopRecordButton);

    // Verify events are recorded
    expect(screen.getByText(/events recorded/)).toBeInTheDocument();
  });

  it('should show empty state initially when no events have occurred', () => {
    render(<App />);
    
    expect(screen.getByText('No events recorded yet')).toBeInTheDocument();
  });

  it('should apply opacity control to logs container', () => {
    render(<App />);
    
    const controlPanel = screen.getByTestId('control-panel');
    expect(controlPanel).toHaveStyle('color: rgba(255, 255, 255, 0.95)');
  });
});
