import { DatabaseManager } from '../src/database/manager.js';
import { pool } from "../src/database/config.js";

async function run() {
  const manager = new DatabaseManager()
  await manager.initialize()
  await pool.end()
  console.log('✅ DB initialized')
}

run().catch(err => {
  console.error('DB init failed:', err)
  process.exit(1)
})