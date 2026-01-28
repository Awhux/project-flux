import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

async function removeOldGenerated() {
  const generatedDir = join(__dirname, '../prisma/generated');
  if (existsSync(generatedDir)) {
    rmSync(generatedDir, { recursive: true });
  }
}

removeOldGenerated().catch((error) => {
  console.error('Failed to remove old generated prisma schema:');
  console.error(error);
  process.exit(1);
});
