// Configuration Firebase : même projet que le Grimoire WFRP (« grimoire-wfrp »).
// Ces valeurs ne sont pas secrètes : c'est la règle de sécurité Firestore qui protège les données
// (chaque compte ne peut lire et modifier que ses propres personnages).
// Les personnages INS/MV sont rangés dans users/{uid}/insmv, à part de ceux du WFRP.
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDkqzmJULyB80JyJDdexX43t7fgsrEwgR4',
  authDomain: 'grimoire-wfrp.firebaseapp.com',
  projectId: 'grimoire-wfrp',
  storageBucket: 'grimoire-wfrp.firebasestorage.app',
  messagingSenderId: '1069878600833',
  appId: '1:1069878600833:web:5c43750aa4188833609980',
};

// Mot de passe du mode maître de jeu (empreinte PBKDF2, pas le mot de passe lui-même).
// Hash vide = mode MJ ouvert à tous. Pour choisir ou changer le mot de passe : node tools/mj-motdepasse.mjs
export const MJ_LOCK = { salt: 'fdaa40b2812f059b054a6fe7f1f3ea44', iter: 200000, hash: '3b788fe6a3ed4b31cc512420d92a491ba9cb92e38e32030c42569863271a5a11' };
