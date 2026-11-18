import initSqlJs from 'sql.js';
import type {Database} from 'sql.js';

let db: Database | null = null;
const DB_STORAGE_KEY = 'huerto_sqlite_db';

export async function initDatabase(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
  });

  // Intentar recuperar la base de datos guardada en localStorage
  const savedDb = localStorage.getItem(DB_STORAGE_KEY);
  if (savedDb) {
    const uInt8Array = new Uint8Array(JSON.parse(savedDb));
    db = new SQL.Database(uInt8Array);
  } else {
    db = new SQL.Database();
    createTables();
  }

  return db;
}

function createTables() {
  if (!db) return;
  
  // Creamos la tabla 'plantas' para nuestro huerto urbano
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
  saveDatabase();
}

export function saveDatabase() {
  if (!db) return;
  const data = db.export();
  const arr = Array.from(data);
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(arr));
}