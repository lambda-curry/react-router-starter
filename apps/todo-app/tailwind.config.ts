import baseConfig from '@todo-starter/config/tailwind';
import type { Config } from 'tailwindcss';

export default {
  ...baseConfig,
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx}'
  ]
} satisfies Config;

