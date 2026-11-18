import initSqlJs from 'sql.js';
import type { Database } from 'sql.js';

let db: Database | null = null;

export async function initDatabase(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
  });

  const savedDb = localStorage.getItem('huerto_sqlite_db');
  if (savedDb) {
    const uInt8Array = new Uint8Array(JSON.parse(`[${savedDb}]`));
    db = new SQL.Database(uInt8Array);
  } else {
    db = new SQL.Database();
    db.run(`
      CREATE TABLE IF NOT EXISTS plantas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        especie TEXT NOT NULL,
        frecuencia_dias INTEGER NOT NULL,
        ultimo_riego TEXT NOT NULL,
        notas TEXT
      );
    `);
    saveDatabase(db);
  }

  return db;
}

export function saveDatabase(database: Database): void {
  const data = database.export();
  const arr = Array.from(data);
  localStorage.setItem('huerto_sqlite_db', arr.toString());
}