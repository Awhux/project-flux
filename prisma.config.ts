import path from 'node:path';
import '@dotenvx/dotenvx/config';
import type { PrismaConfig } from 'prisma';
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: path.join('prisma'),
  datasource: {
    url: env('DATABASE_URL'),
    shadowDatabaseUrl: env('DATABASE_SHADOW_URL'),
  },
  migrations: {
    path: path.join('prisma', 'migrations')
  }
} satisfies PrismaConfig);
