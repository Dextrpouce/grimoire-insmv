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
// L'interface fournit une fenêtre de connexion (Google ou e-mail) qui se résout une fois connecté
// et échoue avec le code « auth/popup-closed-by-user » si on la ferme.
let loginUI = null;
export const setLoginUI = (fn) => { loginUI = fn; };
export async function signIn() { if (loginUI) return loginUI(); return signInGoogle(); }
export async function signInGoogle() {
  const provider = new fb.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  await fb.signInWithPopup(auth, provider);
}
export async function signInEmail(email, password) {
  await fb.signInWithEmailAndPassword(auth, email.trim(), password);
}
export async function signUpEmail(email, password, name) {
  const cred = await fb.createUserWithEmailAndPassword(auth, email.trim(), password);
  if (name && name.trim()) await fb.updateProfile(cred.user, { displayName: name.trim() });
}
export async function resetPassword(email) {
  auth.languageCode = 'fr';
  await fb.sendPasswordResetEmail(auth, email.trim());
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
// ----- Table de jeu (module MJ) : groups/{code} -----
// Même collection et mêmes champs que les groupes du Grimoire WFRP (les règles Firestore existantes s'appliquent).
// json = { kind: 'insmv', gm: { uid, name }, chars: { [idPerso]: { owner, player, json, updatedAt } } }
const tableDoc = (id) => fb.doc(db, 'groups', id);
const me = () => { const u = user(); if (!u) throw Object.assign(new Error('Non connecté'), { auth: true }); return u; };
const meName = (u) => u.displayName || u.email || 'Joueur';

export async function createTable(id, name) {
  const u = me();
  const state = { kind: 'insmv', gm: { uid: u.uid, name: meName(u) }, chars: {} };
  await fb.setDoc(tableDoc(id), {
    name, members: [u.uid], memberNames: { [u.uid]: meName(u) },
    json: JSON.stringify(state), updatedAt: Date.now(), createdAt: Date.now(),
  });
}
// asGm : ouverture côté maître de jeu, réservée au compte qui a créé la table
export async function joinTable(id, { asGm = false } = {}) {
  const u = me();
  return fb.runTransaction(db, async (tx) => {
    const snap = await tx.get(tableDoc(id));
    if (!snap.exists()) throw new Error('Code de table inconnu');
    const d = snap.data();
    const st = JSON.parse(d.json || '{}');
    if (st.kind !== 'insmv') throw new Error('Ce code n\'est pas une table INS/MV');
    if (asGm && st.gm?.uid !== u.uid) throw new Error('Seul le compte qui a créé cette table peut l\'ouvrir en maître de jeu');
    if (!d.members.includes(u.uid)) {
      tx.update(tableDoc(id), { members: [...d.members, u.uid], memberNames: { ...d.memberNames, [u.uid]: meName(u) } });
    }
    return d.name;
  });
}
// fn(state, uid, nom) modifie l'état ; renvoie false pour ne rien écrire
export async function updateTable(id, fn) {
  const u = me();
  return fb.runTransaction(db, async (tx) => {
    const snap = await tx.get(tableDoc(id));
    if (!snap.exists()) throw new Error('Table introuvable');
    const st = JSON.parse(snap.data().json || '{}');
    if (fn(st, u.uid, meName(u)) === false) return false;
    tx.update(tableDoc(id), { json: JSON.stringify(st), updatedAt: Date.now() });
    return true;
  });
}
export function watchTable(id, onData, onError) {
  return fb.onSnapshot(tableDoc(id), (snap) => {
    if (!snap.exists()) { onError?.(new Error('Table introuvable')); return; }
    const d = snap.data();
    onData({ id, name: d.name, members: d.memberNames || {}, state: JSON.parse(d.json || '{}'), updatedAt: d.updatedAt || 0 });
  }, (e) => onError?.(e));
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
