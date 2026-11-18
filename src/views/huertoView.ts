import { HuertoController } from '../controllers/huertoController.ts';
import type { Planta } from '../models/planta.ts';

export class HuertoView {
  private controller: HuertoController;
  private container: HTMLElement;

  constructor() {
    this.controller = new HuertoController();
    this.container = document.getElementById('app')!;
  }

  async render(): Promise<void> {
    this.container.innerHTML = `
      <header class="huerto-header">
        <h1>🌱 Huerto Urbano Virtual</h1>
        <p>Monitorea el crecimiento, los riegos y el estado de tus plantas en tiempo real.</p>
      </header>

      <main class="huerto-main">
        <section class="form-section">
          <h2>Registrar Nueva Planta</h2>
          <form id="planta-form">
            <div class="form-group">
              <label>Nombre de la planta:</label>
              <input type="text" id="nombre" required placeholder="Ej. Tomate Cherry de la terraza">
            </div>
            <div class="form-group">
              <label>Especie / Categoría:</label>
              <input type="text" id="especie" required placeholder="Ej. Hortaliza / Aromática">
            </div>
            <div class="form-group">
              <label>Frecuencia de riego (días):</label>
              <input type="number" id="frecuencia" min="1" required value="3">
            </div>
            <div class="form-group">
              <label>Notas de cuidado:</label>
              <textarea id="notas" placeholder="Ej. Le gusta el sol directo de la mañana..."></textarea>
            </div>
            <button type="submit" class="btn-primary">🌿 Plantar en el Huerto</button>
          </form>
        </section>

        <section class="list-section">
          <h2>Mis Plantas Registradas</h2>
          <div id="plantas-grid" class="plantas-grid">
            <!-- Las tarjetas se cargarán dinámicamente -->
          </div>
        </section>
      </main>
    `;

    this.attachEvents();
    await this.cargarTarjetasPlantas();
  }

  private async cargarTarjetasPlantas(): Promise<void> {
    const grid = document.getElementById('plantas-grid')!;
    const plantas = await this.controller.obtenerListaPlantas();

    if (plantas.length === 0) {
      grid.innerHTML = `<p class="empty-msg">Tu huerto está vacío. ¡Agrega tu primera planta arriba! 🌱</p>`;
      return;
    }

    grid.innerHTML = '';
    plantas.forEach((planta: Planta) => {
      const estado = this.controller.calcularEstadoRiego(planta.ultimo_riego, planta.frecuencia_dias);
      
      const card = document.createElement('div');
      card.className = `planta-card ${estado.clase}`;
      card.innerHTML = `
        <div class="card-header">
          <h3>${planta.nombre}</h3>
          <span class="badge">${planta.especie}</span>
        </div>
        <div class="card-body">
          <p><strong>Último riego:</strong> ${planta.ultimo_riego}</p>
          <p><strong>Frecuencia:</strong> Cada ${planta.frecuencia_dias} días</p>
          <p class="estado-text"><strong>Estado:</strong> ${estado.texto}</p>
          <p class="notas"><em>"${planta.notas || 'Sin notas adicionales'}"</em></p>
        </div>
        <div class="card-footer">
          <button class="btn-regar" data-id="${planta.id}">💧 Regar Hoy</button>
          <button class="btn-eliminar" data-id="${planta.id}">🗑️ Eliminar</button>
        </div>
      `;
      grid.appendChild(card);
    });

    this.attachCardEvents();
  }

  private attachEvents(): void {
    const form = document.getElementById('planta-form') as HTMLFormElement;
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Evita que la página se recargue
      
      const nombreInput = document.getElementById('nombre') as HTMLInputElement;
      const especieInput = document.getElementById('especie') as HTMLInputElement;
      const frecuenciaInput = document.getElementById('frecuencia') as HTMLInputElement;
      const notasInput = document.getElementById('notas') as HTMLTextAreaElement;

      if (!nombreInput || !especieInput || !frecuenciaInput) return;

      const nombre = nombreInput.value;
      const especie = especieInput.value;
      const frecuencia = parseInt(frecuenciaInput.value) || 3;
      const notas = notasInput ? notasInput.value : '';

      try {
        await this.controller.registrarNuevaPlanta(nombre, especie, frecuencia, notas);
        form.reset();
        await this.cargarTarjetasPlantas();
      } catch (error) {
        console.error("Error al registrar la planta:", error);
      }
    });
  }

  private attachCardEvents(): void {
    document.querySelectorAll('.btn-regar').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = Number((e.currentTarget as HTMLElement).getAttribute('data-id'));
        await this.controller.realizarRiego(id);
        await this.cargarTarjetasPlantas();
      });
    });

    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = Number((e.currentTarget as HTMLElement).getAttribute('data-id'));
        if (confirm('¿Estás seguro de quitar esta planta del huerto?')) {
          await this.controller.borrarPlanta(id);
          await this.cargarTarjetasPlantas();
        }
      });
    });
  }
}