/**
 * Punto único de verdad para nombres de procesos (display/labels).
 * Proyecto CW GRM = Company Man GRM; Proyecto CW GGS = resto Company Man (GGS, APIAY, etc.).
 * NO modifica valores enviados al backend (proyecto/proceso siguen igual).
 */

// Labels oficiales para el valor del filtro de proceso (value → texto mostrado)
export const PROCESS_LABELS = {
  administrativa: 'Administracion',
  'company-man-grm': 'Proyecto CW GRM',
  'company-man-ggs': 'Proyecto CW GGS',
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

// Valores de BD que corresponden al proceso "Proyecto CW GRM" (Company Man GRM)
const PROYECTOS_CW_GRM = [
  'COMPANY MAN GRM',
  'CW_Company Man',
];

// Valores de BD que corresponden al proceso "Proyecto CW GGS" (Company Man GGS y otros)
const PROYECTOS_CW_GGS = [
  '3047761-4',
  'COMPANY MAN - APIAY',
  'COMPANY MAN',
  'COMPANY MAN - CPO09',
  'COMPANY MAN - GGS',
  'COMPANY MAN - CASTILLA',
];

/** Valores proyecto para filtro "Proyecto CW GRM" (incluye históricos Company Man Grm) */
export const PROYECTOS_FILTER_CW_GRM = PROYECTOS_CW_GRM.join(',');
/** Valores proyecto para filtro "Proyecto CW GGS" (incluye históricos Proyecto Cw Grm) */
export const PROYECTOS_FILTER_CW_GGS = PROYECTOS_CW_GGS.join(',');

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
  if (PROYECTOS_CW_GRM.includes(t)) return 'Proyecto CW GRM';
  if (PROYECTOS_CW_GGS.includes(t)) return 'Proyecto CW GGS';

  // Variantes adicionales por si la BD tiene otras grafías (case-insensitive)
  const u = t.toUpperCase();
  if (u === 'PETROSERVICIOS') return 'Proyecto Petroservicios';
  if (u === 'FRONTERA') return 'Proyecto Frontera';
  if (u === 'ZIRCON') return 'Proyecto Zircon';
  if (PROYECTOS_ADMINISTRATIVOS.map(p => p.toUpperCase()).includes(u)) return 'Administracion';
  if (PROYECTOS_CW_GRM.some(p => p.toUpperCase() === u || u.includes(p.toUpperCase()))) return 'Proyecto CW GRM';
  if (PROYECTOS_CW_GGS.some(p => p.toUpperCase() === u || u.includes(p.toUpperCase()))) return 'Proyecto CW GGS';
  if (u.includes('COMPANY MAN') && (u.includes('GRM') || u === 'CW_COMPANY MAN')) return 'Proyecto CW GRM';
  if (u.includes('COMPANY MAN') || u.includes('3047761-4')) return 'Proyecto CW GGS';

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
