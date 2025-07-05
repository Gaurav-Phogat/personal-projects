import { pool } from './config.js';
import { tables, TableSchema } from './schema.js';

export class DatabaseManager {
  /** Entry point: create/alter tables, indexes, triggers */
  async initialize(): Promise<void> {
    console.log('🔄 Initializing database...');

    console.log()

    await this.createUpdatedAtTriggerFunction();

    for (const table of tables) {
      await this.upsertTable(table);
      await this.upsertIndexes(table);
      await this.upsertTrigger(table.name);
    }

    console.log('✅ Database initialization complete');
  }

  /** CREATE TABLE IF NOT EXISTS + ADD COLUMN IF NOT EXISTS for each column */
  private async upsertTable({ name, columns }: TableSchema) {
    // 1) Create table skeleton if missing
    const colDefs = columns.map(c => `${c.name} ${c.definition}`).join(', ');
    await pool.query(`CREATE TABLE IF NOT EXISTS ${name} (${colDefs});`);

    // 2) Ensure each column exists
    for (const { name: colName, definition } of columns) {
      const sql = `
        ALTER TABLE ${name}
        ADD COLUMN IF NOT EXISTS ${colName} ${definition};
      `;
      await pool.query(sql);
    }

    console.log(`✅ Table ready: ${name}`);
  }

  /** CREATE INDEX IF NOT EXISTS ... */
  private async upsertIndexes({ indexes }: TableSchema) {
    if (!indexes) return;
    for (const idxSql of indexes) {
      await pool.query(idxSql);
      console.log(`✅ Executed index: ${idxSql.split('(')[0].trim()}`);
    }
  }

  /** Trigger function to auto-update updated_at */
  private async createUpdatedAtTriggerFunction() {
    const fn = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;
    await pool.query(fn);
    console.log('✅ Trigger function ready');
  }

  /** Attach trigger to a table */
  private async upsertTrigger(tableName: string) {
    await pool.query(`DROP TRIGGER IF EXISTS update_${tableName}_updated_at ON ${tableName};`);

    const trg = `
      CREATE TRIGGER update_${tableName}_updated_at
      BEFORE UPDATE ON ${tableName}
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `;
    await pool.query(trg);
    console.log(`✅ Trigger attached: update_${tableName}_updated_at`);
  }
}