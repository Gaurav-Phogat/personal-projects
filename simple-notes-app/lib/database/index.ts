// lib/database/index.ts
import { DatabaseManager } from './table-manager';

// Create a single instance
let dbInstance: DatabaseManager | null = null;

export async function getDatabase(): Promise<DatabaseManager> {
  if (!dbInstance) {
    dbInstance = new DatabaseManager();
    await dbInstance.connect();
    await dbInstance.initializeTables();
  }
  return dbInstance;
}

// Initialize database - call this when your app starts
export async function initializeDatabase(): Promise<void> {
  try {
    await getDatabase();
    console.log('🚀 Database ready!');
  } catch (error) {
    console.error('💥 Database initialization failed:', error);
    throw error;
  }
}

// Export for direct use
export { DatabaseManager };