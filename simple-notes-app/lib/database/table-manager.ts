// lib/database/table-manager.ts
import { Pool } from 'pg';

interface TableColumn {
  name: string;
  type: string;
  constraints?: string;
}

interface TableSchema {
  name: string;
  columns: TableColumn[];
  indexes?: string[];
}

export class DatabaseManager {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }

  // Define your table structure here
  private getTableSchema(): TableSchema[] {
    return [
      {
        name: 'posts',
        columns: [
          { name: 'id', type: 'SERIAL', constraints: 'PRIMARY KEY' },
          { name: 'title', type: 'VARCHAR(255)', constraints: 'NOT NULL' },
          { name: 'content', type: 'TEXT' },
          { name: 'views', type: 'INTEGER', constraints: 'DEFAULT 0' },
          { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP' }
        ],
        indexes: [
          'CREATE INDEX IF NOT EXISTS idx_posts_title ON posts(title)',
          'CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC)'
        ]
      }
    ];
  }

  async connect(): Promise<void> {
    try {
      const client = await this.pool.connect();
      console.log('✅ Connected to PostgreSQL');
      client.release();
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async initializeTables(): Promise<void> {
    console.log('🔄 Initializing database tables...');
    
    try {
      const schemas = this.getTableSchema();
      
      for (const schema of schemas) {
        await this.createOrUpdateTable(schema);
      }
      
      // Create the update trigger function
      await this.createUpdateTrigger();
      
      console.log('✅ Database initialization completed');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  private async createOrUpdateTable(schema: TableSchema): Promise<void> {
    const { name, columns, indexes = [] } = schema;

    // Check if table exists
    const tableExists = await this.tableExists(name);
    
    if (!tableExists) {
      await this.createTable(schema);
      console.log(`✅ Created table: ${name}`);
    } else {
      await this.updateTableStructure(schema);
      console.log(`✅ Verified table: ${name}`);
    }

    // Create indexes
    for (const indexQuery of indexes) {
      await this.executeQuery(indexQuery);
    }
  }

  private async tableExists(tableName: string): Promise<boolean> {
    const query = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      );
    `;
    
    const result = await this.executeQuery(query, [tableName]);
    return result.rows[0].exists;
  }

  private async createTable(schema: TableSchema): Promise<void> {
    const { name, columns } = schema;
    
    const columnDefs = columns.map(col => 
      `${col.name} ${col.type} ${col.constraints || ''}`.trim()
    ).join(',\n    ');

    const createQuery = `
      CREATE TABLE ${name} (
        ${columnDefs}
      );
    `;

    await this.executeQuery(createQuery);
  }

  private async updateTableStructure(schema: TableSchema): Promise<void> {
    const { name, columns } = schema;

    // Get existing columns
    const existingCols = await this.getExistingColumns(name);
    const existingNames = existingCols.map(col => col.column_name);

    // Add new columns that don't exist
    for (const column of columns) {
      if (!existingNames.includes(column.name)) {
        const addColumnQuery = `
          ALTER TABLE ${name} 
          ADD COLUMN ${column.name} ${column.type} ${column.constraints || ''}
        `;
        
        await this.executeQuery(addColumnQuery);
        console.log(`  ➕ Added column: ${column.name}`);
      }
    }
  }

  private async getExistingColumns(tableName: string): Promise<any[]> {
    const query = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position;
    `;
    
    const result = await this.executeQuery(query, [tableName]);
    return result.rows;
  }

  private async createUpdateTrigger(): Promise<void> {
    // Create the trigger function for updating 'updated_at' timestamps
    const triggerFunction = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;

    const dropTrigger = `DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;`;
    
    const createTrigger = `
      CREATE TRIGGER update_posts_updated_at 
      BEFORE UPDATE ON posts 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `;

    await this.executeQuery(triggerFunction);
    await this.executeQuery(dropTrigger);
    await this.executeQuery(createTrigger);
  }

  private async executeQuery(query: string, params: any[] = []): Promise<any> {
    try {
      const result = await this.pool.query(query, params);
      return result;
    } catch (error) {
      console.error('❌ Query failed:', query.substring(0, 100) + '...');
      console.error('Error:', error);
      throw error;
    }
  }

  async closeConnection(): Promise<void> {
    await this.pool.end();
    console.log('✅ Database connection closed');
  }

  // Get the pool for direct database queries
  getPool(): Pool {
    return this.pool;
  }
}