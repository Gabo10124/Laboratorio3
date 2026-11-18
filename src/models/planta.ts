import { initDatabase, saveDatabase } from '../db/database.ts';
import type { Database } from 'sql.js';

export interface Planta {
  id?: number;
  nombre: string;
  especie: string;
  frecuencia_dias: number;
  ultimo_riego: string;
  notas: string;
}

export async function obtenerPlantas(): Promise<Planta[]> {
  const db: Database = await initDatabase();
  const res = db.exec("SELECT * FROM plantas ORDER BY id DESC;");
  if (res.length === 0) return [];

  const columns = res[0].columns;
  const values = res[0].values;

  return values.map((row) => {
    const planta: any = {};
    columns.forEach((col, index) => {
      planta[col] = row[index];
    });
    return planta as Planta;
  });
}

export async function agregarPlanta(planta: Planta): Promise<void> {
  const db: Database = await initDatabase();
  db.run(
    `INSERT INTO plantas (nombre, especie, frecuencia_dias, ultimo_riego, notas) VALUES (?, ?, ?, ?, ?);`,
    [planta.nombre, planta.especie, planta.frecuencia_dias, planta.ultimo_riego, planta.notas]
  );
  saveDatabase(db);
}

export async function regارPlanta(id: number, nuevaFecha: string): Promise<void> { // (o regarPlanta)
  const db: Database = await initDatabase();
  db.run(
    `UPDATE plantas SET ultimo_riego = ? WHERE id = ?;`,
    [nuevaFecha, id]
  );
  saveDatabase(db);
}

// Nota: Asegúrate de que el nombre de la función exportada sea exactamente regarPlanta:
export async function regarPlanta(id: number, nuevaFecha: string): Promise<void> {
  const db: Database = await initDatabase();
  db.run(
    `UPDATE plantas SET ultimo_riego = ? WHERE id = ?;`,
    [nuevaFecha, id]
  );
  saveDatabase(db);
}

export async function eliminarPlanta(id: number): Promise<void> {
  const db: Database = await initDatabase();
  db.run(`DELETE FROM plantas WHERE id = ?;`, [id]);
  saveDatabase(db);
}