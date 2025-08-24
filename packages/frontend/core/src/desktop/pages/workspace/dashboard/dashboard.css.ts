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
