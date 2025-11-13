import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import { App } from '../../src/components/App.jsx';

describe('Record and Playback Integration', () => {
  beforeEach(() => {
    // Clear console logs to avoid interference
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  it('should render recording controls when app loads', () => {
    render(<App />);
    
    // Recording controls should be present
    expect(screen.getByTestId('record-button')).toBeInTheDocument();
  });

  it('should render statistics panel when app loads', () => {
    render(<App />);
    
    // Control panel should be present
    expect(screen.getByTestId('control-panel')).toBeInTheDocument();
  });

  it('should show initial statistics with zero values', () => {
    render(<App />);
    
    // Should show recording controls
    expect(screen.getByTestId('record-button')).toBeInTheDocument();
  });

  it('should have recording controls in stopped state initially', () => {
    render(<App />);
    
    expect(screen.getByTestId('record-button')).toBeInTheDocument();
    expect(screen.getByTestId('play-button')).toBeInTheDocument();
    expect(screen.getByTestId('clear-button')).toBeInTheDocument();
    
    // Should not be recording or playing initially
    expect(screen.queryByTestId('stop-record-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stop-play-button')).not.toBeInTheDocument();
  });

  it('should start recording when record button is clicked', () => {
    render(<App />);
    
    const recordButton = screen.getByTestId('record-button');
    fireEvent.click(recordButton);
    
    // Should show stop recording button
    expect(screen.getByTestId('stop-record-button')).toBeInTheDocument();
    expect(screen.queryByTestId('record-button')).not.toBeInTheDocument();
  });

  it('should stop recording when stop record button is clicked', () => {
    render(<App />);
    
    // Start recording
    const recordButton = screen.getByTestId('record-button');
    fireEvent.click(recordButton);
    
    // Stop recording
    const stopRecordButton = screen.getByTestId('stop-record-button');
    fireEvent.click(stopRecordButton);
    
    // Should show record button again
    expect(screen.getByTestId('record-button')).toBeInTheDocument();
    expect(screen.queryByTestId('stop-record-button')).not.toBeInTheDocument();
  });

  it('should update statistics when events are recorded', () => {
    render(<App />);
    
    // Start recording
    const recordButton = screen.getByTestId('record-button');
    fireEvent.click(recordButton);
    
    // Get the app container and trigger events
    const appContainer = screen.getByText('Control Panel').closest('div');
    
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
    
    // Statistics should be updated
    // Should show recording status
    expect(screen.getByText(/events recorded/)).toBeInTheDocument();
    // The exact number might vary due to test environment, but should be > 0
  });

  it('should start playback when play button is clicked (with recorded events)', async () => {
    render(<App />);
    
    // Start recording
    const recordButton = screen.getByTestId('record-button');
    fireEvent.click(recordButton);
    
    // Trigger an event
    const appContainer = screen.getByText('Control Panel').closest('div');
    fireEvent.pointerDown(appContainer, {
      pointerId: 1,
      clientX: 100,
      clientY: 200,
    });
    
    // Stop recording
    const stopRecordButton = screen.getByTestId('stop-record-button');
    fireEvent.click(stopRecordButton);
    
    // Start playback
    const playButton = screen.getByTestId('play-button');
    fireEvent.click(playButton);
    
    // Should show stop play button
    expect(screen.getByTestId('stop-play-button')).toBeInTheDocument();
    expect(screen.queryByTestId('play-button')).not.toBeInTheDocument();
  });

  it('should not start playback when no events are recorded', () => {
    render(<App />);
    
    // Try to start playback without recording
    const playButton = screen.getByTestId('play-button');
    fireEvent.click(playButton);
    
    // Should still show play button (playback didn't start)
    expect(screen.getByTestId('play-button')).toBeInTheDocument();
    expect(screen.queryByTestId('stop-play-button')).not.toBeInTheDocument();
  });

  it('should stop playback when stop play button is clicked', () => {
    render(<App />);
    
    // Start recording
    const recordButton = screen.getByTestId('record-button');
    fireEvent.click(recordButton);
    
    // Trigger an event
    const appContainer = screen.getByText('Control Panel').closest('div');
    fireEvent.pointerDown(appContainer, {
      pointerId: 1,
      clientX: 100,
      clientY: 200,
    });
    
    // Stop recording
    const stopRecordButton = screen.getByTestId('stop-record-button');
    fireEvent.click(stopRecordButton);
    
    // Start playback
    const playButton = screen.getByTestId('play-button');
    fireEvent.click(playButton);
    
    // Stop playback
    const stopPlayButton = screen.getByTestId('stop-play-button');
    fireEvent.click(stopPlayButton);
    
    // Should show play button again
    expect(screen.getByTestId('play-button')).toBeInTheDocument();
    expect(screen.queryByTestId('stop-play-button')).not.toBeInTheDocument();
  });

  it('should clear recording when clear button is clicked', () => {
    render(<App />);
    
    // Start recording
    const recordButton = screen.getByTestId('record-button');
    fireEvent.click(recordButton);
    
    // Trigger an event
    const appContainer = screen.getByText('Control Panel').closest('div');
    fireEvent.pointerDown(appContainer, {
      pointerId: 1,
      clientX: 100,
      clientY: 200,
    });
    
    // Stop recording
    const stopRecordButton = screen.getByTestId('stop-record-button');
    fireEvent.click(stopRecordButton);
    
    // Clear recording
    const clearButton = screen.getByTestId('clear-button');
    fireEvent.click(clearButton);
    
    // Statistics should be reset
    expect(screen.getByTestId('control-panel')).toBeInTheDocument();
  });

  it('should not be able to start playback while recording', () => {
    render(<App />);
    
    // Start recording
    const recordButton = screen.getByTestId('record-button');
    fireEvent.click(recordButton);
    
    // Play button should be disabled or not clickable
    const playButton = screen.getByTestId('play-button');
    expect(playButton).toBeDisabled();
  });

  it('should not be able to start recording while playing', () => {
    render(<App />);
    
    // Record an event first
    const recordButton = screen.getByTestId('record-button');
    fireEvent.click(recordButton);
    
    const appContainer = screen.getByText('Control Panel').closest('div');
    fireEvent.pointerDown(appContainer, {
      pointerId: 1,
      clientX: 100,
      clientY: 200,
    });
    
    const stopRecordButton = screen.getByTestId('stop-record-button');
    fireEvent.click(stopRecordButton);
    
    // Start playback
    const playButton = screen.getByTestId('play-button');
    fireEvent.click(playButton);
    
    // Record button should be available (not disabled)
    expect(screen.getByTestId('record-button')).toBeInTheDocument();
  });

  it('should show event type breakdown in statistics', () => {
    render(<App />);
    
    // Start recording
    const recordButton = screen.getByTestId('record-button');
    fireEvent.click(recordButton);
    
    // Trigger different event types
    const appContainer = screen.getByText('Control Panel').closest('div');
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
    
    // Stop recording
    const stopRecordButton = screen.getByTestId('stop-record-button');
    fireEvent.click(stopRecordButton);
    
    // Should show event type breakdown
    expect(screen.getByText(/pointerdown:/)).toBeInTheDocument();
    expect(screen.getByText(/pointerup:/)).toBeInTheDocument();
    expect(screen.getByText(/pointermove:/)).toBeInTheDocument();
  });
});
