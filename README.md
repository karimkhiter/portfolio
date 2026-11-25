# Portfolio de Karim Khiter

Site statique (HTML, CSS, JavaScript sans dépendance), généré à partir de fichiers de contenu JSON par un petit script Python. Prévu pour GitHub Pages à l'adresse `https://karimkhiter.github.io/portfolio/`.

## Arborescence

```
index.html, projets/, parcours/, competences/, formation/, profil/, contact/, 404.html   ← pages GÉNÉRÉES (ne pas modifier à la main)
pages/, files/CV.pdf      ← redirections des anciennes adresses (générées)
sitemap.xml, robots.txt   ← générés
assets/
  css/style.css           ← toute la charte graphique (jetons de couleur en haut du fichier)
  js/main.js              ← thème, menu mobile, filtres, constellation
  fonts/                  ← Fraunces, Instrument Sans, JetBrains Mono (licence OFL)
  img/                    ← photo, favicon, image Open Graph, captures des projets (WebP)
  docs/                   ← CV et rapport de SAÉ en PDF
_src/
  build.py                ← générateur (Python 3.8+, aucune installation)
  content/                ← LE CONTENU : c'est ici que tout se modifie
    site.json             ← identité, statut « En ce moment », liens, navigation
    accueil.json          ← textes de la page d'accueil
    projets.json          ← les projets (études de cas)
    parcours.json         ← expériences, formation, certifications
    competences.json      ← compétences et outils (preuves calculées depuis projets.json)
    but.json              ← référentiel du BUT : 4 compétences, niveaux, AC
    profil.json           ← page Profil et constellation des centres d'intérêt
  cv/cv.html              ← source du CV PDF
  CORRECTIONS.md          ← ce qui a été corrigé par rapport à l'ancien site
  A_CONFIRMER.md          ← faits à vérifier avant publication
```

Le dossier `_src` n'est pas publié par GitHub Pages (les dossiers commençant par `_` sont ignorés).

## Modifier le contenu

1. Éditer le fichier JSON concerné dans `_src/content/`.
2. Régénérer le site depuis la racine du dépôt :

   ```
   python3 _src/build.py
   ```

   Le script vérifie la cohérence (technologies, catégories, AC, liens entre projets) et s'arrête avec un message clair en cas d'erreur.

Exemples courants :

- **Retirer le bandeau de recherche de stage** : dans `site.json`, `"status": {"visible": false, ...}`.
- **Après la passation du BDE** : dans `parcours.json`, renseigner `"end": "2027-01"` et changer `period_label` ; dans `site.json`, mettre à jour le bloc `now`.
- **Ajouter un projet** : copier une entrée de `projets.json`, changer le `slug` (il devient l'adresse de la page), remplir les champs. Les compteurs, filtres, preuves de compétences et la page SAÉ se mettent à jour seuls.
- **Ajouter une image de projet** : déposer `nom.webp` (1400 px de large) et `nom-720.webp` (720 px) dans `assets/img/projets/`, puis `"cover": {"src": "assets/img/projets/nom", "alt": "description"}`. Sans image, une couverture graphique est dessinée automatiquement.
- **Mettre à jour la date affichée en pied de page** : `updated` dans `site.json`.
- **Plus tard, une rubrique Notes / Publications** : ajouter un type dans `site.json > types` (par exemple `"article"`) et une catégorie `autres` ; les fiches fonctionnent déjà pour du contenu non technique. Ne l'ajouter au menu qu'avec du contenu réel.

## Prévisualiser en local

```
python3 _src/build.py
cd ..            # dossier parent du dépôt
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000/portfolio/`. Le site fonctionne aussi en double-cliquant sur `index.html` (les liens sont relatifs).

## Mettre en ligne sur GitHub Pages

Le dépôt pointe déjà vers `https://github.com/karimkhiter/portfolio`. Rien n'a été poussé : vérifiez d'abord les pages, puis :

```
git add -A
git commit -m "Refonte complète du portfolio"
git push origin main
```

Dans GitHub : Settings > Pages > Source « Deploy from a branch », branche `main`, dossier `/ (root)`. Le site sera servi sous `/portfolio/` ; tous les liens étant relatifs, aucun réglage supplémentaire n'est nécessaire. Si le site change d'adresse, modifier `base_url` dans `site.json` (utilisé pour les balises canoniques, le sitemap et l'image de partage).

## Charte graphique « Cuivre »

- Thème clair de référence : papier sable `#F3ECE3`, encre brune `#2A1F1A`, roux cuivré `#A3431C` / `#C2552A`, accents sauge `#376059`, ocre `#7F560F`, prune `#7B4459`.
- Thème sombre « cacao » : fond `#2B2320` (jamais noir), texte crème `#F2E8DC` (jamais blanc pur), roux `#EF9066`.
- Couleurs unies, sans dégradés. Contrastes vérifiés (WCAG AA) dans les deux thèmes.
- Titres en Fraunces (serif chaleureuse), texte en Instrument Sans, métadonnées en JetBrains Mono.
- Motif signature : les orbites (portrait de l'accueil, couvertures de projets, constellation « Curiosité en orbite » de la page Profil).
- Les animations respectent le réglage système « réduire les animations ».
