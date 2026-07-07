import createCache, { type EmotionCache } from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

export function createEmotionCache(direction: 'ltr' | 'rtl'): EmotionCache {
  return direction === 'rtl'
    ? createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] })
    : createCache({ key: 'mui' });
}
