// Règles d'IN NOMINE SATANIS / MAGNA VERITAS 4e édition
// Convention : toutes les valeurs sont stockées en RANGS (entiers). Niveau 2 = rang 4, niveau 2+ = rang 5.
import { SUPERIEURS, supByName } from './data/superieurs.js';
import { POUVOIRS } from './data/pouvoirs.js';
export { SUPERIEURS, supByName, POUVOIRS };

export const lvl = (r) => {
  if (r == null || isNaN(r)) return '—';
  if (r < 0) return '–' + lvl(-r);
  return Math.floor(r / 2) + (r % 2 ? '+' : '');
};
// "3+" -> 7
export const parseLvl = (s) => {
  const m = String(s).trim().match(/^(-?\d+)(\+?)$/);
  return m ? (+m[1]) * 2 + (m[2] ? 1 : 0) : null;
};
export const half = (r) => r / 2; // valeur numérique où « + » vaut 0,5
export const lvlInt = (r) => Math.floor(Math.max(0, r) / 2); // niveau sans tenir compte du +

// ================= Caractéristiques =================
export const CARACS = [
  { k: 'fo', n: 'Force', ab: 'Fo', phys: true },
  { k: 'ag', n: 'Agilité', ab: 'Ag', phys: true },
  { k: 'pe', n: 'Perception', ab: 'Pe', phys: true },
  { k: 'vo', n: 'Volonté', ab: 'Vo' },
  { k: 'pr', n: 'Présence', ab: 'Pr' },
  { k: 'foi', n: 'Foi', ab: 'Foi' }, // Chance pour les humains et non-alignés (même valeur)
];
export const caracName = (c, k) => (k === 'foi' && c && c.chance ? 'Chance' : CARACS.find((x) => x.k === k).n);

// ================= Talents =================
// cat : p = principal, s = secondaire, e = exotique, psi = talent psionique (exotique)
// car : caractéristique associée (null = niveau de base 1), inne : utilisable au niveau de base, kind : g générique, s spécifique, m multiple
const T = (n, cat, car, inne, kind = 'g', extra = {}) => ({ n, cat, car, inne, kind, ...extra });
export const TALENTS = [
  T('Baratin', 'p', 'pr', true), T('Combat', 'p', 'ag', true, 's'), T('Corps à corps', 'p', 'ag', true),
  T('Défense', 'p', 'ag', true), T('Discrétion', 'p', 'ag', true), T('Discussion', 'p', 'vo', true),
  T('Enquête', 'p', 'foi', true), T('Fouille', 'p', 'pe', true), T('Intrusion', 'p', null, false),
  T('Médecine', 'p', null, false), T('Séduction', 'p', 'pr', true), T('Tir', 'p', 'pe', true, 's'),
  T('Acrobatie', 's', 'ag', true), T('Aisance sociale', 's', 'pr', true), T('Art', 's', 'pr', false, 's'),
  T('Athlétisme', 's', 'fo', true), T('Conduite', 's', 'ag', false), T('Culture générale', 's', null, false, 's'),
  T('Hobby', 's', null, false, 'm'), T('Informatique', 's', null, false), T('Intimidation', 's', 'fo', true),
  T('Langues', 's', null, false, 'lang'), T('Métier', 's', null, false, 'm'), T('Navigation', 's', null, false),
  T('Pilotage', 's', null, false), T('Savoir criminel', 's', null, false, 's'), T('Savoir d\'espion', 's', null, false, 's'),
  T('Savoir militaire', 's', null, false, 's'), T('Savoir occulte', 's', null, false, 's'), T('Science', 's', null, false, 's'),
  T('Survie', 's', 'pe', false, 's'), T('Technique', 's', null, false, 's'),
  T('Contorsionnisme', 'e', 'ag', false), T('Humour', 'e', null, false), T('Hypnotisme', 'e', 'vo', false),
  T('Jeu', 'e', null, false), T('Kama sutra', 'e', null, false), T('Langage animal', 'e', 'pe', false),
  T('Narcolepsie', 'e', 'vo', false), T('Pickpocket', 'e', 'ag', false), T('Prestidigitation', 'e', 'ag', false),
  T('Sixième sens', 'e', 'foi', false), T('Torture', 'e', null, false), T('Ventriloquie', 'e', null, false),
  T('Pouvoirs cinétiques', 'psi', 'vo', false), T('Pouvoirs corporels', 'psi', 'vo', false),
  T('Pouvoirs dimensionnels', 'psi', 'vo', false), T('Pouvoirs martiaux', 'psi', 'vo', false),
  T('Pouvoirs offensifs', 'psi', 'vo', false), T('Pouvoirs psychiques', 'psi', 'vo', false),
];
export const talentDef = (n) => TALENTS.find((t) => t.n === n);
export const TALENT_INFO = {
  'Acrobatie': 'Sauter, marcher sur les mains ou une corde, courir sur les toits, grimper.',
  'Aisance sociale': 'Avoir l\'air cool, savoir quoi dire, étiquette.',
  'Art': 'Une spécialité par forme d\'art (chant, danse, dessin, écriture…).',
  'Athlétisme': 'Sports, course, nage, escalade, condition physique.',
  'Baratin': 'Mentir, embobiner, imiter quelqu\'un, marchander.',
  'Combat': 'Armes de contact ; une spécialité par famille d\'armes.',
  'Conduite': 'Véhicules terrestres : cascades, accidents, poursuites.',
  'Corps à corps': 'Combat à mains nues, prises, cornes…',
  'Culture générale': 'Connaissances sur un domaine choisi.',
  'Défense': 'Se défendre contre toutes les attaques (toujours ce talent en défense).',
  'Discrétion': 'Passer inaperçu ; en cas d\'échec, les gardes ont droit à un test de Perception.',
  'Discussion': 'Convaincre par une argumentation, éloquence face à une foule.',
  'Enquête': 'Mener une enquête, obtenir indices et témoignages.',
  'Fouille': 'Passer une pièce au peigne fin.',
  'Hobby': 'Un passe-temps (multiple).',
  'Humour': 'Test résisté par la Volonté : surprise ou +2 colonnes sur une attaque (une fois par combat).',
  'Hypnotisme': 'Ne fonctionne que sur des personnes consentantes !',
  'Informatique': 'Utiliser un ordinateur et des programmes.',
  'Intimidation': 'Sur les PNJ ; en combat, attaque + test résisté par la Volonté : –4 à la prochaine attaque adverse.',
  'Intrusion': 'Serrures, alarmes, codes, démarrer une voiture.',
  'Jeu': 'Stratégies gagnantes et triche aux jeux de hasard.',
  'Langage animal': 'Lire le langage corporel d\'un animal.',
  'Langues': 'Chaque langue s\'apprend séparément et n\'a pas de niveau.',
  'Médecine': 'Soigner, diagnostiquer, opérer. Permet aux anges et démons de refermer leurs blessures.',
  'Métier': 'Un métier (multiple).',
  'Narcolepsie': 'S\'endormir à volonté (facile) et contrôler ses rêves.',
  'Navigation': 'Véhicules marins.', 'Pilotage': 'Véhicules aériens.',
  'Pickpocket': 'Faire les poches (au moins très difficile si la cible n\'est pas distraite).',
  'Savoir criminel': 'Milieux criminels ; une spécialité par trafic.',
  'Savoir d\'espion': 'Écoute, interrogatoire, renseignement, infiltration.',
  'Savoir militaire': 'Discipline, tactique, stratégie, logistique, explosifs…',
  'Savoir occulte': 'Occultisme réel ou « vrai » monde d\'INS/MV. Ne permet aucun sort.',
  'Science': 'Une spécialité par champ scientifique.',
  'Séduction': 'Séduire.',
  'Sixième sens': 'Repérer naturellement le surnaturel (impression vague).',
  'Survie': 'Survivre dans un milieu donné.',
  'Technique': 'Construire des gadgets (mécanique, électronique, armurerie…).',
  'Tir': 'Armes à distance ; on peut utiliser le niveau d\'un pouvoir à distance s\'il est supérieur.',
  'Torture': 'Test résisté par la Volonté de la victime.',
};

// Niveau de base d'un talent (en rangs) : la moitié de la caractéristique, 1 si aucune
export function talentBase(c, name) {
  const t = talentDef(name);
  if (!t || !t.car) return 2;
  return lvlInt(c.car[t.car]);
}

// Catégorie effective d'un talent pour ce personnage (exotique -> principal, sauf si le supérieur le rend secondaire)
export function talentCat(c, name) {
  const t = talentDef(name);
  if (!t) return 's';
  if (t.cat === 'e' || t.cat === 'psi') {
    const sup = supByName(c.superieur);
    return sup && sup.exo && sup.exo.includes(name) ? 's' : 'p';
  }
  return t.cat;
}

// ================= Table Unique-Multiple =================
export const LN = ['x', 11, 12, 13, 15, 21, 23, 26, 33, 36, 43, 46, 53, 55, 61, 63, 64, 65, 66];
export const COL0 = 5; // rang 0 (niveau 0) -> seuil 21
export const DIFFICULTES = [
  { k: 'triviale', n: 'Triviale', s: null }, { k: 'facile', n: 'Facile', s: 4 }, { k: 'difficile', n: 'Difficile (standard)', s: 0 },
  { k: 'tres', n: 'Très difficile', s: -4 }, { k: 'incroyable', n: 'Incroyable', s: -8 }, { k: 'legendaire', n: 'Légendaire', s: -12 },
  { k: 'impossible', n: 'Impossible', s: null },
];
// seuil pour un test standard : rang du trait + décalage (colonnes). Retourne {seuil, eff, impossible}
export function seuilStandard(r, shift, risk = 0) {
  const eff = r + shift; // niveau modifié (sert aussi à la MR)
  let idx = Math.min(eff, 13) + COL0; // au-delà de 6+, on bloque sur 66
  idx -= risk; // la prise de risque part toujours de la colonne réelle (66 max)
  if (idx > 18) idx = 18;
  if (idx < 1) return { seuil: null, eff };
  return { seuil: LN[idx], eff };
}
export function seuilOppose(diffRangs, risk = 0) {
  let idx = 9 + diffRangs - risk;
  idx = Math.max(0, Math.min(18, idx));
  return LN[idx] === 'x' ? null : LN[idx];
}
export const MR_TXT = (mr) => (mr <= 0 ? 'Réussite limitée' : mr <= 3 ? 'Réussite faible' : mr <= 6 ? 'Réussite moyenne' : mr <= 9 ? 'Réussite forte' : 'Réussite exceptionnelle');
export const ECHEC_TXT = (ru) => (ru <= 3 ? 'Échec faible' : ru <= 5 ? 'Échec fort' : 'Catastrophe');

// Lancer d66+6 : trois dés [centaines, dizaines, unités]
export const d6 = () => 1 + Math.floor(Math.random() * 6);
export function rollD666() { return [d6(), d6(), d6()]; }

// Résout un test. opts : { r (rang), shift, risk, seuil (forcé), foi (rang), camp, mrBonus }
export function resolve(dice, opts) {
  const [a, b, u] = dice;
  const res = a * 10 + b;
  const triple = a === b && b === u;
  const double = a === b && !triple;
  const foiL = lvlInt(opts.foi || 0);
  const out = { dice, res, ru: u, double, triple, seuil: opts.seuil };
  const s111 = a === 1 && b === 1 && u === 1, s666 = a === 6 && b === 6 && u === 6;
  if (s111 || s666) {
    const good = (s111 && opts.camp === 'ange') || (s666 && opts.camp === 'demon');
    const bad = (s111 && opts.camp === 'demon') || (s666 && opts.camp === 'ange');
    out.divin = s111 ? 'unique' : 'bete';
    if (good || bad) {
      out.ru = s111 ? 12 : 8;
      out.ok = good;
      if (good) out.mr = out.ru + (opts.mrLevel ?? 0) + 2 * foiL + (opts.risk || 0) + (opts.mrBonus || 0);
      return out;
    }
  }
  if (opts.seuil == null) { out.ok = false; out.impossible = true; return out; }
  out.ok = res <= opts.seuil;
  if (out.ok) {
    out.mr = u + (opts.mrLevel ?? 0) + (double ? foiL : 0) + (triple ? 2 * foiL : 0) + (opts.risk || 0) + (opts.mrBonus || 0);
  }
  return out;
}

// ================= Valeurs annexes =================
export const TYPES = {
  ange: { n: 'Ange', camp: 'ange', pa: 100, bl: 3, foi: true, sup: true,
    q: { car: [20, 50], tal: [25, 50], pow: [20, 35], pp: [2, 10] }, max: { car: 11, tal: 15, pow: 5, pp: 15 } },
  demon: { n: 'Démon', camp: 'demon', pa: 80, bl: 2, foi: true, sup: true,
    q: { car: [16, 40], tal: [20, 40], pow: [20, 28], pp: [2, 8] }, max: { car: 10, tal: 14, pow: 4, pp: 15 } },
  humain: { n: 'Humain normal', camp: 'neutre', pa: 20, bl: 1, chance: true, nopp: true, src: 'base',
    q: { car: [0, 10], tal: [10, 20] }, max: { car: 7, tal: 7 } },
  heroique: { n: 'Humain héroïque', camp: 'neutre', pa: 40, bl: 1, chance: true, nopp: true, src: 'base',
    q: { car: [0, 15], tal: [25, 40] }, max: { car: 7, tal: 9 }, note: 'Une compétence (et une seule) peut atteindre 6+.' },
  serviteur: { n: 'Serviteur de Dieu', camp: 'ange', pa: 32, bl: 1, chance: true, src: 'base',
    q: { car: [0, 12], tal: [14, 32], pow: [0, 12] }, max: { car: 7, tal: 9, pow: 5, pp: 10 },
    note: 'Une caractéristique peut atteindre 4+ (talents associés 5+) ; un talent exotique peut être acheté comme secondaire. Pas une créature surnaturelle.' },
  soldat: { n: 'Soldat de Dieu', camp: 'ange', pa: 40, bl: 1, src: 'base',
    q: { car: [0, 16], tal: [15, 25], pow: [0, 18] }, max: { car: 9, tal: 9, pow: 7, pp: 15 }, note: 'Utilise la Foi mais n\'est pas une créature surnaturelle.' },
  fils: { n: 'Fils ou fille de Dieu', camp: 'ange', pa: 100, bl: 2, src: 'base',
    q: { car: [16, 40], tal: [30, 60], pow: [10, 24] }, max: { car: 11, tal: 15, pow: 9, pp: 25 }, note: 'Créature surnaturelle, fait rang égal avec les anges.' },
  mortvivant: { n: 'Mort-vivant', camp: 'demon', pa: 25, bl: 1.5, src: 'base',
    q: { car: [5, 15], tal: [0, 10], pow: [0, 20] }, max: { car: 9, tal: 9, pow: 5, pp: 10 },
    free: ['Anaérobiose', 'Apparence horrifique', 'Jeûne', 'Immunité contre les maladies et les poisons'], note: 'Ne ressent pas la douleur. Apparence horrifique à un niveau égal à la Présence.' },
  familier: { n: 'Familier', camp: 'demon', pa: 40, bl: 1.5, src: 'base',
    q: { car: [0, 16], tal: [10, 25], pow: [0, 30] }, max: { car: 9, tal: 9, pow: 7, pp: 15 } },
  incube: { n: 'Incube / succube', camp: 'demon', pa: 80, bl: 1.5, src: 'base',
    q: { car: [10, 30], tal: [25, 50], pow: [10, 21] }, max: { car: 11, tal: 15, pow: 9, pp: 25 } },
  combat: { n: 'Démon de combat', camp: 'demon', pa: 80, bl: 2, foi: true, sup: true, src: 'base',
    q: { car: [16, 40], tal: [20, 40], pow: [20, 28], pp: [2, 8] }, max: { car: 10, tal: 14, pow: 4, pp: 15 },
    free: ['Apparence horrifique', 'Forme de combat'], note: 'Apparence horrifique (= Présence) et Forme de combat (= Force) gratuits ; ne peut atteindre le grade 1.' },
  // ---- Petites Apocalypses : troisième Force ----
  psi: { n: 'Psionique', camp: 'neutre', bl: 1, chance: true, src: 'petapo', tiers: [
    ['« de base »', 40, [0, 15], [25, 35], [5, 15], 10, [7, 7], [9, 5], 5],
    ['Suchard', 60, [0, 17], [30, 45], [10, 25], 15, [7, 7], [9, 7], 7],
    ['Nutella', 80, [0, 19], [35, 55], [15, 35], 20, [7, 9], [9, 9], 9],
    ['Poulain', 100, [0, 21], [40, 65], [20, 45], 25, [7, 11], [9, 11], 11],
    ['100 % cacao', 120, [0, 23], [45, 75], [25, 55], 30, [7, 13], [9, 13], 13]],
    note: 'Caracs : max physiques/mentales. Talents : max ordinaires/psioniques. Utiliser un pouvoir demande un test du talent psionique associé (difficile, facile au calme, très difficile en combat) ; échec : –1 PF. Le niveau d\'un pouvoir ne peut dépasser son talent.' },
  paien: { n: 'Héros païen', camp: 'neutre', bl: 1.5, src: 'petapo', tiers: [
    ['« de base »', 60, [0, 30], [20, 40], [0, 20], 15, 11, 15, 7],
    ['Cool', 80, [0, 34], [25, 50], [5, 30], 20, 11, 15, 7],
    ['Wow', 100, [0, 38], [30, 60], [10, 40], 30, 13, 17, 11],
    ['Mégaclasse', 120, [0, 42], [35, 70], [15, 50], 40, 13, 19, 13]],
    note: 'Utilise la Foi (en ses dieux), créature surnaturelle. Les héros vikings achètent des runes au lieu de pouvoirs.' },
  renegat_d: { n: 'Démon renégat', camp: 'demon', bl: 2, src: 'petapo', sup: true, renegat: true, tiers: [
    ['grade 0', 80, [16, 40], [20, 40], [20, 28], 15, 11, 15, 5],
    ['grade 1', 100, [16, 44], [25, 50], [25, 38], 20, 11, 17, 7],
    ['grade 1+', 120, [16, 48], [30, 60], [30, 48], 25, 11, 17, 9]],
    note: 'Ne peut plus invoquer son ancien supérieur ; perd pouvoirs de grade et récupération conditionnelle. Apostat : Chance au lieu de Foi (rangs à prix double), aura grise.' },
  renegat_a: { n: 'Ange renégat', camp: 'ange', bl: 3, src: 'petapo', sup: true, renegat: true, tiers: [
    ['grade 0', 100, [20, 50], [25, 50], [20, 35], 15, 11, 15, 5],
    ['grade 1', 120, [20, 54], [30, 60], [25, 45], 20, 11, 17, 7]],
    note: 'Ne peut plus invoquer son ancien supérieur ; perd pouvoirs de grade et récupération conditionnelle. Apostat : Chance au lieu de Foi (rangs à prix double), aura grise.' },
  fee: { n: 'Fée (lutin, elfe, nymphe…)', camp: 'neutre', bl: 1.5, chance: true, src: 'petapo', tiers: [
    ['« de base »', 40, [5, 25], [20, 35], [0, 15], 10, 11, 15, 5],
    ['Renoncule', 60, [5, 30], [25, 45], [5, 25], 15, 11, 15, 7],
    ['Pâquerette', 80, [5, 35], [30, 55], [10, 35], 20, 11, 17, 9],
    ['Marguerite', 100, [5, 40], [35, 65], [15, 45], 25, 13, 17, 11],
    ['Tournesol', 120, [5, 45], [40, 75], [20, 55], 30, 13, 19, 13]],
    pouvoirs: 'Absorption d\'amour, Absorption d\'énergie sexuelle, Appel des animaux, Aura de confusion, Aura de pacification, Aura d\'inattention, Bénédiction : beauté, Bénédiction : fertilité, Bénédiction : guérison de folies, Bénédiction : guérison de maladies, Bénédiction : rajeunissement, Boomerang, Cauchemar, Charme, Contrôle des animaux, Déphasage, Détection des créatures invisibles, Esprit chaotique, Illusions, Invisibilité, Jeûne, Langage universel, Lecture d\'aura, Lire les pensées, Malédiction : folie, Malédiction : laideur, Malédiction : maladie, Malédiction : stérilité, Malédiction : vieillissement, Non-détection, Obscurité, Peur, Polymorphie, Psychométrie, Régénération, Rêve, Transformation, Voix impérieuse, Volonté supra-normale',
    note: 'Créature surnaturelle sans facilité de guérison. Chance (parfois Foi païenne).' },
  monstre: { n: 'Monstre (fantôme, expérience…)', camp: 'neutre', bl: 1.5, chance: true, src: 'petapo', tiers: [
    ['« de base »', 60, [30, 40], [10, 30], [0, 20], 10, [11, 7], 9, 7],
    ['Lino', 80, [32, 46], [10, 40], [5, 30], 20, [11, 9], 11, 7],
    ['Moquette', 100, [34, 52], [10, 50], [10, 40], 25, [13, 11], 13, 9],
    ['Parquet', 120, [36, 58], [10, 60], [15, 50], 30, [13, 11], 15, 9]],
    pouvoirs: 'Absorption de douleur, Absorption d\'énergie sexuelle, Adhérence, Apparence horrifique, Armure corporelle, Caméléon, Champ électrique, Conversion physique, Décharge électrique, Détection des ennemis, Élastique, Esquive acrobatique, Étouffement, Éventration, Graisse, Immunité contre l\'acide, Immunité contre l\'électricité, Jet d\'acide, Jet de flammes, Membre blindé, Membre exotique : crocs, Membre exotique : dard, Membre exotique : dents de sabre, Membre exotique : ergots, Membre exotique : grandes cornes, Membre exotique : griffes, Membre exotique : langue barbelée, Membre exotique : langue blindée, Membre exotique : ongles d\'acier, Membre exotique : petites cornes, Membre exotique : queue barbelée, Membre exotique : queue blindée, Membre exotique : sabots, Membre exotique : tentacules, Peau acide, Poison, Rebond, Régénération, Vitesse, Vol, Volonté supra-normale',
    note: 'Caracs : max Fo/Ag/Pe puis Vo/Pr/Ch. Créature surnaturelle.' },
};
// Liste des pouvoirs des psioniques (talent associé) et des héros païens
export const PSI_POUVOIRS = {
  'Pouvoirs cinétiques': ['Adhérence', 'Agitation moléculaire', 'Arrêt cardiaque', 'Champ de force', 'Conversion physique', 'Obscurité', 'Télékinésie', 'Vitesse', 'Vol'],
  'Pouvoirs corporels': ['Anaérobiose', 'Armure corporelle', 'Augmentation de Force', 'Augmentation de Perception', 'Immortalité', 'Immunité contre les maladies et les poisons', 'Jeûne', 'Polymorphie', 'Réduction', 'Régénération', 'Transfert de blessures'],
  'Pouvoirs dimensionnels': ['Cauchemar', 'Déphasage', 'Déplacement temporel', 'Détection du futur proche', 'Rêve', 'Téléportation'],
  'Pouvoirs martiaux': ['Arts martiaux', 'Augmentation d\'Agilité', 'Détection des ennemis', 'Esquive acrobatique', 'Étouffement', 'Frappe ultime'],
  'Pouvoirs offensifs': ['Aura de confusion', 'Aura d\'inattention', 'Charme', 'Détection du mensonge', 'Domination', 'Illusions', 'Invisibilité', 'Lire les pensées', 'Paralysie', 'Peur'],
  'Pouvoirs psychiques': ['Augmentation de Présence', 'Augmentation de Volonté', 'Boomerang', 'Conversion mentale', 'Esprits multiples', 'Psychométrie', 'Talent universel', 'Télépathie', 'Volonté supra-normale'],
};
export const PANTHEONS = {
  Celtes: 'Champ de force, Cri de guerre, Décharge électrique, Esquive acrobatique, Forme de combat, Frappe ultime, Furie, Jet de flammes, Marche sur l\'eau, Peur, Régénération, Sommeil, Transfert de blessures, Transformation, Vitesse',
  'Gréco-romains': 'Armure corporelle, Boomerang, Charme, Contrôle des animaux, Décharge électrique, Esquive acrobatique, Furie, Membre blindé, Peur, Phéromones, Polymorphie, Psychométrie, Régénération, Sommeil, Supériorité martiale, Transfert de blessures, Transformation, Vitesse, Vol, Volonté supra-normale',
  'Égyptiens': 'Caméléon, Déphasage, Frappe ultime, Lueur insoutenable, Poison, Régénération, Rêve, Sommeil, Trait d\'énergie, Transformation',
  Vikings: '(aucun pouvoir : runes)',
};
export const RUNES = [
  ['Art du combat', 18, 'Comme Supériorité martiale au niveau 4.'], ['Berserker', 18, 'Sur une blessure fatale : +5 PF, +5 rangs de Force, –2 colonnes en Combat et Défense, rage (2 × Volonté secondes) puis –10 PF.'],
  ['Divination', 12, 'Une fois par jour : Détection du futur proche (niveau = Volonté).'], ['Dur à cuire', 10, 'Immunisé à la chaleur et au froid ordinaires, aux maladies et poisons non magiques.'],
  ['Einherjars', 14, 'Une fois par jour : invoque Volonté guerriers spectraux pendant une minute.'], ['Éternel', 12, 'Comme Anaérobiose et Jeûne.'],
  ['Guérisseur', 8, 'Les blessés soignés par le porteur guérissent deux fois plus vite.'], ['Inflexible', 18, 'Une fois par jour : Protection de l\'âme et de l\'esprit pendant une minute.'],
  ['Messager de la mort', 10, 'Ceux qui l\'attaquent ou qu\'il attaque doivent réussir un test de Volonté pour ne pas fuir.'], ['Protection', 16, 'Comme le sort de basse sorcellerie, contre les forces du bien et du mal.'],
  ['Régénération', 14, 'Comme le pouvoir au niveau 2.'], ['Santé de fer', 16, 'Seuil de blessure légère = Force +2.'],
  ['Tel le vent', 12, 'Une fois par jour, dix minutes : Vol niveau 3.'], ['Transformation', 12, 'Une fois par jour, une heure : forme animale choisie.'],
];

export function typeOf(c) {
  const t = TYPES[c.type] || TYPES.ange;
  if (t.tiers) {
    const tier = t.tiers[c.tier || 0] || t.tiers[0];
    const [lab, pa, car, tal, pow, pp, mc, mt, mp] = tier;
    const mx = (v, i) => (Array.isArray(v) ? v[i] : v);
    return { ...t, tierName: lab, pa, q: { car, tal, pow, pp: [0, 99] }, max: { car: mx(mc, 1), carPhys: mx(mc, 0), tal: mx(mt, 0), talPsi: mx(mt, 1), pow: mp, pp } };
  }
  return t;
}
export const usesChance = (c) => !!c.chance;

// Seuils de blessure (BL en demi-niveaux), PF et PP de base
export function annexes(c) {
  const t = typeOf(c);
  const blBase = half(c.car.fo) + (t.bl ?? 2);
  const bl = Math.floor(blBase);
  return {
    pf: Math.floor(half(c.car.fo) + half(c.car.vo)),
    ppBase: t.nopp ? 0 : Math.floor(half(c.car.vo) + half(c.car.foi)),
    bl, bg: Math.floor(blBase * 2), bf: Math.floor(blBase * 3), ms: Math.floor(blBase * 4),
  };
}
export const ppMax = (c) => (typeOf(c).nopp ? 0 : annexes(c).ppBase + (+c.ppAchat || 0) + (+c.ppBonus || 0));

// ================= Grades =================
export const GRADES = [
  { g: 0, car: 11, tal: 15, pow: 5, pp: 15, txt: 'Aucun pouvoir de grade.' },
  { g: 1, car: 11, tal: 17, pow: 9, pp: 25, txt: 'PA > 0 pendant un mois, aucun blâme.' },
  { g: 2, car: 13, tal: 19, pow: 13, pp: 40, txt: 'PA > 10 pendant un an, Foi 3, PP > 20, aucun blâme.' },
  { g: 3, car: 15, tal: 21, pow: 17, pp: 60, txt: 'PA > 20 pendant cinq ans, Foi 5, PP > 30, aucun blâme, action d\'éclat. Caracs physiques limitées à 6+ dans un corps humain.' },
];
export const GRADE_POUVOIRS = ['—', 'Détection', 'Création mineure (Tentation / Sermon)', 'Perception', 'Création majeure (Ruine / Vertu)', 'Connaissance', 'Contrôle'];

// ================= Blessures =================
export const BLESSURES = {
  BL: { n: 'Blessure légère', pf: 1, malus: 0 },
  BG: { n: 'Blessure grave', pf: 2, malus: -2 },
  BF: { n: 'Blessure fatale', pf: 4, malus: -4 },
  MS: { n: 'Mort subite', pf: 12, malus: -12 },
};
export const GUERISON = { BL: ['Facile', 1], BG: ['Difficile', 2], BF: ['Très difficile', 4], MS: ['Incroyable', 12] };
export function woundMalus(c) {
  return (c.blessures || []).filter((b) => b.ouverte).reduce((m, b) => Math.min(m, BLESSURES[b.g]?.malus ?? 0), 0);
}

// ================= Armes et armures =================
export const ARMES = [
  ['Couteaux', [['Cran d\'arrêt', -1, -1, ''], ['Poignard ou saï', 0, 0, ''], ['Baïonnette', 0, 1, 'Adaptée à la charge']]],
  ['Épées', [['Rapière ou épée courte', 1, 1, ''], ['Épée longue', 0, 2, ''], ['Espadon ou katana (à deux mains)', -1, 3, '']]],
  ['Haches', [['Hachette (à une main)', -1, 2, 'Inadaptée à la parade'], ['Hache de bataille (à deux mains)', 0, 3, 'Inadaptée à la parade']]],
  ['Contondantes', [['Bâton (à deux mains)', 1, 0, ''], ['Matraque', 0, 1, 'Non-létale'], ['Masse d\'arme ou batte', -1, 2, ''], ['Marteau de guerre (à deux mains)', -2, 3, '']]],
  ['Armes diverses', [['Faux', -2, 2, 'Inadaptée à la parade'], ['Fléau', -1, 1, 'Parade difficile'], ['Fouet', 0, -4, 'Parade difficile'], ['Hallebarde ou arme d\'hast', -1, 2, 'Adaptée à la charge'], ['Lance', -1, 1, 'Adaptée à la charge']]],
  ['Armes improvisées', [['Chaise', -4, 1, 'Inadaptée à la parade'], ['Parcmètre', -5, 2, 'Inadaptée à la parade, Force minimale 4'], ['Lampadaire', -5, 3, 'Inadaptée à la parade, Force minimale 5'], ['Twingo', -6, 4, 'Aire d\'effet (très courte), Inadaptée à la parade, Force minimale 6'], ['Tronçonneuse', -4, 4, 'Dangereuse, Inadaptée à la parade, Pénétration importante']]],
  ['Mains nues', [['Coup de poing', 0, -3, 'Non-létal'], ['Coup de poing (poing américain)', 0, -2, 'Non-létal'], ['Coup de pied', -1, -2, 'Non-létal'], ['Coup de pied (botte ferrée)', -1, -1, 'Non-létal'], ['Coup de boule', -2, 0, 'Dangereuse, Non-létal'], ['Coup de boule (casque)', -2, 2, 'Non-létal'], ['Lutte', 0, -3, 'Non-létal'], ['Morsure', -2, -1, ''], ['Étranglement', -1, 0, 'Non-létal']]],
  ['Armes de poing', [['Revolver petit calibre', -2, 3, 'Pénétration importante, Portée moyenne'], ['Revolver gros calibre', -2, 4, 'Pénétration importante, Portée moyenne']]],
  ['Armes d\'épaule', [['Fusil à pompe', -2, 5, 'Portée moyenne'], ['Canon scié', -3, 6, 'Portée très courte'], ['Carabine', -1, 4, 'Pénétration importante, Portée longue'], ['Fusil à lunette', 0, 5, 'Pénétration importante, Portée extrême']]],
  ['Armes automatiques', [['Pistolet-mitrailleur', -2, 4, 'Attaque multiple, Pénétration importante, Portée moyenne'], ['Fusil-mitrailleur', -2, 5, 'Attaque multiple, Pénétration importante, Portée longue'], ['Mitrailleuse', -2, 9, 'Attaque multiple, Pénétration importante, Portée longue']]],
  ['Armes improvisées (tir)', [['Fusée de détresse', -6, 0, 'Pénétration réduite, Portée courte'], ['Pistolet à clous', -4, 2, 'Pénétration importante, Portée très courte']]],
  ['Armes de guerre', [['Lance-grenades', -1, 4, 'Aire d\'effet (rayon court, explosif), Portée moyenne'], ['Lance-flammes', -3, 9, 'Aire d\'effet (rayon court), Dangereux, Inévitable, Portée courte'], ['Lance-roquettes antichar', -7, 13, 'Pénétration importante, Portée moyenne']]],
  ['Projectiles', [['Pierre', -4, -2, 'Portée très courte'], ['Cocktail Molotov', -4, 5, 'Aire d\'effet (rayon très court, explosif), Dangereux, Portée courte'], ['Grenade', -4, 4, 'Aire d\'effet (rayon court, explosif), Dangereuse, Portée courte']]],
  ['Armes de jet', [['Dague de lancer', -3, -1, 'Portée très courte'], ['Shuriken', -3, -2, 'Portée très courte'], ['Hachette (lancée)', -2, 1, 'Portée très courte']]],
  ['Armes de trait', [['Fronde', -6, 0, 'Dangereuse, Portée courte'], ['Arc court', -5, 1, 'Portée courte'], ['Arc long', -4, 2, 'Portée moyenne'], ['Arbalète', -4, 3, 'Portée longue']]],
];
export const MELEE_GROUPS = ['Couteaux', 'Épées', 'Haches', 'Contondantes', 'Armes diverses', 'Armes improvisées', 'Mains nues'];
export const ARMURES = [['Blouson de cuir', 1, '', 'Couverture partielle, Cassante'], ['Cotte de mailles', 3, '2+', 'Couverture importante'], ['Veste de Kevlar', 4, '1+', 'Couverture partielle, Renforcé'], ['Armure d\'acier (avec heaume)', 6, '3+', '—'],
  ['Petit bouclier', 2, '', 'Bouclier : couverture partielle, fragile'], ['Grand bouclier', 5, '', 'Bouclier : couverture importante, fragile'], ['Pavois', 7, '', 'Bouclier : couverture importante, fragile'], ['Bouclier anti-émeute', 8, '', 'Bouclier : couverture importante, renforcé']];
export const MODIFS_ATTAQUE = [['Défenseur sans défense', 'pas de Défense (+4 au contact)'], ['Défenseur de dos', 'Défense à –4'], ['Défenseur mobile', 'Tir à –1'], ['Viser 1 / 2 / 3 s', 'Tir à +1 / +2 / +3'], ['De nuit', 'Tir à –2'], ['Tir à bout portant', 'Tir à +6'], ['Parade avec une arme', '+4 en Défense au contact, –4 en attaque'], ['Avantage tactique', 'Combat à +2'], ['Hors portée (catégorie suivante)', 'Tir à –6']];

// ================= Création rapide : profils =================
// c : [Fo, Ag, Pe, Vo, Pr, Foi] par variante ; v : noms des variantes avec le camp autorisé
export const PROFILS = [
  { n: 'Baroudeur/Sauvage', v: [['Baroudeur', 'ange'], ['Sauvage', 'demon']], c: [[1, 1, 3, 1, 0, 0], [2, 1, 3, 1, -1, 0]],
    tp: 'Corps à corps +2/+4, Défense +2, Discrétion +2, Fouille +2, Médecine +2/—',
    ts: 'Aisance sociale +2/—, Athlétisme +2, Intimidation —/+2, Langues (2 au choix, généralement anglais et espagnol), Survie +0 (au choix +4, généralement jungle ou montagne)',
    desc: 'Le baroudeur aime les vrais voyages, à la dure. Le sauvage est un survivant, un prédateur qui asservit la nature.' },
  { n: 'Filou', v: [['Filou', 'both']], c: [[0, 3, 2, 0, 1, 0]],
    tp: 'Défense +4, Discrétion +4, Intrusion +2',
    ts: 'Acrobatie +4, Aisance sociale +2, Athlétisme +2, Savoir criminel +0 (au choix +2, généralement milieu de la pègre)',
    desc: 'Aime les possessions des autres et les défis envers l\'ordre et les convenances.' },
  { n: 'Charmeur/Corrupteur', v: [['Charmeur', 'both'], ['Corrupteur', 'demon']], c: [[0, 1, 0, 2, 3, 0], [0, 1, 0, 2, 3, 0]],
    tp: 'Baratin +2/+4, Défense +2, Discussion +2, Séduction +4/+2',
    ts: 'Aisance sociale +4, Intimidation +2, Langues (4 au choix, généralement anglais, italien, espagnol, allemand)',
    desc: 'Le charmeur aime séduire. Le corrupteur cherche à faire le mal par tous les moyens et à semer la discorde.' },
  { n: 'Érudit', v: [['Érudit', 'both']], c: [[-1, 0, 0, 3, 0, 2]],
    tp: 'Discussion +2, Médecine +4',
    ts: 'Culture générale +2 (au choix +4, généralement histoire), Langues (grec, latin, hébreu et 1 au choix), Savoir occulte +2 (au choix +4, généralement les anges ou les démons), Science +2 (au choix +4, généralement physique)',
    desc: 'Aime la connaissance sous toutes ses formes ; doué en sciences, moins en tâches physiques.' },
  { n: 'Martial/Violent', v: [['Martial', 'both'], ['Violent', 'both']], c: [[2, 2, 2, 0, 0, 0], [3, 2, 2, -1, 0, 0]],
    tp: 'Combat +0 (au choix +4, généralement épées ou haches), Tir +0 (au choix +2, généralement armes de poing), Corps à corps +2, Défense +2',
    ts: 'Athlétisme +2/+4, Intimidation +2/+4, Savoir militaire +2/+0 (au choix +4/+2, généralement stratégie/tactique)',
    desc: 'Le martial est un militaire discipliné. Le violent aime se battre… et ne sait faire que ça.' },
  { n: 'Missionnaire/Inquisiteur', v: [['Missionnaire', 'both'], ['Inquisiteur', 'both']], c: [[0, 0, 0, 1, 2, 3], [0, 0, 0, 2, 1, 3]],
    tp: 'Baratin +2/—, Discussion +4, Enquête +2/+4, Fouille +2',
    ts: 'Aisance sociale +4/+2, Intimidation +2/+4, Savoir d\'espion +0 (au choix +4, généralement renseignement)',
    desc: 'Le missionnaire veut partager sa foi. L\'inquisiteur combat ceux qui s\'opposent à sa doctrine.' },
];

// Tables de pouvoirs aléatoires (d66) : [min, max, pouvoir, niveau (0 = invariable), PP bonus, options]
// options : relA (les anges relancent), relD (les démons relancent), ange/demon (variante selon le camp), sup {Nom: PP}
const R = (a, b, n, l, pp, o = {}) => ({ a, b, n, l, pp, ...o });
export const TABLES_POUVOIRS = {
  'Baroudeur/Sauvage': [R(11, 11, 'Adhérence', 1, 2), R(12, 12, 'Anaérobiose', 0, 2, { plus: 'Immunité contre les maladies et les poisons' }), R(13, 14, 'Armure corporelle', 1, 2), R(15, 16, 'Arts martiaux', 1, 2),
    R(21, 22, 'Augmentation de Force', 1, 2), R(23, 24, 'Augmentation d\'Agilité', 1, 2), R(25, 31, 'Augmentation de Perception', 1, 2), R(32, 33, 'Caméléon', 1, 2), R(34, 34, 'Champ de force', 1, 2),
    R(35, 36, 'Contrôle des animaux', 1, 2), R(41, 41, 'Conversion physique', 1, 0), R(42, 42, 'Détection du danger', 1, 2), R(43, 44, 'Éventration', 1, 2, { relA: 1 }), R(45, 45, 'Invisibilité', 1, 0),
    R(46, 46, 'Membre blindé', 0, 2), R(51, 51, 'Membre exotique : griffes', 0, 2, { relA: 1 }), R(52, 52, 'Onde de choc', 1, 2), R(53, 53, 'Paralysie', 1, 2), R(54, 55, 'Peur', 1, 2),
    R(56, 56, 'Poison', 1, 2, { relA: 1 }), R(61, 62, 'Régénération', 1, 2), R(63, 64, 'Sens surdéveloppés', 0, 2), R(65, 65, 'Vitesse', 1, 2), R(66, 66, 'Volonté supra-normale', 1, 2)],
  'Filou': [R(11, 11, 'Adhérence', 1, 2), R(12, 12, 'Armure corporelle', 1, 2), R(13, 13, 'Arts martiaux', 1, 2), R(14, 16, 'Augmentation d\'Agilité', 1, 2), R(21, 21, 'Augmentation de Perception', 1, 2),
    R(22, 23, 'Augmentation de Présence', 1, 2), R(24, 24, 'Aura de confusion', 1, 2), R(25, 25, 'Aura d\'inattention', 1, 2), R(26, 26, 'Caméléon', 1, 2), R(31, 31, 'Champ magnétique', 1, 2),
    R(32, 32, 'Charme', 1, 2), R(33, 33, 'Corps gazeux', 0, 2), R(34, 34, 'Décharge électrique', 1, 2, { sup: { Jean: 4 } }), R(35, 35, 'Déguisement superficiel', 1, 2, { sup: { Janus: 4, Valefor: 4 } }),
    R(36, 36, 'Déphasage', 1, 0), R(41, 41, 'Détection du danger', 1, 2), R(42, 43, 'Esquive acrobatique', 1, 2), R(44, 45, 'Invisibilité', 1, 0), R(46, 46, 'Lire les pensées', 1, 2),
    R(51, 51, 'Non-détection', 1, 0), R(52, 53, 'Obscurité', 1, 2, { sup: { Janus: 4, Valefor: 4 } }), R(54, 54, 'Rebond', 1, 0), R(55, 55, 'Réduction', 1, 2), R(56, 56, 'Sommeil', 1, 2),
    R(61, 62, 'Télékinésie', 1, 2), R(63, 64, 'Vitesse', 1, 2), R(65, 65, 'Vol', 1, 2), R(66, 66, 'Volonté supra-normale', 1, 2)],
  'Charmeur/Corrupteur': [R(11, 11, 'Absorption d\'amour', 1, 2, { demon: 'Absorption d\'énergie sexuelle' }), R(12, 12, 'Absorption de présence', 1, 0), R(13, 13, 'Arts martiaux', 1, 2), R(14, 14, 'Augmentation de Volonté', 1, 2),
    R(15, 21, 'Augmentation de Présence', 1, 2), R(22, 23, 'Aura de pacification', 1, 0, { ppAnge: 2, sup: { 'Jean-Luc': 4 } }), R(24, 24, 'Aura d\'inattention', 1, 2), R(25, 25, 'Cauchemar', 1, 0), R(26, 26, 'Champ magnétique', 1, 2),
    R(31, 33, 'Charme', 1, 2), R(34, 34, 'Déguisement superficiel', 1, 2, { sup: { Janus: 4, Valefor: 4 } }), R(35, 35, 'Détection des ennemis', 1, 2), R(36, 36, 'Détection du mensonge', 1, 0),
    R(41, 41, 'Langage universel', 0, 3, { sup: { Didier: 5 } }), R(42, 43, 'Lire les pensées', 1, 2), R(44, 44, 'Onde de choc', 1, 2), R(45, 46, 'Paralysie', 1, 2), R(51, 53, 'Peur', 1, 2),
    R(54, 54, 'Psychométrie', 1, 2), R(55, 55, 'Rêve', 1, 0), R(56, 61, 'Sommeil', 1, 2), R(62, 63, 'Télépathie', 1, 2), R(64, 64, 'Trait d\'énergie', 1, 2), R(65, 66, 'Volonté supra-normale', 1, 2)],
  'Érudit': [R(11, 11, 'Absorption de gentillesse', 1, 2, { demon: 'Absorption de douleur', ppDemon: 0 }), R(12, 12, 'Arts martiaux', 1, 2), R(13, 13, 'Augmentation de Perception', 1, 2), R(14, 15, 'Augmentation de Volonté', 1, 2),
    R(16, 16, 'Augmentation de Foi', 1, 2), R(21, 21, 'Aura de pacification', 1, 0, { ppAnge: 2, sup: { 'Jean-Luc': 4 } }), R(22, 22, 'Cauchemar', 1, 0), R(23, 23, 'Charme', 1, 2), R(24, 24, 'Décharge électrique', 1, 2, { sup: { Jean: 4 } }),
    R(25, 25, 'Détection des créatures invisibles', 1, 2), R(26, 26, 'Détection des ennemis', 1, 2), R(31, 31, 'Détection du danger', 1, 2), R(32, 33, 'Détection du mensonge', 1, 0), R(34, 34, 'Invisibilité', 1, 0),
    R(35, 36, 'Langage universel', 0, 3, { sup: { Didier: 5 } }), R(41, 42, 'Lire les pensées', 1, 2), R(43, 43, 'Non-détection', 1, 0), R(44, 45, 'Protection de l\'esprit', 0, 2), R(46, 51, 'Psychométrie', 1, 2),
    R(52, 52, 'Rêve', 1, 0), R(53, 53, 'Sommeil', 1, 2), R(54, 55, 'Télékinésie', 1, 2), R(56, 62, 'Télépathie', 1, 2), R(63, 63, 'Trait d\'énergie', 1, 2), R(64, 66, 'Volonté supra-normale', 1, 2)],
  'Martial/Violent': [R(11, 11, 'Absorption de violence', 1, 0), R(12, 14, 'Arme exaltée', 1, 2), R(15, 21, 'Armure corporelle', 1, 2), R(22, 23, 'Arts martiaux', 1, 2), R(24, 26, 'Augmentation de Force', 1, 2),
    R(31, 32, 'Augmentation d\'Agilité', 1, 2), R(33, 34, 'Augmentation de Perception', 1, 2), R(35, 35, 'Aura de courage', 1, 2), R(36, 41, 'Champ de force', 1, 2), R(42, 42, 'Conversion physique', 1, 0),
    R(43, 43, 'Décharge électrique', 1, 2, { sup: { Jean: 4 } }), R(44, 44, 'Éclats de glace', 1, 2), R(45, 45, 'Esquive acrobatique', 1, 2), R(46, 46, 'Éventration', 1, 2, { relA: 1 }), R(51, 51, 'Jet d\'eau du robinet', 1, 2),
    R(52, 52, 'Jet de flammes', 1, 2), R(53, 53, 'Membre blindé', 0, 2), R(54, 54, 'Membre exotique : dents de sabre', 0, 2, { relA: 1 }), R(55, 55, 'Membre exotique : grandes cornes', 0, 2, { relA: 1 }),
    R(56, 56, 'Membre exotique : sabots', 0, 2, { relA: 1 }), R(61, 61, 'Onde de choc', 1, 2), R(62, 62, 'Peur', 1, 2), R(63, 63, 'Régénération', 1, 2), R(64, 64, 'Trait d\'énergie', 1, 2), R(65, 65, 'Vitesse', 1, 2), R(66, 66, 'Volonté supra-normale', 1, 2)],
  'Missionnaire/Inquisiteur': [R(11, 12, 'Absorption du bien', 1, 2, { ange: 'Absorption du mal' }), R(13, 13, 'Arme exaltée', 1, 2), R(14, 14, 'Armure corporelle', 1, 2), R(15, 15, 'Arts martiaux', 1, 2), R(16, 16, 'Augmentation de Force', 1, 2),
    R(21, 21, 'Augmentation de Perception', 1, 2), R(22, 23, 'Augmentation de Volonté', 1, 2), R(24, 26, 'Augmentation de Foi', 1, 2), R(31, 31, 'Cauchemar', 1, 0), R(32, 32, 'Champ de force', 1, 2), R(33, 33, 'Charme', 1, 2),
    R(34, 34, 'Détection des créatures invisibles', 1, 2), R(35, 35, 'Détection des ennemis', 1, 2), R(36, 41, 'Détection du mal', 1, 0, { demon: 'Détection du bien' }), R(42, 42, 'Douleur', 1, 2, { relA: 1 }),
    R(43, 45, 'Jet d\'acide', 1, 2, { ange: 'Jet d\'eau bénite', ppAnge: 0 }), R(46, 46, 'Langage universel', 0, 3, { sup: { Didier: 5 } }), R(51, 51, 'Lueur insoutenable', 1, 2, { relD: 1 }), R(52, 52, 'Non-détection', 1, 0),
    R(53, 53, 'Paralysie', 1, 2), R(54, 54, 'Peur', 1, 2), R(55, 55, 'Protection de l\'âme', 0, 2), R(56, 56, 'Psychométrie', 1, 2), R(61, 61, 'Rêve', 1, 0), R(62, 62, 'Télékinésie', 1, 2), R(63, 63, 'Télépathie', 1, 2),
    R(64, 64, 'Trait d\'énergie', 1, 2), R(65, 66, 'Volonté supra-normale', 1, 2)],
};
// Résout une ligne de table pour un camp et un supérieur donnés ; null = relancer
export function tirageLigne(row, camp, sup) {
  if ((row.relA && camp === 'ange') || (row.relD && camp === 'demon')) return null;
  let n = row.n, pp = row.pp;
  if (camp === 'ange' && row.ange) n = row.ange;
  if (camp === 'demon' && row.demon) { n = row.demon; if (row.ppDemon != null) pp = row.ppDemon; }
  if (camp === 'ange' && row.ppAnge != null) pp = row.ppAnge;
  if (row.sup && row.sup[sup] != null && (camp === 'ange' || ['Valefor'].includes(sup))) pp = row.sup[sup];
  return { n, l: row.l, pp, plus: row.plus };
}
export function lookupTable(prof, d66) { return TABLES_POUVOIRS[prof].find((r) => d66 >= r.a && d66 <= r.b); }

// ================= Analyse des modificateurs de talents =================
// « Combat +0 (au choix +4, généralement épées) » -> { t, g, s, spe, choix } ; variante v (0/1) pour « +2/+4 »
const pickVar = (s, v) => {
  if (s == null) return null;
  const parts = s.split('/');
  const x = (parts[v] ?? parts[0]).trim();
  if (x === '—' || x === '-' || x === '') return null;
  return parseInt(x.replace('+', ''), 10);
};
function splitTop(str) {
  const out = []; let depth = 0, cur = '';
  for (const ch of str) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
export function parseMods(str, v = 0) {
  if (!str) return [];
  const res = [];
  for (const item of splitTop(str)) {
    const m = item.match(/^([^(+—\d]+?)\s*([+—\-]?[\d—/+\-]*)?\s*(\((.*)\))?$/);
    if (!m) continue;
    const t = m[1].trim();
    const gen = pickVar(m[2] && m[2].trim() ? m[2].trim() : null, v);
    const inner = m[4];
    const def = talentDef(t);
    if (t === 'Langues') {
      const mm = inner.match(/^(\d+) au choix(?:, généralement (.*))?$/);
      if (mm) {
        const hints = (mm[2] || '').split(/,| et /).map((x) => x.trim()).filter(Boolean);
        res.push({ t, langues: Array.from({ length: +mm[1] }, (_, i) => hints[i] || 'au choix') });
      } else {
        const names = inner.replace(/ et (\d+) au choix| et un autre au choix.*$/, ', au choix').split(/,| et /).map((x) => x.trim()).filter(Boolean);
        res.push({ t, langues: names });
      }
      continue;
    }
    if (inner) {
      const mm = inner.match(/^au choix ([+\d/—]+)(?:, généralement (.*))?$/);
      const mm2 = inner.match(/^(.*?)\s*([+][\d/—+]+)$/);
      if (mm) {
        const hint = (mm[2] || '').split(/ ou |\//)[v === 1 && (mm[2] || '').includes('/') ? 1 : 0]?.split(' ou ')[0]?.trim() || '';
        res.push({ t, g: gen ?? 0, s: pickVar(mm[1], v) ?? 0, spe: hint, choix: true, multi: def?.kind === 'm' });
      } else if (mm2) {
        res.push({ t, g: gen ?? 0, s: pickVar(mm2[2], v) ?? 0, spe: mm2[1].trim(), multi: def?.kind === 'm' });
      }
    } else if (gen != null) {
      res.push({ t, g: gen });
    }
  }
  return res;
}

// ================= Personnage =================
export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
export function blankCharacter(type = 'ange') {
  const t = TYPES[type];
  return {
    id: uid(), v: 1, type, tier: 0, nom: '', superieur: '', profil: '', grade: 0, chance: !!t?.chance,
    car: { fo: 4, ag: 4, pe: 4, vo: 4, pr: 4, foi: 4 },
    tal: {},        // { Nom: { r: rangs ajoutés au niveau général, spe: 'épées', sr: rangs de spécialité } }
    multi: [],      // [{ t: 'Hobby', label: 'pêche', r }]
    langues: [],
    pouvoirs: [],   // [{ n, r (rangs, 0 = invariable), notes }]
    ppAchat: 0, ppBonus: 0, ppCur: null, pfCur: null,
    pa: { total: 0, spent: 0, log: [] },
    blessures: [], limitations: [], armes: [], armures: [], possessions: '', notes: '',
    identite: { vraiNom: '', corps: '', age: '', metier: '', apparence: '', contact: '', couverture: '' },
    gradeDom: {}, createdAt: Date.now(), updatedAt: 0, creation: '',
  };
}

// Niveau effectif (rangs) d'un talent : base + rangs généraux ; spécialité : base + sr
export function talentLevel(c, name) {
  const t = c.tal[name] || {};
  return talentBase(c, name) + (+t.r || 0);
}
export function talentSpe(c, name) {
  const t = c.tal[name];
  if (!t || !t.spe) return null;
  return talentBase(c, name) + Math.max(+t.sr || 0, +t.r || 0);
}

// Coût en PA des talents (création sur mesure / évolution) :
// 1 PA = 1 rang principal + 1 rang secondaire gratuit, ou 2 rangs secondaires
export function talentCost(c) {
  let p = 0, s = 0;
  for (const [n, t] of Object.entries(c.tal)) {
    const ranks = (+t.r || 0) + (t.spe ? Math.max(0, (+t.sr || 0)) : 0);
    if (!ranks) continue;
    if (talentCat(c, n) === 'p') p += ranks; else s += ranks;
  }
  for (const m of c.multi) s += Math.max(0, +m.r || 0);
  s += c.langues.length;
  return { p, s, pa: p + Math.ceil(Math.max(0, s - p) / 2) };
}
export const caracCost = (c, t = typeOf(c)) => {
  let pa = 0;
  for (const k of ['fo', 'ag', 'pe', 'vo', 'pr', 'foi']) {
    const d = (c.car[k] - 4) * 2;
    pa += (k === 'foi' && c.apostat && d > 0) ? d * 2 : d;
  }
  return pa;
};
export function powerDef(n) { return POUVOIRS.find((p) => p.n === n); }
// coût d'acquisition par rang pour ce personnage (le moins cher des accès ouverts)
export function powerUnitCost(c, def) {
  if (!def) return 3;
  const a = def.a || {};
  const t = typeOf(c);
  const opts = [];
  if (a.sup && a.sup[c.superieur] != null) opts.push(a.sup[c.superieur]);
  if (a.gen != null) opts.push(a.gen);
  if (t.camp === 'ange' && a.ange != null) opts.push(a.ange);
  if (t.camp === 'demon' && a.demon != null) opts.push(a.demon);
  if (c.type === 'psi' && a.psi != null) opts.push(a.psi);
  if (c.type === 'paien' && a.paien != null) opts.push(a.paien);
  if (a.special != null) opts.push(a.special);
  if (!opts.length) {
    // accès réservé : on retient le premier coût connu
    const any = [a.gen, a.ange, a.demon, a.psi, a.paien, ...Object.values(a.sup || {})].filter((x) => x != null);
    return any.length ? Math.min(...any) : 3;
  }
  return Math.min(...opts);
}
export function powerAccessible(c, def) {
  if (!def) return true;
  const a = def.a || {}; const t = typeOf(c);
  if (a.gen != null || a.special != null) return true;
  if (a.sup && a.sup[c.superieur] != null) return true;
  if (t.camp === 'ange' && a.ange != null) return true;
  if (t.camp === 'demon' && a.demon != null) return true;
  if (c.type === 'psi' && a.psi != null) return true;
  if (c.type === 'paien' && a.paien != null) return true;
  return false;
}
export const isInvariable = (def) => !!(def && def.a && def.a.inv) || /permanent/.test(def?.act || '') && /invariable/.test(def?.acc || '');
export function powerCost(c, p) {
  const def = powerDef(p.n);
  if (p.free) return 0;
  const u = powerUnitCost(c, def);
  return (def && def.a && def.a.inv) ? u : u * (+p.r || 0);
}
export const powersCost = (c) => c.pouvoirs.reduce((s, p) => s + powerCost(c, p), 0);

// Bilan de création sur mesure
export function bilan(c) {
  const t = typeOf(c);
  const car = caracCost(c, t);
  const tc = talentCost(c);
  const pow = powersCost(c);
  const pp = +c.ppAchat || 0;
  const total = car + tc.pa + pow + pp;
  const budget = (t.pa || 0) + (c.avertissement ? 5 : 0);
  return { car, tal: tc.pa, talP: tc.p, talS: tc.s, pow, pp, total, budget, reste: budget - total, t };
}
export function checks(c) {
  const b = bilan(c); const t = b.t; const w = [];
  const rng = (v, r, lab) => { if (r && (v < r[0] || v > r[1])) w.push(`${lab} : ${v} PA (attendu ${r[0]} à ${r[1]})`); };
  rng(b.car, t.q.car, 'Caractéristiques'); rng(b.tal, t.q.tal, 'Talents');
  if (t.q.pow) rng(b.pow, t.q.pow, 'Pouvoirs');
  if (t.q.pp && !t.tiers) rng(b.pp, t.q.pp, 'PP achetés');
  if (b.reste !== 0) w.push(b.reste > 0 ? `Il reste ${b.reste} PA à dépenser` : `${-b.reste} PA de trop`);
  const lowered = Object.entries(c.car).filter(([k, v]) => v < 4);
  if (lowered.length > 1 && (t.camp !== 'neutre')) w.push('Une seule caractéristique peut être baissée');
  if (lowered.some(([k, v]) => v < 3) && ['ange', 'demon'].includes(c.type)) w.push('Aucune caractéristique sous 1+');
  for (const k of Object.keys(c.car)) {
    const mx = (t.max.carPhys && ['fo', 'ag', 'pe'].includes(k)) ? t.max.carPhys : t.max.car;
    if (mx && c.car[k] > mx) w.push(`${caracName(c, k)} au-dessus du maximum (${lvl(mx)})`);
  }
  for (const n of Object.keys(c.tal)) {
    const L = Math.max(talentLevel(c, n), talentSpe(c, n) ?? 0);
    const mx = talentDef(n)?.cat === 'psi' && t.max.talPsi ? t.max.talPsi : t.max.tal;
    if (mx && L > mx) w.push(`${n} au-dessus du maximum (${lvl(mx)})`);
  }
  for (const p of c.pouvoirs) if (!p.free && t.max.pow && p.r > t.max.pow) w.push(`${p.n} au-dessus du niveau maximal (${lvl(t.max.pow)})`);
  if (t.max.pp && ppMax(c) > t.max.pp) w.push(`PP au-dessus du maximum (${t.max.pp})`);
  return w;
}

// Progression : limites du grade
export function gradeMax(c) {
  const g = GRADES[c.grade || 0] || GRADES[0];
  const t = typeOf(c);
  if (['ange', 'demon', 'combat'].includes(c.type)) return g;
  return { car: t.max.car, tal: t.max.tal, pow: t.max.pow, pp: t.max.pp };
}

export function upgradeCharacter(c) {
  c.tal ||= {}; c.multi ||= []; c.langues ||= []; c.pouvoirs ||= []; c.blessures ||= []; c.limitations ||= [];
  c.armes ||= []; c.armures ||= []; c.pa ||= { total: 0, spent: 0, log: [] }; c.identite ||= {}; c.gradeDom ||= {};
  return c;
}
