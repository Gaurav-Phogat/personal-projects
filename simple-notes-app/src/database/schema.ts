export interface TableColumn {
  name: string;
  definition: string;   // e.g. "SERIAL PRIMARY KEY" or "INTEGER REFERENCES users(id)"
}

export interface TableSchema {
  name: string;
  columns: TableColumn[];
  indexes?: string[];   // raw SQL strings using IF NOT EXISTS
}

export const tables: TableSchema[] = [
  {
    name: 'posts',
    columns: [
      { name: 'id',         definition: 'SERIAL PRIMARY KEY' },
      { name: 'user_id', definition: 'INTEGER' },
      { name: 'title',      definition: 'VARCHAR(255) NOT NULL' },
      { name: 'content',    definition: 'TEXT' },
      { name: 'views',      definition: 'INTEGER DEFAULT 0' },
      { name: 'created_at', definition: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
      { name: 'updated_at', definition: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
    ],
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_posts_title      ON posts(title)',
      'CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC)',
    ],
  },
];