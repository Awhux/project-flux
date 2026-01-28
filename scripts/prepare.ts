import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { logger } from '../src/utils/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function prepareDatabase() {
  const rootDir = join(__dirname, '..');
  const envPath = join(rootDir, '.env');
  const envExamplePath = join(rootDir, '.env.example');

  if (!existsSync(envExamplePath)) {
    throw new Error('.env.example file not found. Please ensure your environment variables are properly configured.');
  }

  if (!existsSync(envPath)) {
    copyFileSync(envExamplePath, envPath);
  }
}

prepareDatabase().catch((error) => {
  logger.error('Failed to prepare database package:');
  logger.error(error);
  process.exit(1);
});
