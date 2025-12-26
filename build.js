// Custom build script that skips TypeScript checking
import { execSync } from 'child_process';

console.log('🚀 Building with Vite (skipping TypeScript checking)...');
try {
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('✅ Build successful!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

