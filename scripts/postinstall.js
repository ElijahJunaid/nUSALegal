#!/usr/bin/env node

import { execSync } from 'child_process';

const isCI = process.env.CI === 'true';

if (isCI) {
  console.log('Skipping nuxt prepare in CI');
} else {
  console.log('Running nuxt prepare...');
  try {
    execSync('nuxt prepare', { stdio: 'inherit' });
    console.log('Nuxt prepare completed successfully');
  } catch (error) {
    console.error('Nuxt prepare failed:', error.message);
    process.exit(1);
  }
}
