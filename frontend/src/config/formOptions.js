// Configuración de opciones para los formularios
export const instalaciones = [
  { value: 'area_perforacion_exploratoria', label: 'Área de perforación Exploratoria' },
  { value: 'campamentos', label: 'Campamentos' },
  { value: 'campo_produccion', label: 'Campo de Producción' },
  { value: 'casinos', label: 'Casinos' },
  { value: 'oleoductos_poliductos_gasoductos', label: 'Oleoductos / Poliductos / Gasoductos' },
  { value: 'parqueaderos', label: 'Parqueaderos' },
  { value: 'plataformas_perforacion', label: 'Plataformas de Perforación' },
  { value: 'pozos', label: 'Pozos' },
  { value: 'vias_primarias_secundarias', label: 'Vías primarias y secundarias' },
  { value: 'epp', label: 'Elementos de protección personal (EPP)' },
  { value: 'otras', label: 'Otras' }
];

export const tiposHallazgo = [
  { value: 'accion_mejoramiento', label: 'Acción de mejoramiento' },
  { value: 'aspecto_positivo', label: 'Aspecto positivo' },
  { value: 'condicion_insegura', label: 'Condición insegura' },
  { value: 'acto_inseguro', label: 'Acto inseguro' }
];

export const estadosCondicion = [
  { value: 'abierta', label: 'Abierta' },
  { value: 'cerrada', label: 'Cerrada' }
];

export const gradosCriticidad = [
  { value: 'bajo', label: 'Bajo' },
  { value: 'medio', label: 'Medio' },
  { value: 'alto', label: 'Alto' },
  { value: 'critico', label: 'Crítico' }
];

export const tiposAfectacion = [
  { value: 'personas', label: 'Personas' },
  { value: 'medio_ambiente', label: 'Medio Ambiente' },
  { value: 'instalaciones', label: 'Instalaciones' },
  { value: 'vehiculos', label: 'Vehículos' },
  { value: 'seguridad_procesos', label: 'Seguridad de los procesos' },
  { value: 'operaciones', label: 'Operaciones' }
];

export const tiposConversacion = [
  { value: 'reflexion', label: 'Reflexión' },
  { value: 'conversacion', label: 'Conversación' }
];

export const tiposPqr = [
  { value: 'peticion', label: 'Petición' },
  { value: 'queja', label: 'Queja' },
  { value: 'reclamo', label: 'Reclamo' },
  { value: 'inquietud', label: 'Inquietud' }
];

export const reportTypes = [
  {
    id: 'incidentes',
    title: '1. Incidentes HSE',
    description: 'Reporta incidentes de seguridad, salud y medio ambiente',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z',
    gradient: 'from-red-500 to-red-600',
    hoverGradient: 'from-red-600 to-red-700'
  },
  {
    id: 'hallazgos',
    title: '2. Hallazgos y condiciones inseguras',
    description: 'Identifica y reporta condiciones y actos inseguros',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    gradient: 'from-yellow-500 to-yellow-600',
    hoverGradient: 'from-yellow-600 to-yellow-700'
  },
  {
    id: 'conversaciones',
    title: '3. Conversaciones y reflexiones HSE',
    description: 'Registra conversaciones sobre seguridad y reflexiones',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    gradient: 'from-green-500 to-green-600',
    hoverGradient: 'from-green-600 to-green-700'
  },
  {
    id: 'pqr',
    title: '4. PQR - Peticiones, Quejas y Reclamos',
    description: 'Presenta peticiones, quejas, reclamos o inquietudes',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    gradient: 'from-blue-500 to-blue-600',
    hoverGradient: 'from-blue-600 to-blue-700'
  }
]; 