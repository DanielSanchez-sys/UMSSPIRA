import { config } from 'dotenv';

// Busca el .env en apps/api y, si no está, en la raíz del repositorio
config({ path: ['.env', '../../.env'], quiet: true });