# 🌱 Huerto Urbano Virtual

Sitio web creativo desarrollado como proyecto de Programación Orientada a Eventos para la gestión y monitoreo en tiempo real de plantas y riegos mediante SQLite en el navegador.

## 🚀 Tecnologías Utilizadas
* **TypeScript & Vite:** Lógica del cliente y empaquetador web de alto rendimiento.
* **sql.js (SQLite en el navegador):** Motor relacional completo corriendo sobre WebAssembly (WASM).
* **localStorage:** Persistencia de datos local para mantener la información intacta entre sesiones y recargas de página.
* **HTML5 & CSS3:** Interfaz responsiva adaptada para dispositivos móviles y de escritorio.

## 📋 Funcionalidades (CRUD Completo)
* **Crear:** Registro de nuevas plantas indicando nombre, especie, frecuencia de riego (en días) y notas de cuidado.
* **Leer:** Listado dinámico de todas las plantas registradas en el huerto con tarjetas interactivas.
* **Actualizar:** Botón de acción rápida "Regar Hoy" que actualiza automáticamente la fecha del último riego y recalcula el estado de hidratación.
* **Eliminar:** Opción para retirar plantas del sistema con confirmación previa.
* **Estado Inteligente:** Cálculo automático en tiempo real que advierte visualmente si la planta está saludable, próxima a regar o necesita agua urgente.

## ⚙️ Cómo ejecutar el proyecto localmente

1. Clona este repositorio o descarga los archivos fuente.
2. Instala las dependencias del proyecto ejecutando en tu terminal:
   ```bash
   npm install