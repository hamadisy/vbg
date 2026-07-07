import { createTheme, type Theme } from '@mui/material/styles';

// Sampled from the CSVVDH logo (img/csvvdh-logo.png): dark green -> lime green
// gradient wordmark, warm gold tagline, white background.
const CSVVDH_DARK_GREEN = '#1B5E20';
const CSVVDH_LIME_GREEN = '#8BC34A';
const CSVVDH_GOLD = '#F5C842';

export function createAppTheme(direction: 'ltr' | 'rtl'): Theme {
  return createTheme({
    direction,
    palette: {
      primary: { main: CSVVDH_DARK_GREEN, contrastText: '#FFFFFF' },
      secondary: { main: CSVVDH_LIME_GREEN, contrastText: '#1B5E20' },
      // Reused as the brand's warm-gold accent (not just error-adjacent warnings).
      warning: { main: CSVVDH_GOLD },
      background: { default: '#FFFFFF', paper: '#FFFFFF' },
    },
    typography: {
      // System font stack - safest broad coverage across fr/ar/pulaar/wolof/soninké
      // without bundling a custom webfont for this pass.
      fontFamily:
        'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    shape: {
      borderRadius: 8,
    },
  });
}
