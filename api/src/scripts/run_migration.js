import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
    try {
        const migrationPath = path.join(__dirname, '../database/migrations/migrate_current_to_initial_amount.sql');
        const migrationSQL = await fs.readFile(migrationPath, 'utf8');

        const statements = migrationSQL
            .split(';')
            .filter(statement => statement.trim())
            .map(statement => statement.trim() + ';');

        console.log('Starting migration...');

        for (const statement of statements) {
            await pool.query(statement);
        }

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration(); 