import { HuertoView } from './views/huertoView.ts';
import './style.css';

document.addEventListener('DOMContentLoaded', async () => {
  const view = new HuertoView();
  await view.render();
});