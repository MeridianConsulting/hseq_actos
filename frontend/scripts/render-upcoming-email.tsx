/*
  Script para renderizar correo con React Email y enviarlo vía backend.
  Uso:
    - Variables de entorno (opcional):
        HSEQ_BASE_URL=http://localhost/hseq/backend/index.php
        HSEQ_ADMIN_CEDULA=1011202252
        HSEQ_ADMIN_PASSWORD=1011202252
        DAYS_BEFORE=5
        MAIL_SUBJECT=[HSEQ] Reportes próximos a vencer
    - Ejecutar:  npm run email:upcoming
*/
import * as React from 'react';
import path from 'path';
import dotenv from 'dotenv';
import { render } from '@react-email/render';
import UpcomingReportsEmail from '../emails/UpcomingReportsEmail';

type LoginResponse = { success: boolean; token?: string; message?: string };
type UpcomingResponse = { success: boolean; upcoming: any[]; days_before: number };

// Cargar .env desde la raíz del proyecto (dos niveles arriba de este script)
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const BASE_URL = process.env.HSEQ_BASE_URL || 'http://localhost/hseq/backend/index.php';
const ADMIN_CEDULA = process.env.HSEQ_ADMIN_CEDULA || '';
const ADMIN_PASSWORD = process.env.HSEQ_ADMIN_PASSWORD || '';
const DAYS_BEFORE = Number(process.env.DAYS_BEFORE || '5');
const MAIL_SUBJECT = process.env.MAIL_SUBJECT || `[HSEQ] Reportes próximos a vencer (≤ ${DAYS_BEFORE} días)`;

async function main() {
  try {
    if (!ADMIN_CEDULA || !ADMIN_PASSWORD) {
      throw new Error('Faltan credenciales ADMIN: defina HSEQ_ADMIN_CEDULA y HSEQ_ADMIN_PASSWORD');
    }

    // Login para obtener token
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cedula: ADMIN_CEDULA, password: ADMIN_PASSWORD }),
    });
    const loginJson = (await loginRes.json()) as LoginResponse;
    if (!loginJson.success || !loginJson.token) {
      throw new Error('Login falló: ' + (loginJson.message || ''));
    }
    const token = loginJson.token;

    // Obtener próximos a vencer
    const upcomingRes = await fetch(`${BASE_URL}/api/reports/upcoming?days_before=${DAYS_BEFORE}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const upcomingJson = (await upcomingRes.json()) as UpcomingResponse;
    if (!upcomingJson.success) {
      throw new Error('Error obteniendo próximos a vencer');
    }

    if (!Array.isArray(upcomingJson.upcoming) || upcomingJson.upcoming.length === 0) {
      console.log('No hay reportes próximos a vencer. No se envía correo.');
      process.exit(0);
    }

    const html = render(
      React.createElement(UpcomingReportsEmail, {
        daysBefore: upcomingJson.days_before,
        reports: upcomingJson.upcoming as any[],
      })
    );

    // Enviar por backend a todos HSEQ
    const sendRes = await fetch(`${BASE_URL}/api/reports/notify-upcoming`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ days_before: DAYS_BEFORE, subject: MAIL_SUBJECT, html }),
    });
    const sendJson = await sendRes.json();
    if (!sendRes.ok || !sendJson.success) {
      console.error('Error al enviar:', sendJson);
      process.exit(1);
    }
    console.log(`Envío completado: ${sendJson.sent}/${sendJson.recipients}`);
  } catch (err: any) {
    console.error('Fallo del script:', err?.message || err);
    process.exit(1);
  }
}

// Node 18+ tiene fetch global; si no existe, intentar cargar node-fetch dinámicamente
declare const fetch: any;
if (typeof fetch === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // @ts-ignore
  global.fetch = require('node-fetch');
}

main();


