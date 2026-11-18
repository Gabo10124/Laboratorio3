import { obtenerPlantas, agregarPlanta, regarPlanta, eliminarPlanta } from '../models/planta.ts';
import type { Planta } from '../models/planta.ts';

export class HuertoController {
  
  async obtenerListaPlantas(): Promise<Planta[]> {
    return await obtenerPlantas();
  }

  async registrarNuevaPlanta(nombre: string, especie: string, frecuencia: number, notas: string): Promise<void> {
    const hoy = new Date().toISOString().split('T')[0]; // Fecha actual YYYY-MM-DD
    const nueva: Planta = {
      nombre,
      especie,
      frecuencia_dias: frecuencia,
      ultimo_riego: hoy,
      notas
    };
    await agregarPlanta(nueva);
  }

  async realizarRiego(id: number): Promise<void> {
    const hoy = new Date().toISOString().split('T')[0];
    await regarPlanta(id, hoy);
  }

  async borrarPlanta(id: number): Promise<void> {
    await eliminarPlanta(id);
  }

  // Lógica creativa para calcular el estado de la planta
  calcularEstadoRiego(ultimoRiegoStr: string, frecuenciaDias: number): { texto: string, clase: string } {
    const ultimo = new Date(ultimoRiegoStr);
    const hoy = new Date();
    
    // Diferencia en días
    const diffTime = hoy.getTime() - ultimo.getTime();
    const diasTranscurridos = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diasTranscurridos >= frecuenciaDias) {
      return { texto: "⚠️ ¡Necesita agua urgente!", clase: "estado-urgente" };
    } else if (diasTranscurridos === frecuenciaDias - 1) {
      return { texto: "💧 Regar pronto (mañana)", clase: "estado-alerta" };
    } else {
      return { texto: "✨ Saludable e hidratada", clase: "estado-bien" };
    }
  }
}