// Sauvegarde en ligne via Firebase (offre gratuite « Spark », sans carte bancaire).
// Chaque personnage est un document : users/{uid}/insmv/{id}
const SDK = 'https://www.gstatic.com/firebasejs/10.14.1';
let fb = null, app = null, auth = null, db = null, readyPromise = null;

export const isConfigured = (config) => !!(config && config.apiKey && config.projectId);

export function init(config) {
  if (readyPromise) return readyPromise;
  readyPromise = (async () => {
    const [appMod, authMod, fsMod] = await Promise.all([
      import(`${SDK}/firebase-app.js`), import(`${SDK}/firebase-auth.js`), import(`${SDK}/firebase-firestore.js`),
    ]);
    fb = { ...appMod, ...authMod, ...fsMod };
    app = fb.initializeApp(config, 'insmv');
    auth = fb.getAuth(app);
    db = fb.getFirestore(app);
    await new Promise((resolve) => { const off = fb.onAuthStateChanged(auth, () => { off(); resolve(); }); });
  })().catch((e) => { readyPromise = null; throw e; });
  return readyPromise;
}
export const user = () => auth?.currentUser || null;
export async function signIn() {
  const provider = new fb.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  await fb.signInWithPopup(auth, provider);
}
export async function signOut() { if (auth) await fb.signOut(auth); }
function col() {
  const u = user();
  if (!u) throw Object.assign(new Error('Non connecté'), { auth: true });
  return fb.collection(db, 'users', u.uid, 'insmv');
}
export async function pull() {
  const snap = await fb.getDocs(col());
  const characters = {}, deleted = {};
  snap.forEach((d) => {
    const v = d.data();
    if (v.deleted) deleted[d.id] = v.updatedAt || 0;
    else if (v.json) characters[d.id] = JSON.parse(v.json);
  });
  return { characters, deleted };
}
export async function push(characters, deleted, since) {
  const c = col();
  const batch = fb.writeBatch(db);
  let n = 0;
  for (const ch of Object.values(characters)) {
    if ((ch.updatedAt || 0) <= since) continue;
    batch.set(fb.doc(c, ch.id), { json: JSON.stringify(ch), name: ch.nom || '', updatedAt: ch.updatedAt || Date.now(), deleted: false });
    n++;
  }
  for (const [id, ts] of Object.entries(deleted)) {
    if (ts <= since) continue;
    batch.set(fb.doc(c, id), { deleted: true, updatedAt: ts });
    n++;
  }
  if (n) await batch.commit();
  return n;
}
