import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { getServerEnv } from "@/lib/env";
import * as schema from "@/lib/db/schema";

declare global {
  // eslint-disable-next-line no-var
  var __harnessPool: Pool | undefined;
}

function getPool() {
  if (!globalThis.__harnessPool) {
    const env = getServerEnv();
    globalThis.__harnessPool = new Pool({
      connectionString: env.DATABASE_URL,
    });
  }

  return globalThis.__harnessPool;
}

export function getDb() {
  return drizzle(getPool(), { schema });
}
