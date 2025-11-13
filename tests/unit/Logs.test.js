import { render, screen } from '@testing-library/react';
import { jest } from '@jest/globals';
import { Logs } from '../../src/components/Logs.jsx';

describe('Logs Component', () => {
  const mockEvents = [
    {
      type: 'pointerdown',
      x: 100,
      y: 200,
      pointerId: 1,
      timestamp: 1234567890,
    },
    {
      type: 'pointerup',
      x: 100,
      y: 200,
      pointerId: 1,
      timestamp: 1234567891,
    },
    {
      type: 'pointermove',
      x: 150,
      y: 250,
      pointerId: 1,
      timestamp: 1234567892,
    },
  ];

  it('should render the logs component with title', () => {
    render(<Logs events={mockEvents} />);
    
    expect(screen.getByText('Event Logs')).toBeInTheDocument();
  });

  it('should display events in reverse chronological order (most recent first)', () => {
    render(<Logs events={mockEvents} />);
    
    const logEntries = screen.getAllByTestId(/log-entry-/);
    
    // Should have 3 log entries
    expect(logEntries).toHaveLength(3);
    
    // First entry should be the most recent (pointermove)
    expect(logEntries[0]).toHaveTextContent('pointermove');
    expect(logEntries[1]).toHaveTextContent('pointerup');
    expect(logEntries[2]).toHaveTextContent('pointerdown');
  });

  it('should display event type and coordinates for each event', () => {
    render(<Logs events={mockEvents} />);
    
    // Check that all event types are displayed
    expect(screen.getByText('pointermove')).toBeInTheDocument();
    expect(screen.getByText('pointerup')).toBeInTheDocument();
    expect(screen.getByText('pointerdown')).toBeInTheDocument();
    
    // Check that coordinates are displayed (use getAllByText for duplicates)
    expect(screen.getAllByText('x: 100, y: 200')).toHaveLength(2);
    expect(screen.getByText('x: 150, y: 250')).toBeInTheDocument();
  });

  it('should apply opacity control from leva', () => {
    render(<Logs events={mockEvents} />);
    
    const logsContainer = screen.getByTestId('logs-container');
    expect(logsContainer).toHaveStyle('opacity: 0.8');
  });

  it('should show empty state when no events', () => {
    render(<Logs events={[]} />);
    
    expect(screen.getByText('No events to display')).toBeInTheDocument();
    expect(screen.queryByTestId(/log-entry-/)).not.toBeInTheDocument();
  });

  it('should limit displayed events to most recent 50', () => {
    // Create 60 events
    const manyEvents = Array.from({ length: 60 }, (_, i) => ({
      type: 'pointermove',
      x: i,
      y: i,
      pointerId: 1,
      timestamp: 1234567890 + i,
    }));
    
    render(<Logs events={manyEvents} />);
    
    const logEntries = screen.getAllByTestId(/log-entry-/);
    expect(logEntries).toHaveLength(50); // Should be limited to 50
    
    // Should show the most recent 50 (items 10-59 from the array)
    expect(logEntries[0]).toHaveTextContent('x: 59, y: 59'); // Most recent
    expect(logEntries[49]).toHaveTextContent('x: 10, y: 10'); // Oldest shown
  });

  it('should handle events with missing coordinates gracefully', () => {
    const eventsWithMissingCoords = [
      {
        type: 'pointerdown',
        pointerId: 1,
        timestamp: 1234567890,
        // Missing x, y
      },
      {
        type: 'pointerup',
        x: 100,
        // Missing y
        pointerId: 1,
        timestamp: 1234567891,
      },
    ];
    
    render(<Logs events={eventsWithMissingCoords} />);
    
    expect(screen.getByText('pointerdown')).toBeInTheDocument();
    expect(screen.getByText('pointerup')).toBeInTheDocument();
    expect(screen.getByText('x: --, y: --')).toBeInTheDocument();
    expect(screen.getByText('x: 100, y: --')).toBeInTheDocument();
  });
});
