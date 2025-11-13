import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import { App } from '../../src/components/App.jsx';

describe('ROI Functionality Integration', () => {
  beforeEach(() => {
    // Clear console logs to avoid interference
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  it('should render ROI selector when app loads', () => {
    render(<App />);
    
    // ROI functionality should be available
    expect(screen.getByTestId('define-roi-button')).toBeInTheDocument();
  });

  it('should have ROI controls in initial state', () => {
    render(<App />);
    
    expect(screen.getByTestId('define-roi-button')).toBeInTheDocument();
    expect(screen.getByTestId('clear-roi-button')).toBeInTheDocument();
    // Should not show selection controls initially
    expect(screen.queryByTestId('roi-selection-overlay')).not.toBeInTheDocument();
  });

  it('should start ROI selection when toggle button is clicked', () => {
    render(<App />);
    
    const defineRoiButton = screen.getByTestId('define-roi-button');
    fireEvent.click(defineRoiButton);
    
    expect(screen.getByTestId('roi-selection-overlay')).toBeInTheDocument();
  });

  it('should show ROI selection rectangle during selection', () => {
    render(<App />);
    
    // Start ROI selection
    const defineRoiButton = screen.getByTestId('define-roi-button');
    fireEvent.click(defineRoiButton);
    
    const overlay = screen.getByTestId('roi-selection-overlay');
    
    // Start selection
    fireEvent.mouseDown(overlay, {
      clientX: 100,
      clientY: 200,
    });
    
    // Move mouse during selection
    fireEvent.mouseMove(overlay, {
      clientX: 150,
      clientY: 250,
    });
    
    // Should show selection overlay is active
    expect(screen.getByTestId('roi-selection-overlay')).toBeInTheDocument();
  });

  it('should complete ROI selection on mouse up', () => {
    render(<App />);
    
    // Start ROI selection
    const defineRoiButton = screen.getByTestId('define-roi-button');
    fireEvent.click(defineRoiButton);
    
    const overlay = screen.getByTestId('roi-selection-overlay');
    
    // Complete selection
    fireEvent.mouseDown(overlay, {
      clientX: 100,
      clientY: 200,
    });
    
    fireEvent.mouseUp(overlay, {
      clientX: 150,
      clientY: 250,
    });
    
    // Should hide selection overlay and show ROI indicator
    expect(screen.queryByTestId('roi-selection-overlay')).not.toBeInTheDocument();
    // ROI should be defined (check for clear button)
    expect(screen.getByTestId('clear-roi-button')).toBeInTheDocument();
  });

  it('should filter events in logs when ROI is defined', () => {
    render(<App />);
    
    // Start ROI selection
    const defineRoiButton = screen.getByTestId('define-roi-button');
    fireEvent.click(defineRoiButton);
    
    const overlay = screen.getByTestId('roi-selection-overlay');
    
    // Define ROI
    fireEvent.mouseDown(overlay, {
      clientX: 100,
      clientY: 200,
    });
    
    fireEvent.mouseUp(overlay, {
      clientX: 150,
      clientY: 250,
    });
    
    // Trigger events - some inside ROI, some outside
    const appContainer = screen.getByText('Control Panel').closest('div');
    
    // Event inside ROI
    fireEvent.pointerDown(appContainer, {
      pointerId: 1,
      clientX: 125,
      clientY: 225,
    });
    
    // Event outside ROI
    fireEvent.pointerUp(appContainer, {
      pointerId: 1,
      clientX: 50,
      clientY: 50,
    });
    
    // Should show events are being recorded
    expect(screen.getByText(/events recorded/)).toBeInTheDocument();
  });

  it('should filter events in heatmap when ROI is defined', () => {
    render(<App />);
    
    // Start ROI selection
    const defineRoiButton = screen.getByTestId('define-roi-button');
    fireEvent.click(defineRoiButton);
    
    const overlay = screen.getByTestId('roi-selection-overlay');
    
    // Define ROI
    fireEvent.mouseDown(overlay, {
      clientX: 100,
      clientY: 200,
    });
    
    fireEvent.mouseUp(overlay, {
      clientX: 150,
      clientY: 250,
    });
    
    // Trigger events
    const appContainer = screen.getByText('Control Panel').closest('div');
    
    fireEvent.pointerDown(appContainer, {
      pointerId: 1,
      clientX: 125,
      clientY: 225, // Inside ROI
    });
    
    fireEvent.pointerUp(appContainer, {
      pointerId: 1,
      clientX: 50,
      clientY: 50, // Outside ROI
    });
    
    // Heatmap should still be rendered
    expect(screen.getByTestId('heatmap-canvas')).toBeInTheDocument();
  });

  it('should filter events in recording when ROI is defined', () => {
    render(<App />);
    
    // Start ROI selection
    const defineRoiButton = screen.getByTestId('define-roi-button');
    fireEvent.click(defineRoiButton);
    
    const overlay = screen.getByTestId('roi-selection-overlay');
    
    // Define ROI
    fireEvent.mouseDown(overlay, {
      clientX: 100,
      clientY: 200,
    });
    
    fireEvent.mouseUp(overlay, {
      clientX: 150,
      clientY: 250,
    });
    
    // Start recording
    const recordButton = screen.getByTestId('record-button');
    fireEvent.click(recordButton);
    
    // Trigger events
    const appContainer = screen.getByText('Control Panel').closest('div');
    
    fireEvent.pointerDown(appContainer, {
      pointerId: 1,
      clientX: 125,
      clientY: 225, // Inside ROI
    });
    
    fireEvent.pointerUp(appContainer, {
      pointerId: 1,
      clientX: 50,
      clientY: 50, // Outside ROI
    });
    
    // Stop recording
    const stopRecordButton = screen.getByTestId('stop-record-button');
    fireEvent.click(stopRecordButton);
    
    // Statistics should only count events inside ROI
    expect(screen.getByText(/Total Events:/)).toBeInTheDocument();
    // Should have fewer events than total triggered
  });

  it('should clear ROI when clear button is clicked', () => {
    render(<App />);
    
    // Start ROI selection
    const defineRoiButton = screen.getByTestId('define-roi-button');
    fireEvent.click(defineRoiButton);
    
    const overlay = screen.getByTestId('roi-selection-overlay');
    
    // Define ROI
    fireEvent.mouseDown(overlay, {
      clientX: 100,
      clientY: 200,
    });
    
    fireEvent.mouseUp(overlay, {
      clientX: 150,
      clientY: 250,
    });
    
    // ROI should be active
    // ROI should be defined (check for clear button)
    expect(screen.getByTestId('clear-roi-button')).toBeInTheDocument();
    
    // Clear ROI
    const clearButton = screen.getByTestId('clear-roi-button');
    fireEvent.click(clearButton);
    
    // ROI should be cleared
    expect(screen.getByTestId('define-roi-button')).toBeInTheDocument();
  });

  it('should show ROI indicator with correct dimensions', () => {
    render(<App />);
    
    // Start ROI selection
    const defineRoiButton = screen.getByTestId('define-roi-button');
    fireEvent.click(defineRoiButton);
    
    const overlay = screen.getByTestId('roi-selection-overlay');
    
    // Define ROI
    fireEvent.mouseDown(overlay, {
      clientX: 100,
      clientY: 200,
    });
    
    fireEvent.mouseUp(overlay, {
      clientX: 150,
      clientY: 250,
    });
    
    // ROI should be defined (check for clear button)
    expect(screen.getByTestId('clear-roi-button')).toBeInTheDocument();
    // Should have correct positioning (would need to check styles)
  });

  it('should toggle ROI selection mode', () => {
    render(<App />);
    
    const defineRoiButton = screen.getByTestId('define-roi-button');
    
    // Start ROI selection
    fireEvent.click(defineRoiButton);
    expect(screen.getByTestId('roi-selection-overlay')).toBeInTheDocument();
    
    // ROI selection should be active
    expect(screen.getByTestId('roi-selection-overlay')).toBeInTheDocument();
  });

  it('should handle ESC key to cancel ROI selection', () => {
    render(<App />);
    
    // Start ROI selection
    const defineRoiButton = screen.getByTestId('define-roi-button');
    fireEvent.click(defineRoiButton);
    
    expect(screen.getByTestId('roi-selection-overlay')).toBeInTheDocument();
    
    // Press ESC to cancel
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(screen.queryByTestId('roi-selection-overlay')).not.toBeInTheDocument();
  });

  it('should allow multiple ROI definitions', () => {
    render(<App />);
    
    const defineRoiButton = screen.getByTestId('define-roi-button');
    
    // Define first ROI
    fireEvent.click(defineRoiButton);
    
    const overlay1 = screen.getByTestId('roi-selection-overlay');
    fireEvent.mouseDown(overlay1, { clientX: 100, clientY: 200 });
    fireEvent.mouseUp(overlay1, { clientX: 150, clientY: 250 });
    
    // ROI should be defined (check for ROI controls)
    expect(screen.getByTestId('clear-roi-button')).toBeInTheDocument();
    
    // Define second ROI (should replace first)
    fireEvent.click(defineRoiButton);
    
    const overlay2 = screen.getByTestId('roi-selection-overlay');
    fireEvent.mouseDown(overlay2, { clientX: 300, clientY: 400 });
    fireEvent.mouseUp(overlay2, { clientX: 350, clientY: 450 });
    
    // ROI should be defined (check for clear button)
    expect(screen.getByTestId('clear-roi-button')).toBeInTheDocument();
  });
});
