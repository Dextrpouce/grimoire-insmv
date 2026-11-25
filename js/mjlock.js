// Verrou du mode maître de jeu : mot de passe demandé une fois par appareil.
// Seule une empreinte du mot de passe (PBKDF2) est publiée dans config.js ; pour la changer :
//   node tools/mj-motdepasse.mjs
// C'est un verrou de confort entre amis : les fichiers de l'appli restent publics.
import { MJ_LOCK } from './config.js';

const KEY = 'insmv.mjOk';
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

export async function hashMJ(password, salt, iter) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('Ce navigateur ne permet pas de vérifier le mot de passe (page non sécurisée)');
  const enc = new TextEncoder();
  const key = await subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations: iter }, key, 256);
  return hex(bits);
}

export const mjLock = {
  get enabled() { return !!(MJ_LOCK && MJ_LOCK.hash); },
  get unlocked() { return !this.enabled || localStorage.getItem(KEY) === MJ_LOCK.hash; },
  async tryUnlock(password) {
    if (!this.enabled) return true;
    const h = await hashMJ(password, MJ_LOCK.salt, MJ_LOCK.iter);
    if (h !== MJ_LOCK.hash) return false;
    localStorage.setItem(KEY, h);
    return true;
  },
  lock() { localStorage.removeItem(KEY); },
};
