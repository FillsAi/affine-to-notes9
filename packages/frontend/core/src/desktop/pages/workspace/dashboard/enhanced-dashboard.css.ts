import { cssVar } from '@toeverything/theme';
import { cssVarV2 } from '@toeverything/theme/v2';
import { style, styleVariants } from '@vanilla-extract/css';

// Header styles
export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  height: '44px',
  borderBottom: `1px solid ${cssVarV2('layer/insideBorder/border')}`,
});

export const headerTitle = style({
  fontSize: '18px',
  fontWeight: 600,
  color: cssVarV2('text/primary'),
  margin: 0,
});

// Body styles
export const body = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  height: '100%',
  width: '100%',
  padding: '16px 24px',
});

// Grid container
export const gridContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px',
  padding: '16px',
  maxWidth: '100%',
  overflow: 'auto',

  '@media': {
    'screen and (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      padding: '12px',
      gap: '16px',
    },
  },
});

// Base widget styles
export const widget = style({
  backgroundColor: cssVarV2('layer/background/secondary'),
  border: `1px solid ${cssVarV2('layer/insideBorder/border')}`,
  borderRadius: '8px',
  padding: '16px',
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  position: 'relative',
  transition: 'all 0.2s ease-in-out',
  cursor: 'default',

  ':hover': {
    borderColor: cssVarV2('layer/insideBorder/borderHover'),
    boxShadow: `0 2px 8px ${cssVarV2('shadow/1')}`,
  },

  '@media': {
    'screen and (max-width: 768px)': {
      padding: '12px',
      minHeight: '150px',
    },
  },
});

// Widget variants for different sizes
export const widgetVariants = styleVariants({
  small: [
    widget,
    {
      minHeight: '150px',
    },
  ],
  medium: [
    widget,
    {
      minHeight: '200px',
    },
  ],
  large: [
    widget,
    {
      minHeight: '300px',
    },
  ],
  tall: [
    widget,
    {
      minHeight: '400px',
    },
  ],
});

// Widget header
export const widgetHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px',
  paddingBottom: '8px',
  borderBottom: `1px solid ${cssVarV2('layer/insideBorder/border')}`,
});

export const widgetTitle = style({
  fontSize: '14px',
  fontWeight: 600,
  color: cssVarV2('text/primary'),
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const widgetIcon = style({
  width: '16px',
  height: '16px',
  color: cssVarV2('icon/primary'),
});

// Widget content area
export const widgetContent = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  overflow: 'hidden',
});

// List styles for widgets
export const widgetList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  maxHeight: '200px',
  overflow: 'auto',
});

export const widgetListItem = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 12px',
  backgroundColor: cssVarV2('layer/background/primary'),
  borderRadius: '6px',
  border: `1px solid ${cssVarV2('layer/insideBorder/border')}`,
  fontSize: '13px',

  ':hover': {
    backgroundColor: cssVarV2('layer/background/hoverOverlay'),
  },
});

export const listItemText = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  flex: 1,
});

export const listItemTitle = style({
  fontWeight: 500,
  color: cssVarV2('text/primary'),
  fontSize: '13px',
});

export const listItemSubtitle = style({
  color: cssVarV2('text/secondary'),
  fontSize: '11px',
});

// Badge/Status styles
export const badge = style({
  padding: '2px 8px',
  borderRadius: '12px',
  fontSize: '11px',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const badgeVariants = styleVariants({
  primary: [
    badge,
    {
      backgroundColor: cssVarV2('layer/background/primary'),
      color: cssVar('primaryColor'),
      border: `1px solid ${cssVar('primaryColor')}`,
    },
  ],
  success: [
    badge,
    {
      backgroundColor: cssVarV2('toast/iconColor/success'),
      color: cssVarV2('status/success'),
      border: `1px solid ${cssVarV2('status/success')}`,
    },
  ],
  warning: [
    badge,
    {
      backgroundColor: cssVarV2('toast/iconColor/warning'),
      color: cssVarV2('status/warning'),
      border: `1px solid ${cssVarV2('status/warning')}`,
    },
  ],
  error: [
    badge,
    {
      backgroundColor: cssVarV2('toast/iconColor/error'),
      color: cssVarV2('status/error'),
      border: `1px solid ${cssVarV2('status/error')}`,
    },
  ],
  neutral: [
    badge,
    {
      backgroundColor: cssVar('hoverColor'),
      color: cssVar('textSecondaryColor'),
      border: `1px solid ${cssVar('borderColor')}`,
    },
  ],
});

// Progress bar styles
export const progressContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '8px',
});

export const progressBar = style({
  flex: 1,
  height: '6px',
  backgroundColor: cssVarV2('layer/background/primary'),
  borderRadius: '3px',
  overflow: 'hidden',
});

export const progressFill = style({
  height: '100%',
  backgroundColor: cssVar('primaryColor'),
  borderRadius: '3px',
  transition: 'width 0.3s ease',
});

export const progressText = style({
  fontSize: '12px',
  fontWeight: 500,
  color: cssVarV2('text/secondary'),
  minWidth: '35px',
  textAlign: 'right',
});

// Table styles for inventory widgets
export const widgetTable = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '12px',
});

export const tableHeader = style({
  borderBottom: `1px solid ${cssVarV2('layer/insideBorder/border')}`,
  padding: '8px 4px',
  textAlign: 'left',
  fontWeight: 600,
  color: cssVarV2('text/primary'),
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const tableCell = style({
  padding: '6px 4px',
  borderBottom: `1px solid ${cssVarV2('layer/insideBorder/border')}`,
  color: cssVarV2('text/primary'),
  fontSize: '12px',
});

// Calendar widget styles
export const calendarContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const calendarHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '8px',
});

// Notes widget styles
export const notesTextarea = style({
  width: '100%',
  minHeight: '120px',
  padding: '12px',
  border: `1px solid ${cssVarV2('layer/insideBorder/border')}`,
  borderRadius: '6px',
  backgroundColor: cssVarV2('layer/background/primary'),
  color: cssVarV2('text/primary'),
  fontSize: '13px',
  resize: 'vertical',
  outline: 'none',

  ':focus': {
    borderColor: cssVar('primaryColor'),
  },

  '::placeholder': {
    color: cssVarV2('text/placeholder'),
  },
});

// Equipment status styles
export const equipmentGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
  gap: '8px',
});

export const equipmentItem = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '8px',
  backgroundColor: cssVarV2('layer/background/primary'),
  borderRadius: '6px',
  border: `1px solid ${cssVarV2('layer/insideBorder/border')}`,
  textAlign: 'center',
  fontSize: '11px',
});

export const equipmentIcon = style({
  width: '24px',
  height: '24px',
  marginBottom: '4px',
  color: cssVarV2('icon/secondary'),
});

export const equipmentName = style({
  fontWeight: 500,
  color: cssVarV2('text/primary'),
  marginBottom: '2px',
});

export const equipmentStatus = style({
  fontSize: '10px',
  color: cssVarV2('text/secondary'),
});

// Metrics styles
export const metricsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
  gap: '12px',
});

export const metricItem = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
});

export const metricValue = style({
  fontSize: '20px',
  fontWeight: 600,
  color: cssVar('primaryColor'),
  marginBottom: '4px',
});

export const metricLabel = style({
  fontSize: '11px',
  color: cssVarV2('text/secondary'),
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

// Action button styles
export const actionButton = style({
  padding: '6px 12px',
  borderRadius: '4px',
  border: `1px solid ${cssVarV2('layer/insideBorder/border')}`,
  backgroundColor: cssVarV2('layer/background/primary'),
  color: cssVarV2('text/primary'),
  fontSize: '12px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s ease',

  ':hover': {
    backgroundColor: cssVarV2('layer/background/hoverOverlay'),
    borderColor: cssVar('primaryColor'),
  },
});

// Scrollable content area
export const scrollableContent = style({
  overflowY: 'auto',
  maxHeight: '180px',
  paddingRight: '4px',

  '::-webkit-scrollbar': {
    width: '4px',
  },

  '::-webkit-scrollbar-track': {
    background: cssVarV2('layer/background/primary'),
  },

  '::-webkit-scrollbar-thumb': {
    background: cssVarV2('layer/insideBorder/border'),
    borderRadius: '2px',
  },

  '::-webkit-scrollbar-thumb:hover': {
    background: cssVarV2('layer/insideBorder/borderHover'),
  },
});

// Missing styles that widgets are importing
export const dashboardGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px',
  padding: '16px',
});

export const widgetSizes = styleVariants({
  small: { gridColumn: 'span 1', minHeight: '150px' },
  medium: { gridColumn: 'span 1', minHeight: '200px' },
  large: { gridColumn: 'span 2', minHeight: '300px' },
  tall: { gridColumn: 'span 1', minHeight: '400px' },
});

export const widgetActions = style({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
});

export const listItem = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 12px',
  backgroundColor: cssVarV2('layer/background/primary'),
  borderRadius: '6px',
  border: `1px solid ${cssVarV2('layer/insideBorder/border')}`,
  marginBottom: '8px',

  ':hover': {
    backgroundColor: cssVarV2('layer/background/hoverOverlay'),
  },
});

export const listItemMeta = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
});

export const progressLabel = style({
  fontSize: '12px',
  fontWeight: 500,
  color: cssVarV2('text/primary'),
  marginBottom: '4px',
});

export const progressSubLabel = style({
  fontSize: '11px',
  color: cssVarV2('text/secondary'),
});

export const statusColors = styleVariants({
  success: { color: cssVarV2('status/success') },
  warning: { color: cssVarV2('status/warning') },
  error: { color: cssVarV2('status/error') },
  info: { color: cssVar('primaryColor') },
});

export const statusIndicator = style({
  display: 'inline-block',
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  marginRight: '8px',
});

export const alert = style({
  padding: '8px 12px',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '12px',
  marginTop: '8px',
});

export const alertVariants = styleVariants({
  warning: [
    alert,
    {
      backgroundColor: cssVarV2('toast/iconColor/warning'),
      color: cssVarV2('status/warning'),
      border: `1px solid ${cssVarV2('status/warning')}`,
    },
  ],
  error: [
    alert,
    {
      backgroundColor: cssVarV2('toast/iconColor/error'),
      color: cssVarV2('status/error'),
      border: `1px solid ${cssVarV2('status/error')}`,
    },
  ],
});

export const noteArea = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const tagContainer = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
  marginTop: '8px',
});

export const tag = style({
  padding: '2px 6px',
  fontSize: '10px',
  backgroundColor: cssVarV2('layer/background/primary'),
  border: `1px solid ${cssVarV2('layer/insideBorder/border')}`,
  borderRadius: '3px',
  color: cssVarV2('text/secondary'),
});
