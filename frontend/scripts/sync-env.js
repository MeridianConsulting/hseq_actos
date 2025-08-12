// Sincroniza variables REACT_APP_* desde el .env del proyecto raíz hacia frontend/.env.local
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const rootEnvPath = path.resolve(__dirname, '..', '..', '.env');
const frontendEnvLocalPath = path.resolve(__dirname, '..', '.env.local');

try {
  if (!fs.existsSync(rootEnvPath)) {
    //
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
  //
} catch (err) {
  //
  process.exit(1);
}


