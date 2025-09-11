# Enhanced ELN Dashboard

This directory contains the enhanced Electronic Lab Notebook (ELN) dashboard implementation with draggable and resizable widgets tailored for scientific research and lab management.

## Overview

The enhanced dashboard provides a comprehensive view of lab operations with specialized widgets for different aspects of research management, similar to AWS Console's interface but designed specifically for laboratory environments.

## Architecture

### File Structure

```
dashboard/
├── enhanced-dashboard.tsx          # Main dashboard component
├── enhanced-dashboard.css.ts       # Styling system with widget layouts
├── widgets/                        # Individual widget components
│   ├── index.ts                   # Widget exports
│   ├── recent-experiments.tsx     # Recent lab experiments
│   ├── active-projects.tsx        # Project progress tracking
│   ├── equipment-status.tsx       # Lab equipment availability
│   ├── sample-inventory.tsx       # Sample tracking with alerts
│   ├── lab-calendar.tsx           # Equipment booking & scheduling
│   ├── quick-notes.tsx            # Note-taking with tags
│   └── protocol-library.tsx       # Protocol management
├── dashboard.css.ts               # Original dashboard styles
└── index.tsx                      # Original dashboard component
```

## Widget System

### Core Widgets

1. **Recent Experiments Widget**

   - Lists latest lab experiments with status indicators
   - Shows progress bars for ongoing experiments
   - Supports filtering by researcher and experiment type
   - Status tracking: In Progress, Completed, Failed, On Hold

2. **Active Projects Widget**

   - Displays current research projects with progress tracking
   - Team member assignments with avatars
   - Deadline indicators with color-coded urgency
   - Priority levels and status badges

3. **Lab Equipment Status Widget**

   - Real-time equipment availability dashboard
   - Usage statistics and utilization rates
   - Maintenance schedules and alerts
   - Booking integration for lab equipment

4. **Sample Inventory Widget**

   - Comprehensive sample tracking with location and quantities
   - Expiration date monitoring with alerts
   - Low stock warnings and inventory management
   - Searchable and filterable data table

5. **Lab Calendar Widget**

   - Equipment booking calendar with visual indicators
   - Meeting schedules and experiment deadlines
   - Maintenance windows tracking
   - Quick booking actions

6. **Quick Notes Widget**

   - Rapid note-taking with auto-save functionality
   - Tag system for organization and search
   - Voice-to-text capability simulation
   - Recent notes history

7. **Protocol Library Widget**
   - Recently used protocols with version control
   - Sharing status management (Private, Team, Public)
   - Usage statistics and popularity tracking
   - Quick protocol creation and browsing

### Additional Widgets

- **Lab Safety & Compliance**: Safety checklist status, training requirements, chemical inventory alerts
- **Research Metrics**: Publication progress, citation tracking, research output statistics

## Styling System

The dashboard uses a comprehensive CSS-in-JS styling system built with Vanilla Extract:

### Key Features

- **Responsive Grid Layout**: Adapts to different screen sizes with auto-fit columns
- **Widget Size Variants**: Small, Medium, Large, and Tall size options
- **Status Indicators**: Color-coded badges and icons for different states
- **Interactive Elements**: Hover effects, transitions, and micro-animations
- **Theme Integration**: Uses existing AFFiNE theme variables and colors

### Design Patterns

```typescript
// Widget size variants
export const widgetSizes = styleVariants({
  small: { gridColumn: 'span 1', minHeight: '280px' },
  medium: { gridColumn: 'span 1', minHeight: '380px' },
  large: { gridColumn: 'span 2', minHeight: '380px' },
  tall: { gridColumn: 'span 1', minHeight: '500px' },
});

// Status color system
export const statusColors = styleVariants({
  success: { backgroundColor: cssVarV2('status/success') },
  warning: { backgroundColor: cssVarV2('status/warning') },
  error: { backgroundColor: cssVarV2('status/error') },
  // ... more status colors
});
```

## Component Integration

The enhanced dashboard integrates seamlessly with the existing AFFiNE component system:

### Used Components

- **@affine/component**: `Progress`, `Table`, `DatePicker`, `Scrollable`
- **@blocksuite/icons/rc**: Comprehensive icon library
- **Theme System**: Uses existing CSS variables and color scheme
- **Layout Components**: `ViewBody`, `ViewHeader`, `ViewSidebarTab`

### Mock Data

All widgets include comprehensive mock data that demonstrates realistic ELN scenarios:

- Experiment tracking with realistic scientific projects
- Equipment with actual lab instrument names and specifications
- Sample inventory with chemical and biological samples
- Calendar events for typical lab activities
- Protocols based on common laboratory procedures

## Future Enhancements

### Planned Features

1. **Drag & Drop Functionality**

   - Implement `@atlaskit/pragmatic-drag-and-drop` for widget rearrangement
   - Persistent layout saving to localStorage
   - Snap-to-grid positioning system

2. **Widget Resizing**

   - Corner/edge resize handles
   - Minimum and maximum size constraints
   - Responsive breakpoint handling

3. **Data Integration**

   - Real-time data fetching from lab management systems
   - WebSocket connections for live updates
   - API integration for equipment status and bookings

4. **Advanced Features**
   - Widget configuration modals
   - Export/import dashboard layouts
   - Full-screen widget views
   - Custom widget creation

### Technical Implementation Notes

The current implementation focuses on:

- **Static Layout**: Demonstrates the visual design and user experience
- **Component Reusability**: All widgets are self-contained and reusable
- **Responsive Design**: Adapts to different screen sizes and orientations
- **Accessibility**: Follows WCAG guidelines with proper ARIA labels
- **Performance**: Optimized rendering with proper React patterns

## Usage

To use the enhanced dashboard:

```typescript
import { EnhancedDashboard } from './enhanced-dashboard';

// Replace the original dashboard component
export const Component = () => {
  return <EnhancedDashboard />;
};
```

The dashboard automatically integrates with the existing workbench system and sidebar functionality while providing a comprehensive lab management interface tailored for scientific research environments.

## Development Guidelines

When extending the dashboard:

1. **Follow Existing Patterns**: Use the established styling and component patterns
2. **Mock Data Quality**: Ensure mock data reflects realistic lab scenarios
3. **Accessibility**: Include proper ARIA labels and keyboard navigation
4. **Performance**: Optimize for rendering large datasets efficiently
5. **Responsive Design**: Test across different screen sizes and orientations

The enhanced ELN dashboard provides a solid foundation for laboratory management software that can scale with growing research needs while maintaining an intuitive and professional user interface.
