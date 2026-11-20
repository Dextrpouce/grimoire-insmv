// Configuration Firebase : même projet que le Grimoire WFRP (« grimoire-wfrp »).
// Ces valeurs ne sont pas secrètes : c'est la règle de sécurité Firestore qui protège les données
// (chaque compte Google ne peut lire et modifier que ses propres personnages).
// Les personnages INS/MV sont rangés dans users/{uid}/insmv, à part de ceux du WFRP.
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDkqzmJULyB80JyJDdexX43t7fgsrEwgR4',
  authDomain: 'grimoire-wfrp.firebaseapp.com',
  projectId: 'grimoire-wfrp',
  storageBucket: 'grimoire-wfrp.firebasestorage.app',
  messagingSenderId: '1069878600833',
  appId: '1:1069878600833:web:5c43750aa4188833609980',
};
