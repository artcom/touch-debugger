import { render, screen } from '@testing-library/react';
import { jest } from '@jest/globals';

describe('Heatmap Component', () => {
  let Heatmap;

  beforeAll(async () => {
    // Import the component
    const heatmapModule = await import('../../src/components/Heatmap.jsx');
    Heatmap = heatmapModule.Heatmap;
  });
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
      x: 150,
      y: 250,
      pointerId: 1,
      timestamp: 1234567891,
    },
    {
      type: 'pointermove',
      x: 200,
      y: 300,
      pointerId: 1,
      timestamp: 1234567892,
    },
  ];

  it('should render the heatmap canvas', () => {
    render(<Heatmap events={mockEvents} />);
    
    const canvas = screen.getByTestId('heatmap-canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas.tagName).toBe('CANVAS');
  });

  it('should have correct canvas dimensions covering full viewport', () => {
    render(<Heatmap events={mockEvents} />);
    
    const canvas = screen.getByTestId('heatmap-canvas');
    expect(canvas).toHaveStyle('width: 100vw');
    expect(canvas).toHaveStyle('height: 100vh');
    expect(canvas).toHaveStyle('position: fixed');
    expect(canvas).toHaveStyle('top: 0');
    expect(canvas).toHaveStyle('left: 0');
    expect(canvas).toHaveStyle('z-index: 999');
  });

  it('should render with provided events', () => {
    render(<Heatmap events={mockEvents} />);
    
    const canvas = screen.getByTestId('heatmap-canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should render with empty events array', () => {
    render(<Heatmap events={[]} />);
    
    const canvas = screen.getByTestId('heatmap-canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should render with no events prop', () => {
    render(<Heatmap />);
    
    const canvas = screen.getByTestId('heatmap-canvas');
    expect(canvas).toBeInTheDocument();
  });
});
