import { DatabaseManager } from './manager';
import { pool } from './config';

async function main() {
  const manager = new DatabaseManager();
  await manager.initialize();
  await pool.end();
}

main().catch(err => {
  console.error('❌ Initialization error:', err);
  process.exit(1);
});