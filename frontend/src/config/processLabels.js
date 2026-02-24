/**
 * Punto único de verdad para nombres de procesos (display/labels).
 * Formato oficial: Title Case — solo primera letra de cada palabra en mayúscula.
 * NO modifica valores enviados al backend (proyecto/proceso siguen igual).
 */

// Labels oficiales para el valor del filtro de proceso (value → texto mostrado)
export const PROCESS_LABELS = {
  administrativa: 'Administracion',
  'company-man': 'Proyecto Cw Grm',
  frontera: 'Proyecto Frontera',
  petroservicios: 'Proyecto Petroservicios',
  zircon: 'Proyecto Zircon',
};

// Valores de BD que corresponden al proceso "Administracion" (gestión administrativa)
const PROYECTOS_ADMINISTRATIVOS = [
  'ADMINISTRACION',
  'COMPANY MAN - ADMINISTRACION',
  'ADMINISTRACION - STAFF',
  'FRONTERA - ADMINISTRACION',
  'Administrativo',
  'PETROSERVICIOS - ADMINISTRACION',
  'ADMINISTRACION COMPANY MAN',
  'ADMINISTRACION  COMPANY MAN',
];

// Valores de BD que corresponden al proceso "Proyecto Cw Grm" (Company Man / GRM)
const PROYECTOS_CW_GRM = [
  '3047761-4',
  'COMPANY MAN - APIAY',
  'COMPANY MAN',
  'COMPANY MAN - CPO09',
  'COMPANY MAN - GGS',
  'COMPANY MAN - CASTILLA',
  'COMPANY MAN GRM',
  'CW_Company Man',
];

/**
 * Dado un valor de proyecto (proyecto_usuario en BD), devuelve el nombre de proceso
 * para mostrar en UI, reportes, PDF, Excel. Acepta variantes (mayúsculas, guiones, etc.)
 * y las mapea al nombre oficial.
 * @param {string} proyecto - Valor de proyecto tal como viene de la BD/API
 * @returns {string} Label oficial del proceso (Title Case)
 */
export function getProcesoDisplayName(proyecto) {
  if (!proyecto || typeof proyecto !== 'string') {
    return 'Administracion';
  }
  const t = proyecto.trim();
  if (t === '') return 'Administracion';

  if (t === 'PETROSERVICIOS') return 'Proyecto Petroservicios';
  if (t === 'FRONTERA') return 'Proyecto Frontera';
  if (t === 'ZIRCON') return 'Proyecto Zircon';

  if (PROYECTOS_ADMINISTRATIVOS.includes(t)) return 'Administracion';
  if (PROYECTOS_CW_GRM.includes(t)) return 'Proyecto Cw Grm';

  // Variantes adicionales por si la BD tiene otras grafías
  const u = t.toUpperCase();
  if (u === 'PETROSERVICIOS') return 'Proyecto Petroservicios';
  if (u === 'FRONTERA') return 'Proyecto Frontera';
  if (u === 'ZIRCON') return 'Proyecto Zircon';
  if (PROYECTOS_ADMINISTRATIVOS.map(p => p.toUpperCase()).includes(u)) return 'Administracion';
  if (u.includes('COMPANY MAN') && (u.includes('GRM') || u.includes('CW'))) return 'Proyecto Cw Grm';
  if (PROYECTOS_CW_GRM.some(p => p.toUpperCase() === u || u.includes(p.toUpperCase()))) return 'Proyecto Cw Grm';

  return t;
}

/**
 * Label del filtro de proceso por su value (administrativa, company-man, etc.)
 * @param {string} processValue - value del select de proceso
 * @returns {string} Label oficial
 */
export function getProcessFilterLabel(processValue) {
  return PROCESS_LABELS[processValue] || processValue || '';
}
