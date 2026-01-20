/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#ffffff',
    background: '#5b2c87',
    tint: '#ffffff',
    icon: '#ffffff',
    tabIconDefault: '#b19cd9',
    tabIconSelected: '#ffffff',
  },
  dark: {
    text: '#ffffff',
    background: '#4a1f6b',
    tint: '#ffffff',
    icon: '#ffffff',
    tabIconDefault: '#b19cd9',
    tabIconSelected: '#ffffff',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` - Child-friendly rounded font */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
    /** Default font for children's app */
    default: 'ui-rounded',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    /** Android rounded alternative */
    rounded: 'sans-serif',
    mono: 'monospace',
    /** Default font for children's app */
    default: 'sans-serif',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    /** Default font for children's app */
    default: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', system-ui, sans-serif",
  },
});

// Child-friendly font family for the app
export const ChildFriendlyFont = Platform.select({
  ios: 'ui-rounded',
  android: 'sans-serif',
  default: 'sans-serif',
});
