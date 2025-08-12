// Sincroniza variables REACT_APP_* desde el .env del proyecto raíz hacia frontend/.env.local
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const rootEnvPath = path.resolve(__dirname, '..', '..', '.env');
const frontendEnvLocalPath = path.resolve(__dirname, '..', '.env.local');

try {
  if (!fs.existsSync(rootEnvPath)) {
    console.log('[sync-env] No se encontró .env en la raíz, se omite sincronización');
    process.exit(0);
  }
  const buf = fs.readFileSync(rootEnvPath);
  const parsed = dotenv.parse(buf);
  const lines = [];
  Object.keys(parsed).forEach((k) => {
    if (k.startsWith('REACT_APP_')) {
      lines.push(`${k}=${parsed[k]}`);
    }
  });
  const content = lines.join('\n') + (lines.length ? '\n' : '');
  fs.writeFileSync(frontendEnvLocalPath, content, 'utf8');
  console.log(`[sync-env] Variables REACT_APP_* sincronizadas en ${frontendEnvLocalPath} (${lines.length})`);
} catch (err) {
  console.error('[sync-env] Error:', err.message || err);
  process.exit(1);
}


