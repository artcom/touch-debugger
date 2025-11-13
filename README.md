# Touch Debugger

A comprehensive React application for visualizing, recording, and analyzing pointer events (touch, mouse, pen) in real-time. Built with Vite, React, styled-components, and modern web technologies.

## Features

### Core Functionality

- **Real-time Event Logging**: Capture and display all pointer events with coordinates and timestamps
- **Visual Event Display**: Interactive logs showing event types with color-coded indicators
- **Heatmap Visualization**: Visual representation of pointer activity across the screen
- **Event Recording**: Record and replay pointer events for analysis and testing
- **Region of Interest (ROI)**: Filter events by defined screen regions with touch & mouse support
- **Statistics Dashboard**: Real-time metrics including event counts, frequency, and duration

## Quick Start

### Prerequisites

- Node.js 24+
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd touch-debugger

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Control Panel Visibility

By default, the control panel is hidden. To show it on startup, add the `?controls` URL parameter:

```
http://localhost:5173?controls
```

You can also toggle the control panel visibility at runtime using the keyboard shortcut `c`.

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Serve with http-server (alternative)
npm run build && http-server -c0 dist
```

## Technical Architecture

### Key Technologies

- **React 18** - Modern hooks-based architecture with functional components
- **Vite** - Fast development and build tool with hot module replacement
- **Styled Components** - CSS-in-JS styling with proper prop management
- **Canvas API** - High-performance heatmap rendering
- **Pointer Events API** - Unified input handling (touch, mouse, pen)
- **Touch Events API** - Fallback touch handling for older browsers
- **Custom Hooks** - Modular state management and event handling

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm test tests/unit/

# Run integration tests only
npm test tests/integration/

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage

- **Unit Tests**: Comprehensive testing of utilities and hooks
- **Integration Tests**: End-to-end testing of component interactions
- **Performance Tests**: Validation of optimization features
- **Accessibility Tests**: UI component accessibility verification

## Development

### Code Style

- **Prettier**: Automatic code formatting
- **ESLint**: JavaScript linting and error detection
- **VSCode Integration**: Recommended settings for consistent development

## License

This project is licensed under the MIT License - see the LICENSE file for details.
