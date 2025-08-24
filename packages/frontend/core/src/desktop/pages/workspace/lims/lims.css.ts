import { cssVarV2 } from '@toeverything/theme/v2';
import { style } from '@vanilla-extract/css';

export const header = style({
  display: 'flex',
  alignItems: 'center',
  padding: '0 24px',
  height: '44px',
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  height: '100%',
  width: '100%',
  padding: '0 24px',
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '24px 0',
});

export const features = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '24px',
  marginTop: '32px',
});

export const feature = style({
  padding: '24px',
  borderRadius: '8px',
  backgroundColor: cssVarV2.layer.background.secondary,
});

export const featureTitle = style({
  margin: '0 0 12px 0',
  fontSize: '16px',
  fontWeight: '600',
  color: cssVarV2.text.primary,
});

export const featureDescription = style({
  margin: 0,
  fontSize: '14px',
  color: cssVarV2.text.secondary,
  lineHeight: '1.5',
});
