import { initDatabase, saveDatabase } from '../db/database';

export interface Planta {
  id?: number;
  nombre: string;
  especie: string;
  frecuencia_dias: number;
  ultimo_riego: string;
  notas: string;
}

export async function obtenerPlantas(): Promise<Planta[]> {
  const db = await initDatabase();
  const res = db.exec("SELECT * FROM plantas ORDER BY id DESC");
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
  const db = await initDatabase();
  db.run(
    `INSERT INTO plantas (nombre, especie, frecuencia_dias, ultimo_riego, notas) VALUES (?, ?, ?, ?, ?)`,
    [planta.nombre, planta.especie, planta.frecuencia_dias, planta.ultimo_riego, planta.notas]
  );
  saveDatabase();
}

export async function regarPlanta(id: number, nuevaFecha: string): Promise<void> {
  const db = await initDatabase();
  db.run(`UPDATE plantas SET ultimo_riego = ? WHERE id = ?`, [nuevaFecha, id]);
  saveDatabase();
}

export async function eliminarPlanta(id: number): Promise<void> {
  const db = await initDatabase();
  db.run(`DELETE FROM plantas WHERE id = ?`, [id]);
  saveDatabase();
}