// PNJ rapides du livret de l'écran du maître (INS/MV4, p. 10-15).
// Un profil par supérieur (grade 0, 10 PP de base) ; les tables font évoluer le PNJ jusqu'à 40 PP.
// Format d'un profil : [supérieur, « Fo Ag Pe Vo Pr Foi », [Attaque, Défense, Physique, Mental, Social], talents particuliers,
//   pouvoirs initiaux, [pouvoirs gagnés à 15, 20, 25, 30 PP]].
// Dans les listes de pouvoirs : « Nom [précision/puissance/cac|tir] » = arme (un « Membre exotique : … » donne aussi le pouvoir),
// « !texte » = note pour le MJ.
export const ECRAN = 'Livret de l\'écran du maître';
export const QUICK_PP = [10, 15, 20, 25, 30, 35, 40];
// Table 1 : grade et Foi minimale
export const T_GRADE = [['0 ou 1', 2], ['1', 2], ['2', 3], ['2', 3], ['3', 5], ['3', 5], ['3', 5]];
// Table 2 : caractéristiques (base 2 à 5)
export const T_CAR = { 2: ['2', '2', '2', '2', '2+', '2+', '3'], 3: ['3', '3', '3', '3+', '3+', '4', '4'], 4: ['4', '4', '4+', '4+', '5', '5', '5+'], 5: ['5', '5+', '5+', '6', '6', '6+', '6+'] };
// Table 3 : talents (base 1 à 7)
export const T_TAL = {
  1: ['1', '1', '1', '1+', '1+', '1+', '2'], 2: ['2', '2', '2', '2+', '2+', '3', '3'], 3: ['3', '3', '3', '3+', '3+', '4', '4'],
  4: ['4', '4', '4+', '4+', '5', '5', '5+'], 5: ['5', '5', '5+', '6', '6', '6+', '7'], 6: ['6', '6+', '6+', '7', '7+', '8', '8+'],
  7: ['7', '7+', '8', '8+', '9', '9+', '10'],
};
// Table 4 : niveau des pouvoirs (initial niveau 2, initial niveau 1, gagnés à 15, 20, 25, 30 PP)
export const T_POW = [[2, 1, 0, 0, 0, 0], [3, 2, 1, 0, 0, 0], [4, 3, 2, 1, 0, 0], [5, 4, 3, 2, 1, 0], [6, 5, 4, 3, 2, 1], [7, 6, 5, 4, 3, 2], [8, 7, 6, 5, 4, 3]];

export const QUICK_ANGES = [
  ['Alain', '3 3 5 3 4 4', [3, 4, 3, 3, 4], 'Médecine 5, Survie 6', 'Abondance 2, Aura de pacification 1, Bénédiction : fertilité 1, Jeûne', ['Anaérobiose, Caméléon 1', 'Charme 1', 'Téléportation 1', 'Arc long béni majeur [0/6/tir]']],
  ['Ange', '3 3 3 4 4 5', [3, 4, 3, 4, 5], 'Discussion 7', 'Assaut spirituel 2, Charme 1, Volonté supra-normale 1', ['Boomerang 1, Protection de l\'âme', 'Arts martiaux 1', 'Lecture d\'aura 1', 'Perturbation de pouvoir 1']],
  ['Blandine', '2 3 4 5 4 4', [2, 3, 2, 4, 5], 'Narcolepsie 7', 'Lire les pensées 1, Rêve divin 2, Sommeil 1', ['Cauchemar 1, Détection du mensonge 1', 'Charme 1', 'Télépathie 1', 'Chant angélique 1']],
  ['Christophe', '3 5 4 3 3 4', [2, 4, 5, 3, 4], 'Contorsionnisme 5, Humour 4', 'Coup de bol 1, Enfance 2, Réduction 1', ['Aura d\'inattention 1', 'Élastique 1', 'Bénédiction : rajeunissement 1', 'Polymorphie 1']],
  ['Daniel', '4 4 5 4 2 3', [6, 5, 5, 3, 2], '', 'Arme exaltée 1, Armure corporelle 1, Pétrification 2, !Armure corporelle : peau de pierre', ['Peur 1', 'Batte bénie mineure [1/4/cac]', 'Télékinésie 1', 'Aura de courage 1, Batte bénie majeure [3/6/cac]']],
  ['Didier', '3 3 3 5 5 3', [3, 3, 3, 5, 5], '', 'Illusions 1, Message officiel, Langage universel, Télépathie 2', ['Téléportation 1', 'Corps digital', 'Rêve 1', 'Non-détection 1']],
  ['Dominique', '2 2 3 5 5 5', [3, 4, 3, 5, 6], 'Sixième sens 6', 'Détection du Mal 1, Détection du mensonge 2, Jugement 1', ['Lire les pensées 1', 'Jet d\'eau bénite 1', 'Lumière céleste 1', 'Peur 1, Perturbation de pouvoir 1']],
  ['Francis', '3 3 4 4 5 3', [2, 3, 3, 4, 6], 'Discussion 7', 'Alliance 2, Charme 1, Lire les pensées 1', ['Détection du mensonge 1', 'Aura de pacification 1', 'Voix impérieuse 1', 'Volonté supra-normale 1, Conversion mentale 1']],
  ['Guy', '3 3 3 5 3 5', [2, 3, 2, 4, 4], 'Médecine 7', 'Bénédiction : guérison de folies 1, Bénédiction : guérison de maladies 1, Guérison 1', ['Immunité contre les maladies et les poisons, Régénération 1', 'Aura de pacification 1, Conversion physique 1', 'Détection du danger 1', 'Téléportation 1']],
  ['Janus', '3 5 4 3 4 3', [4, 3, 5, 4, 5], 'Pickpocket 7', 'Déguisement superficiel 1, Obscurité 1, Ouverture 2', ['Détection du danger 1', 'Charme 1', 'Déphasage 1', 'Revolver petit calibre béni majeur [2/7/tir]']],
  ['Jean', '3 3 4 5 3 4', [2, 3, 3, 6, 3], 'Science 7, Technique 6', 'Champ électrique 1, Immunité contre l\'électricité, Innovation 2, Volonté supra-normale 1', ['Décharge électrique 1', 'Corps électrique, Rafistolage 1', 'Parasite intellectuel 1', 'Esprits multiples 1']],
  ['Jean-Luc', '5 4 4 3 2 4', [5, 7, 5, 4, 3], '', 'Armure corporelle 2, Aura de pacification 1, Sacrifice ultime 1', ['Champ de force 1, Protection partagée', 'Champ magnétique 1', 'Conversion physique 1', 'Conversion mentale 1, Volonté supra-normale 1']],
  ['Jordi', '3 3 5 4 3 4', [4, 4, 4, 4, 5], 'Langage animal 6', 'Appel des animaux 1, Caméléon 1, Contrôle des animaux 2', ['Détection du danger 1', 'Jeûne, Sens surdéveloppés', 'Anaérobiose, Régénération 1', 'Immunité contre les maladies et les poisons, Armure corporelle 1, !Armure corporelle : peau de pierre']],
  ['Joseph', '2 3 3 5 3 5', [3, 4, 3, 4, 4], 'Torture 7', 'Détection du Mal 1, Détection du mensonge 1, Torture 2', ['Lire les pensées 1', 'Protection de l\'âme, Psychométrie 1', 'Paralysie 1', 'Perturbation de pouvoir 1']],
  ['Laurent', '4 5 3 3 3 4', [7, 7, 5, 3, 3], 'Savoir militaire 7', 'Armure corporelle 1, Aura de courage 1, Juste-lame 2', ['Esquive acrobatique 1, Épée bénie mineure [2/4/cac]', 'Champ de force 1, Épée bénie majeure [4/6/cac]', 'Supériorité martiale 1', 'Lueur insoutenable 1, Épée bénie ancienne [6/8/cac]']],
  ['Marc', '3 3 3 5 5 3', [2, 4, 3, 5, 6], '', 'Charme 1, Contrat divin 2, Lire les pensées 1', ['Détection du mensonge 1', 'Aura de pacification 1', 'Protection de l\'esprit, Volonté supra-normale 1', 'Esprits multiples 1, Domination 1']],
  ['Mathias', '3 3 3 4 4 5', [4, 4, 4, 3, 5], 'Baratin 7', 'Apparence démoniaque 2, Aura de confusion 1, Esquive acrobatique 1', ['Détection du Mal 1, Membre exotique : griffes [0/4/cac]', 'Jet d\'acide 1', 'Téléportation 1', '!Pouvoir réservé au prince-démon infiltré (Art de combat chez Baal, Orgasme mortel chez Andrealphus…) au niveau 1']],
  ['Michel', '5 4 3 4 3 3', [7, 6, 5, 2, 2], 'Intimidation 7, Savoir militaire 5', 'Arme exaltée 1, Armure corporelle 1, Maîtrise martiale 2', ['Augmentation de Force 1, Hache bénie mineure [2/5/cac]', 'Régénération 1, Hache bénie majeure [4/7/cac]', 'Décharge électrique 1', 'Aura de courage 1, Hache bénie ancienne [6/9/cac]']],
  ['Novalis', '2 3 5 4 3 5', [2, 3, 4, 5, 6], 'Langage animal 5, Survie 7', 'Aura de pacification 1, Caméléon 1, Pollen 1', ['Adhérence 1', 'Lire les pensées 1', 'Charme 1', 'Chant angélique 1']],
  ['Walther', '3 2 3 5 4 5', [4, 5, 3, 4, 4], 'Enquête 6, Hypnotisme 5', 'Détection du Mal 1, Exorcisme 2, Paralysie 1', ['Chant angélique 1', 'Jet d\'eau bénite 1', 'Lecture d\'aura 1', 'Détection du futur proche 1, Psychométrie 1']],
  ['Yves', '2 2 4 5 4 5', [2, 4, 3, 6, 5], 'Discussion 7, Savoir occulte 7', 'Détection du futur proche 1, Lire les pensées 1, Philosophie 2', ['Psychométrie 1', 'Lueur insoutenable 1', 'Protection de l\'âme, Science infuse 1', 'Lecture d\'aura 1, Protection de l\'esprit']],
];

export const QUICK_DEMONS = [
  ['Abalam', '2 2 3 4 5 2', [2, 3, 4, 3, 5], 'Hypnotisme 6', 'Camisole 2, Malédiction : folie 1, Peur 1', ['Cauchemar 1', 'Esprit chaotique, Volonté supra-normale 1', 'Lire les pensées 1', 'Protection de l\'âme, Charme 1']],
  ['Andrealphus', '2 3 2 3 5 3', [3, 3, 4, 3, 5], 'Kama Sutra 7, Séduction 7', 'Charme 2, Orgasme mortel 1, Polymorphie 1', ['Étouffement 1', 'Membre exotique : langue barbelée [0/3/cac], Absorption d\'énergie sexuelle 1', 'Malédiction : stérilité 1, Membre exotique : petites cornes [-2/1/cac]', 'Domination 1']],
  ['Andromalius', '2 2 2 4 3 5', [4, 3, 3, 4, 5], 'Enquête 6, Sixième sens 6', 'Détection du mensonge 1, Humanité 1, Lire les pensées 2', ['Membre exotique : sabots [0/2/cac], Volonté supra-normale 1', 'Détection du Bien 1', 'Champ de force 1', 'Protection de l\'âme, Ténèbres sataniques 1']],
  ['Asmodée', '2 3 3 3 3 4', [2, 3, 4, 5, 5], 'Jeu 7', 'Illusions 1, Pari stupide 2, Télékinésie 1', ['Lire les pensées 1', 'Détection du futur proche 1', 'Aura de confusion 1', 'Protection de l\'esprit, Volonté supra-normale 1']],
  ['Baal', '5 3 3 2 3 2', [7, 6, 5, 3, 3], 'Savoir militaire 6', 'Armure corporelle 1, Art de combat 2, Forme de combat 1', ['Membre exotique : grandes cornes [0/4/cac], Peur 1', 'Champ de force 1, !Arme maudite majeure (selon l\'arme)', 'Aura de courage 1', 'Vitesse 1, !Arme maudite ancienne (selon l\'arme)']],
  ['Baalberith', '2 2 3 4 3 4', [3, 3, 2, 5, 4], '', 'Langage universel, Message officiel, Téléportation 2, Télépathie 1', ['Vol 1', 'Vitesse 1', 'Protection de l\'esprit, Volonté supra-normale 1', 'Non-détection 1']],
  ['Beleth', '2 2 2 4 4 4', [3, 3, 3, 4, 6], 'Narcolepsie 7', 'Cauchemar mortel 2, Charme 1, Sommeil 1', ['Rêve 1', 'Télépathie 1', 'Hurlement démoniaque 1', 'Voix impérieuse 1']],
  ['Belial', '4 3 4 3 2 2', [6, 6, 4, 3, 3], '', 'Immunité contre le feu, Incendie 1, Jet de flammes 2, Tourbillon de feu 1', ['Armure corporelle 1', 'Peur 1', 'Détection du danger 1', 'Régénération 1']],
  ['Bifrons', '5 4 3 2 2 2', [7, 5, 5, 2, 2], '', 'Armure corporelle 1, Forme de combat 1, Membre exotique : griffes [0/4/cac], Peur 1, Résurrection macabre 1', ['Éventration 1', 'Nécrose 1', 'Douleur 1', 'Larves sous-cutanées 1']],
  ['Caym', '3 3 5 3 2 2', [6, 5, 5, 4, 3], 'Langage animal 4, Survie 6', '!Camouflage 1 (pouvoir absent de la liste du Grimoire), Membre exotique : dents de sabre [2/2/cac], Transformation 2, Vitesse 1', ['Contrôle des animaux 1', 'Poison 1', 'Carabine maudite majeure [3/8/tir]', 'Invisibilité 1']],
  ['Crocell', '5 3 3 2 2 2', [6, 6, 4, 3, 2], 'Intimidation 5', 'Couche de glace 1, Immunité contre le froid, Froid polaire 1, Éclats de glace 2', ['Paralysie 1', 'Champ magnétique 1', 'Peur 1', 'Régénération 1']],
  ['Furfur', '4 3 2 3 3 3', [5, 6, 5, 3, 4], '', 'Absorption de violence 1, Onde de choc 2, Suicide 1', ['Membre exotique : griffes [0/4/cac], Éventration 1', 'Armure corporelle 1', 'Hurlement démoniaque 1', 'Voix impérieuse 1']],
  ['Gaziel', '3 3 5 3 2 2', [5, 5, 4, 4, 3], '', 'Membre exotique : griffes [0/4/cac], Déphasage 1, Onde de choc 2, Séisme 1', ['Armure corporelle 1', 'Contrôle des animaux 1', 'Sens surdéveloppés, Télékinésie 1', 'Téléportation 1']],
  ['Haagenti', '3 4 3 3 3 2', [4, 3, 3, 4, 5], 'Humour 6', 'Membre exotique : crocs [3/1/cac], Goinfrerie 2, Graisse 1, Illusions 1', ['Rebond 1', 'Immunité contre les maladies et les poisons, Élastique 1', 'Polymorphie 1', 'Charme 1']],
  ['Kobal', '2 4 3 3 4 2', [3, 4, 3, 4, 5], 'Humour 7', 'Gag absurde 2, Illusions 1, Invisibilité 1', ['Polymorphie 1', 'Élastique 1', 'Voix impérieuse 1', 'Lire les pensées 1']],
  ['Kronos', '2 2 3 5 2 4', [2, 3, 2, 6, 4], 'Discussion 6, Savoir occulte 7', 'Déplacement temporel 1, Détection du futur proche 1, Projection temporelle 2', ['Télépathie 1', 'Protection de l\'âme, Volonté supra-normale 1', 'Paralysie 1', 'Téléportation 1']],
  ['Malphas', '2 2 3 3 5 3', [2, 3, 2, 4, 6], 'Baratin 7', 'Détection du mensonge 1, Discorde 2, Lire les pensées 1', ['Aura de confusion 1', 'Charme 1', 'Cauchemar 1', 'Esprits multiples 1, Volonté supra-normale 1']],
  ['Malthus', '3 3 2 4 2 4', [3, 3, 3, 3, 4], '', 'Immunité contre les maladies et les poisons, Infection 2, Maladie 1, Membre exotique : ongles d\'acier [2/2/cac], Paralysie 1', ['Malédiction : maladie 1', 'Douleur 1', 'Ténèbres sataniques 1', 'Larves sous-cutanées 1']],
  ['Mammon', '2 2 2 4 5 3', [2, 2, 2, 6, 5], '', 'Corruption 2, Charme 1, Lire les pensées 1', ['Langage universel', 'Volonté supra-normale 1', 'Détection du mensonge 1', 'Télépathie 1']],
  ['Morax', '2 2 3 3 4 4', [2, 3, 2, 4, 5], 'Arts 7', 'Charme 1, Lire les pensées 1, Œuvre d\'art, Peur 1, Volonté supra-normale 1', ['Malédiction : folie 1', 'Polymorphie 1', 'Illusions 1', 'Télépathie 1']],
  ['Nisroch', '3 2 2 4 4 3', [4, 5, 4, 5, 4], 'Savoir criminel 7', 'Accoutumance 2, Aura d\'inattention 1, Lire les pensées 1', ['Membre exotique : petites cornes [-2/1/cac], Volonté supra-normale 1', 'Boomerang 1', 'Charme 1', 'Téléportation 1']],
  ['Nog', '3 2 2 3 3 5', [3, 4, 3, 2, 3], 'Narcolepsie 4', 'Glandage 2, Sommeil 2', ['Non-détection 1', 'Polymorphie 1', 'Domination 1', 'Déplacement temporel 1']],
  ['Nybbas', '2 2 3 4 5 2', [2, 3, 2, 4, 6], '', 'Charme 2, Lire les pensées 1, Message subliminal, Sommeil 1', ['Télépathie 1', 'Détection du mensonge 1', 'Cauchemar 1', 'Polymorphie 1']],
  ['Ouikka', '4 4 3 2 3 2', [6, 4, 5, 3, 3], 'Savoir criminel 5', 'Disparition 1, Invisibilité 2, Non-détection 1', ['Téléportation 1', 'Vol 1', 'Jet de flammes 1', 'Détection du danger 1']],
  ['Samigina', '3 4 3 3 3 2', [5, 5, 5, 3, 5], '', 'Baiser vampirique 2, Charme 1, Membre exotique : crocs [3/1/cac], Obscurité 1', ['Corps gazeux', 'Contrôle des animaux 1', 'Peur 1', 'Vol 1']],
  ['Scox', '2 2 2 4 5 3', [2, 3, 3, 4, 6], 'Hypnotisme 7', 'Charme 2, Possession 1, Lire les pensées 1', ['Déguisement superficiel 1', 'Illusions 1', 'Domination 1', 'Détection du futur proche 1']],
  ['Shaytan', '4 3 3 3 2 3', [5, 4, 4, 3, 2], 'Baratin 5', 'Décrépitude 2, Malédiction : laideur 1, Peur 1', ['Membre exotique : griffes [0/4/cac], Armure corporelle 1', 'Douleur 1', 'Charme 1', 'Hurlement démoniaque 1']],
  ['Uphir', '4 3 4 3 2 2', [4, 5, 4, 3, 3], '', 'Immunité contre l\'acide, Peau acide 1, Jet d\'acide 2, Vengeance toxique 1', ['Immunité contre les maladies et les poisons, Corps liquide', 'Adhérence 1, Membre exotique : crocs [3/1/cac]', 'Poison 1', 'Ténèbres sataniques 1']],
  ['Valefor', '2 5 3 3 3 2', [4, 5, 4, 4, 5], 'Pickpocket 7', 'Déguisement superficiel 1, Obscurité 1, Ouverture 2', ['Charme 1', 'Invisibilité 1', 'Corps gazeux', 'Revolver petit calibre maudit majeur [2/7/tir]']],
  ['Vapula', '2 2 3 5 2 4', [2, 2, 3, 5, 3], 'Science 6, Technique 7', 'Boomerang 1, Invention 2, Volonté supra-normale 1', ['Protection de l\'esprit, Esprits multiples 1', 'Membre exotique : griffes [0/4/cac], Poltergeist 1', 'Parasite intellectuel 1', 'Cauchemar 1']],
  ['Vephar', '4 3 4 3 2 2', [5, 5, 4, 3, 3], 'Navigation 7', 'Anaérobiose, Membre exotique : queue blindée [0/3/cac], Vie subaquatique 2, Vitesse 1', ['Poison 1', 'Armure corporelle 1, !Armure corporelle : écailles', 'Trident maudit majeur [3/5/cac]', 'Contrôle des animaux 1, Corps liquide']],
];

// Serviteurs (p. 14-15) : au format du bestiaire des livres (voir js/data/bestiaire.js)
const E = (p) => `${ECRAN}, p. ${p}`;
const UNDEAD = 'Anaérobiose, Jeûne, Immunité contre les maladies et les poisons';
export const QUICK_SERVITEURS = [
  { id: 'ecran-bikers', nom: 'Bikers', src: 'Groupe d\'humains', type: 'humain', ref: E(14), car: '2+ 2 2 2+ 2 2', def: '2+', pf: 5, s: '3/7/10/14',
    att: [{ n: 'Corps à corps', lvl: 3, arme: 'Coup de poing' }], tal: 'Athlétisme 2, Conduite 4, Corps à corps 3, Défense 2+, Intimidation 3+, Savoir criminel 2, Survie 1 (la route 3)' },
  { id: 'ecran-anti-ivg', nom: 'Commandos intégristes', src: 'Chrétiens intégristes, gardiens de la bienséance', type: 'humain', ref: E(14), car: '1+ 2 2 3 2 2', def: 2, pf: 4, s: '2/5/7/10',
    att: [{ n: 'Corps à corps', lvl: 2, arme: 'Coup de poing' }], tal: 'Aisance sociale 2, Athlétisme 2, Baratin 2, Conduite 2, Corps à corps 2, Défense 2, Discrétion 3, Discussion 3, Enquête 2, Métier 3, Savoir occulte 1 (religion chrétienne 3)' },
  { id: 'ecran-metal', nom: 'Fans de métal', src: 'Groupe d\'humains', type: 'humain', ref: E(14), car: '2+ 3 1+ 2 2 2+', def: 2, pf: 4, s: '3/7/10/14',
    att: [{ n: 'Corps à corps', lvl: 2, arme: 'Coup de poing' }], tal: 'Acrobatie 3, Aisance sociale 1+, Art 1 (métal 3), Athlétisme 2, Baratin 3, Conduite 3, Corps à corps 2, Défense 2, Discrétion 3, Discussion 2, Hobby (métal) 3, Intimidation 2' },
  { id: 'ecran-miliciens', nom: 'Miliciens', src: 'Groupe d\'humains', type: 'humain', ref: E(14), car: '2+ 2 2+ 2 2 2', def: 3, pf: 4, s: '3/7/10/14',
    att: [{ n: 'Corps à corps', lvl: 3, arme: 'Coup de poing' }], tal: 'Athlétisme 3, Conduite 2, Corps à corps 3, Culture générale 1 (lectures malsaines 2), Défense 3, Discrétion 2, Fouille 3, Intimidation 3, Intrusion 2, Survie 1 (milieu urbain 3)' },
  { id: 'ecran-police', nom: 'Police municipale', src: 'Groupe d\'humains', type: 'humain', ref: E(14), car: '2 2 2+ 2+ 2+ 2', def: 2, pf: 4, s: '3/6/9/12',
    att: [{ n: 'Arme réglementaire', lvl: 2, arme: 'Revolver petit calibre' }], tal: 'Aisance sociale 2, Athlétisme 2, Défense 2, Discrétion 2, Discussion 2+, Enquête 3, Fouille 2, Informatique 1+, Intimidation 2, Savoir militaire 1 (discipline 2+), Survie 1 (milieu urbain 2), Tir 1+ (arme réglementaire 2)' },
  { id: 'ecran-satanistes', nom: 'Satanistes', src: 'Groupe d\'humains', type: 'humain', ref: E(14), car: '2 2 2 1+ 2+ 3', def: 2, pf: 3, s: '3/6/9/12',
    att: [{ n: 'Corps à corps', lvl: 1, arme: 'Coup de poing' }], tal: 'Aisance sociale 3, Art 1 (laid 2), Baratin 2, Conduite 2, Défense 2, Discrétion 2+, Discussion 2, Enquête 2, Informatique 2, Langue : latin, Métier 2+, Savoir occulte 1 (satanisme de bazar 3), Séduction 2+' },
  { id: 'ecran-service-ordre', nom: 'Service d\'ordre', src: 'Groupe d\'humains', type: 'humain', ref: E(14), car: '2+ 2 2+ 2 3 2', def: 3, pf: 4, s: '3/7/10/14',
    att: [{ n: 'Corps à corps', lvl: '2+', arme: 'Coup de poing' }], tal: 'Athlétisme 3, Baratin 2, Conduite 2, Corps à corps 2+, Défense 3, Discrétion 2+, Intimidation 3+, Métier (organisation de spectacles) 2' },
  { id: 'ecran-skinheads', nom: 'Skinheads', src: 'Groupe d\'humains', type: 'humain', ref: E(14), car: '3 2+ 2 1+ 2 2+', def: 2, pf: 4, s: '4/8/12/16',
    att: [{ n: 'Cran d\'arrêt', lvl: 3, prec: -1, puis: -1, melee: true }, { n: 'Batte', lvl: 3, prec: -1, puis: 2, melee: true }], tal: 'Athlétisme 3, Combat 2 (couteaux ou contondantes 3), Conduite 2, Corps à corps 3, Défense 2, Fouille 2, Intimidation 4, Savoir criminel 1 (milieu skinhead 3)' },
  { id: 'ecran-section-legere', nom: 'Soldats de Dieu, section légère', src: 'Six hommes', type: 'soldat', ref: E(14), car: '2 3 2+ 2 2 2+', def: 3, pp: 6, pf: 4, s: '3/6/9/12',
    att: [{ n: 'Revolver gros calibre', lvl: '3+', arme: 'Revolver gros calibre' }], pow: 'Adhérence 1, Caméléon 1',
    tal: 'Acrobatie 3, Athlétisme 3, Conduite 3, Corps à corps 3, Défense 3, Discrétion 4, Intimidation 2, Savoir militaire 2 (reconnaissance 3), Tir 2 (armes de poing 3+)', notes: 'Une grenade fumigène. Section de six hommes ; peut être assignée à tout un groupe d\'anges (coût en PA partagé).' },
  { id: 'ecran-section-lourde', nom: 'Soldats de Dieu, section lourde', src: 'Six hommes', type: 'soldat', ref: E(15), car: '2+ 2 3 2+ 2 2', def: 3, pp: 6, pf: 5, s: '3/7/10/14', prot: 4,
    att: [{ n: 'Pistolet-mitrailleur', lvl: 4, arme: 'Pistolet-mitrailleur' }, { n: 'Grenade (×2)', lvl: 3, arme: 'Grenade' }], pow: 'Arme exaltée 1, Armure corporelle 1',
    tal: 'Athlétisme 3+, Conduite 3, Corps à corps 3, Défense 3, Discrétion 2, Intimidation 2+, Savoir militaire 2 (discipline 3), Tir 3 (armes automatiques 4)', notes: 'Veste de kevlar (protection 4, couverture partielle, renforcée), deux grenades. Section de six hommes.' },
  { id: 'ecran-section-soutien', nom: 'Soldats de Dieu, section de soutien', src: 'Trois hommes', type: 'soldat', ref: E(15), car: '3 2 2+ 2+ 2 2+', def: '2+', pp: 7, pf: 5, s: '4/8/12/16',
    att: [{ n: 'Revolver gros calibre', lvl: '2+', arme: 'Revolver gros calibre' }, { n: 'Lance-roquettes antichar (un pour la section)', lvl: '3+', arme: 'Lance-roquettes antichar' }], pow: 'Augmentation de Force 1, Champ de force 1',
    tal: 'Athlétisme 3+, Conduite 3, Corps à corps 2+, Défense 2+, Discrétion 2, Intimidation 3, Savoir militaire 1 (génie militaire 3+), Tir 2+ (armes de guerre 3+)', notes: 'Section de trois hommes seulement, mais elle coûte aussi 12 PA.' },
  { id: 'ecran-zombies', nom: 'Zombies', src: 'Morts-vivants (groupe de 15, construits avec 15 PA)', type: 'mortvivant', ref: E(15), car: '2+ 2 2 1 1 3', pp: 4, pf: 3, s: '4/8/12/16',
    att: [{ n: 'Ongles d\'acier', lvl: 3, prec: 2, puis: 2, melee: true }], pow: `${UNDEAD}, Apparence horrifique 1, Membre exotique : ongles d'acier, Régénération 1`, tal: 'Athlétisme 2+, Corps à corps 3, Intimidation 2+' },
  { id: 'ecran-squelettes', nom: 'Squelettes', src: 'Morts-vivants (groupe de 12, construits avec 18 PA)', type: 'mortvivant', ref: E(15), car: '2+ 3 2 1 1 3', def: 3, pp: 4, pf: 3, s: '4/8/12/16', prot: 2,
    att: [{ n: 'Épée courte', lvl: '3+', prec: 1, puis: 1, melee: true }], pow: `${UNDEAD}, Apparence horrifique 1, Régénération 1`, tal: 'Acrobatie 2+, Athlétisme 3, Combat 1+ (épées 3+), Corps à corps 3, Défense 3, Intimidation 3', notes: 'Petit bouclier (protection 2, couverture partielle, fragile).' },
  { id: 'ecran-goules', nom: 'Goules', src: 'Morts-vivants (groupe de 10, construites avec 20 PA)', type: 'mortvivant', ref: E(15), car: '3 2+ 2 1 1 3', def: '2+', pp: 6, pf: 4, s: '4/9/13/18',
    att: [{ n: 'Crocs (lutte)', lvl: '3+', prec: 3, puis: 1, melee: true }], pow: `${UNDEAD}, Apparence horrifique 1, Membre exotique : crocs, Poison 1`, tal: 'Athlétisme 3+, Corps à corps 3+, Défense 2+, Intimidation 4+' },
  { id: 'ecran-momie', nom: 'Momie', src: 'Morts-vivants (groupe de 3, construites avec 30 PA)', type: 'mortvivant', ref: E(15), car: '3 2 2 2+ 2 3', def: '2+', pp: 7, pf: 5, s: '4/9/13/18',
    att: [{ n: 'Corps à corps', lvl: '2+', arme: 'Coup de poing' }], pow: `${UNDEAD}, Apparence horrifique 2, Maladie 1`, tal: 'Athlétisme 3, Corps à corps 2+, Défense 2+, Discrétion 2, Discussion 2, Intimidation 4, Médecine 2, Survie 1 (désert 3)' },
  { id: 'ecran-spectre', nom: 'Spectre', src: 'Mort-vivant (seul, construit avec 40 PA)', type: 'mortvivant', ref: E(15), car: '1 2 2 2+ 3 4', pp: 8, pf: 3, s: '2/5/7/10', att: [],
    pow: `${UNDEAD}, Absorption de force 1, Apparence horrifique 1, Déphasage 1`, tal: 'Aisance sociale 3, Baratin 2+, Culture générale 1 (histoires de fantômes 3), Discrétion 3, Discussion 3, Intimidation 2',
    notes: 'Déphasage permanent et inversé : le spectre doit activer le pouvoir pour redevenir matériel.' },
  { id: 'ecran-vampire', nom: 'Vampire', src: 'Mort-vivant (seul, réservé aux démons de Samigina, construit avec 50 PA)', type: 'mortvivant', ref: E(15), car: '3+ 3+ 2 3 3+ 3', def: 3, pp: 6, pf: 6, s: '5/10/15/20',
    att: [{ n: 'Crocs (lutte)', lvl: 3, prec: 3, puis: 1, melee: true }], pow: `${UNDEAD}, Apparence horrifique 3, Baiser vampirique 1, Membre exotique : crocs`, tal: 'Acrobatie 3, Aisance sociale 3, Athlétisme 3, Corps à corps 3, Défense 3, Discrétion 3, Intimidation 3, Séduction 3' },
];
