/**
 * Normalizacion de nombres de procesos/proyectos para visualizaciones.
 * Objetivo: evitar categorias duplicadas (nombres antiguos vs nuevos).
 */

export const normalizeProcesoNombre = (rawName) => {
  const s0 = rawName === null || rawName === undefined ? '' : String(rawName);
  const s = s0.trim();
  if (!s) return s;

  // Normalizar espacios y underscores para comparaciones robustas.
  const normalizedSpaces = s.replace(/\s+/g, ' ');
  const noUnderscore = normalizedSpaces.replace(/_/g, ' ');
  const lower = noUnderscore.toLowerCase();

  // Equivalencias exactas solicitadas (con tolerancia de capitalizacion/underscores).
  if (lower === 'cw company man') return 'Proyecto CW GRM';
  if (lower === 'company man grm') return 'Proyecto CW GRM';
  if (lower === 'proyecto cw company man') return 'Proyecto CW GRM';

  // Regla explicita: el nombre de proyecto mal capitalizado "Proyecto Cw Grm"
  // debe pasar a GGS (esto es sensible a mayusculas/minusculas para no romper
  // el caso correcto "Proyecto CW GRM").
  if (noUnderscore === 'Proyecto Cw Grm') return 'Proyecto CW GGS';

  // Canonicos (si ya vienen bien).
  if (lower === 'proyecto cw ggs') return 'Proyecto CW GGS';
  if (lower === 'proyecto cw grm') return 'Proyecto CW GRM';

  // Heuristica por tokens para casos donde el backend entregue el proyecto "real".
  // Prioridad:
  // - Si menciona GGS, corresponde a GGS.
  // - Si menciona GRM, corresponde a GRM.
  if (lower.includes('ggs')) return 'Proyecto CW GGS';
  if (lower.includes('grm')) return 'Proyecto CW GRM';

  return s;
};

