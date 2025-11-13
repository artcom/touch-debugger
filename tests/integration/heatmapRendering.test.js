import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import { App } from '../../src/components/App.jsx';

describe('Heatmap Rendering Integration', () => {
  beforeEach(() => {
    // Clear console logs to avoid interference
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  it('should display heatmap component when app renders', () => {
    render(<App />);
    
    expect(screen.getByTestId('heatmap-canvas')).toBeInTheDocument();
  });

  it('should render heatmap canvas with correct dimensions and positioning', () => {
    render(<App />);
    
    const canvas = screen.getByTestId('heatmap-canvas');
    expect(canvas).toHaveStyle('width: 100vw');
    expect(canvas).toHaveStyle('height: 100vh');
    expect(canvas).toHaveStyle('position: fixed');
    expect(canvas).toHaveStyle('top: 0');
    expect(canvas).toHaveStyle('left: 0');
    expect(canvas).toHaveStyle('z-index: 999');
    expect(canvas).toHaveStyle('pointer-events: none');
  });

  it('should render heatmap alongside logs component', () => {
    render(<App />);
    
    expect(screen.getByTestId('heatmap-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('control-panel')).toBeInTheDocument();
  });

  it('should have heatmap positioned behind logs (z-index)', () => {
    render(<App />);
    
    const canvas = screen.getByTestId('heatmap-canvas');
    const controlPanel = screen.getByTestId('control-panel');
    
    // Heatmap should have lower z-index than control panel
    expect(canvas).toHaveStyle('z-index: 999');
    expect(controlPanel).toHaveStyle('z-index: 1000');
  });

  it('should render heatmap even when no events have occurred', () => {
    render(<App />);
    
    // Heatmap should render even with empty state
    expect(screen.getByTestId('heatmap-canvas')).toBeInTheDocument();
    expect(screen.getByText('No events recorded yet')).toBeInTheDocument();
  });

  it('should maintain heatmap rendering when pointer events are triggered', () => {
    render(<App />);

    // Get the app container
    const appContainer = screen.getByText('Control Panel').closest('div');

    // Start recording to capture events
    const recordButton = screen.getByTestId('record-button');
    fireEvent.click(recordButton);

    // Simulate pointer events
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

    // Heatmap should still be rendered
    expect(screen.getByTestId('heatmap-canvas')).toBeInTheDocument();
    
    // Events should be recorded (check for recording status)
    expect(screen.getByText(/events recorded/)).toBeInTheDocument();
  });

  it('should handle multiple pointer events without breaking heatmap', () => {
    render(<App />);

    const appContainer = screen.getByText('Control Panel').closest('div');

    // Start recording to capture events
    const recordButton = screen.getByTestId('record-button');
    fireEvent.click(recordButton);

    // Simulate multiple pointer events
    for (let i = 0; i < 5; i++) {
      fireEvent.pointerMove(appContainer, {
        pointerId: 1,
        clientX: 100 + i * 10,
        clientY: 200 + i * 10,
      });
    }

    // Stop recording
    const stopRecordButton = screen.getByTestId('stop-record-button');
    fireEvent.click(stopRecordButton);

    // Heatmap should still be rendered
    expect(screen.getByTestId('heatmap-canvas')).toBeInTheDocument();
    
    // Events should be recorded (check for recording status)
    expect(screen.getByText(/events recorded/)).toBeInTheDocument();
  });

  it('should have proper layering with other UI elements', () => {
    render(<App />);
    
    const canvas = screen.getByTestId('heatmap-canvas');
    const controlPanel = screen.getByTestId('control-panel');
    const appContainer = screen.getByText('Control Panel').closest('div');
    
    // Check that all elements are present
    expect(canvas).toBeInTheDocument();
    expect(controlPanel).toBeInTheDocument();
    expect(appContainer).toBeInTheDocument();
    
    // Check z-index layering
    expect(canvas).toHaveStyle('z-index: 999');
    expect(controlPanel).toHaveStyle('z-index: 1000');
  });
});
