// Choisit le mot de passe du mode maître de jeu et écrit son empreinte dans js/config.js.
// Usage : node tools/mj-motdepasse.mjs        (le mot de passe est demandé, sans s'afficher)
//         node tools/mj-motdepasse.mjs --off  (retire le verrou)
import { readFileSync, writeFileSync } from 'node:fs';
import { randomBytes, webcrypto } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const CONFIG = fileURLToPath(new URL('../js/config.js', import.meta.url));
const ITER = 200000;

// Entrée redirigée (pas de terminal) : on lit toutes les lignes une fois, puis une par question
let piped = null;
function pipedLines() {
  piped ||= new Promise((resolve) => {
    let s = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (d) => { s += d; });
    process.stdin.on('end', () => resolve(s.split(/\r?\n/)));
  });
  return piped;
}
function askHidden(question) {
  return new Promise((resolve) => {
    const { stdin, stdout } = process;
    stdout.write(question);
    if (!stdin.isTTY) { pipedLines().then((l) => { stdout.write('\n'); resolve(l.shift() ?? ''); }); return; }
    let s = '';
    stdin.setRawMode(true); stdin.resume(); stdin.setEncoding('utf8');
    const onData = (ch) => {
      if (ch === '\r' || ch === '\n') { stdin.setRawMode(false); stdin.pause(); stdin.off('data', onData); stdout.write('\n'); resolve(s); }
      else if (ch === '\u0003') { stdout.write('\n'); process.exit(1); }
      else if (ch === '\u007f' || ch === '\b') s = s.slice(0, -1);
      else s += ch;
    };
    stdin.on('data', onData);
  });
}

async function hash(password, salt) {
  const enc = new TextEncoder();
  const key = await webcrypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await webcrypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations: ITER }, key, 256);
  return Buffer.from(bits).toString('hex');
}

function write(lock) {
  const src = readFileSync(CONFIG, 'utf8');
  const line = `export const MJ_LOCK = { salt: '${lock.salt}', iter: ${lock.iter}, hash: '${lock.hash}' };`;
  if (!/export const MJ_LOCK = .*;/.test(src)) throw new Error('MJ_LOCK introuvable dans js/config.js');
  writeFileSync(CONFIG, src.replace(/export const MJ_LOCK = .*;/, line));
}

if (process.argv.includes('--off')) {
  write({ salt: '', iter: ITER, hash: '' });
  console.log('Verrou du mode MJ retiré.');
} else {
  const pw = await askHidden('Mot de passe MJ : ');
  if (pw.length < 4) { console.error('Mot de passe trop court (4 caractères minimum).'); process.exit(1); }
  const pw2 = await askHidden('Confirmer : ');
  if (pw !== pw2) { console.error('Les deux saisies ne correspondent pas.'); process.exit(1); }
  const salt = randomBytes(16).toString('hex');
  write({ salt, iter: ITER, hash: await hash(pw, salt) });
  console.log('Empreinte écrite dans js/config.js. Commit et push pour la publier.');
}
