# Champmillon - site de la commune

Site statique de la commune de Champmillon (Charente), construit avec [Astro](https://astro.build) et Tailwind CSS, publié sur GitHub Pages.
Tout le contenu (textes, menu, page d'accueil, actualités, alertes, journal) est dans des fichiers Markdown/YAML du dossier `src/content/`. On le modifie sans toucher au code.

---

## Guide du contributeur

Les informations encore à compléter sont listées dans [A-COMPLETER.md](./A-COMPLETER.md).

### Le plus simple : l'éditeur en ligne Pages CMS

1. Ouvrez <https://app.pagescms.org> et connectez-vous avec votre compte GitHub (l'administrateur du site doit vous avoir ajouté au dépôt).
2. Choisissez le dépôt **champmillon**.
3. Dans le menu de gauche, choisissez ce que vous voulez modifier, remplissez le formulaire et cliquez sur **Save**.
4. Le site est mis à jour automatiquement en 2 à 3 minutes.

Si un champ obligatoire manque ou contient une erreur, le site **n'est pas** mis à jour : la version précédente reste en ligne et l'administrateur reçoit un message.

### Ce que vous pouvez faire

| Je veux... | Où | À savoir |
| --- | --- | --- |
| Publier une actualité | **Actualités et rendez-vous** → Add | Remplissez « Rendez-vous » pour qu'elle apparaisse aussi dans l'agenda. Cochez « Brouillon » pour la préparer sans la publier. |
| Publier une alerte (crue, coupure d'eau, route fermée...) | **Alertes et annonces importantes** → Add | Elle s'affiche en bandeau sur tout le site **du** « Afficher à partir du » **au** « Afficher jusqu'au » inclus, puis passe dans l'historique. Rien à supprimer. |
| Ajouter le journal de l'année | **Le journal annuel** → Add | Déposez le PDF. Le texte « Version en ligne » est facultatif : sans texte, seul le PDF est proposé. |
| Modifier une page (« La mairie », « Démarches », « Le village »...) | **Pages du site** | Chaque titre « H2 » devient une entrée du sommaire « Sur cette page ». Listes à puces, liens, photos. |
| Créer une page | **Pages du site** → Add | Le nom du fichier devient l'adresse (`services` → `/services/`). Ajoutez-la ensuite au menu. |
| Changer le menu, les horaires, le téléphone | **Réglages du site** | |
| Changer la page d'accueil (photo, tuiles, bloc « Découvrir ») | **Page d'accueil** | |

### Photos

- Utilisez des photos dont la commune a les droits, ou sous licence libre, et indiquez l'auteur dans la légende.
- Inutile de les réduire : le site les redimensionne et les compresse automatiquement.
- Notez la source des photos dans `src/assets/images/CREDITS.md` et dans la page **Mentions légales**.

### Sans Pages CMS : directement sur GitHub

Chaque fichier peut être modifié sur github.com (icône crayon). La partie entre les deux lignes `---` en haut du fichier contient les réglages (titre, date...), le texte vient ensuite en [Markdown](https://www.markdownguide.org/basic-syntax/) :

```md
---
titre: Fête du village
date: 2026-06-01
resume: Une phrase affichée dans les listes.
categorie: Vie du village
evenement:
  date: 2026-06-21
  heure: 19 h
  lieu: Place de l'église
---

Le texte de l'actualité. **Gras**, *italique*, [un lien](/mairie/).

## Un intertitre

- une liste
- à puces
```

Catégories possibles : `Mairie`, `Vie du village`, `Travaux`, `Associations`, `École`, `Environnement`.
Niveaux d'alerte : `info` (vert), `vigilance` (orange), `urgent` (rouge).

---

## Technical notes

### Run locally

Node.js 22.12+.

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # type-check + static build into dist/
npm run preview
```

### Structure

```text
src/
  content/              ← everything contributors edit
    reglages/site.yaml      site name, mairie contacts & hours, menu, footer links
    reglages/accueil.yaml   homepage: hero, quick tiles, "discover" photos
    pages/*.md              generic pages, file name = URL
    actualites/*.md         news (optional `evenement` → agenda)
    alertes/*.md            announcements with `debut`/`fin` dates
    journal/*.md            yearly issues (PDF in public/journal/, optional web body)
  content.config.ts     schemas (French field names, tolerant of empty form values)
  assets/images/        photos, optimised at build time (WebP, responsive sizes)
  components/  layouts/  pages/   ← ~1,000 lines of templates
  lib/content.ts        queries: sorted news, agenda, active alerts, French dates
  middleware.ts         prefixes "/..." links with the base path when deployed in a sub-folder
  styles/global.css     design tokens (palette, fonts) + Markdown typography
.pages.yml             Pages CMS forms
.github/workflows/deploy.yml
```

### Deployment (GitHub Pages)

GitHub Actions builds and publishes on every push to `main`, and every night (so alerts appear and expire on their dates; a small inline script also hides an expired banner between builds).

First publication:

1. Push the `main` branch: `git push -u origin main`.
2. On GitHub: **Settings > Pages > Build and deployment > Source: GitHub Actions**.
3. **Actions** tab: re-run the "Publier le site" workflow if the first run failed before step 2.
4. The site is online at `https://<user>.github.io/champmillon/`. The workflow reads this address, so links work in the sub-folder and on a custom domain (Settings > Pages > Custom domain).

Free GitHub accounts can only publish Pages from a **public** repository.

Placeholders still to fill in are listed in [A-COMPLETER.md](./A-COMPLETER.md).

### Pages CMS setup

Install the Pages CMS GitHub App on the repository (from app.pagescms.org), then invite contributors as repository collaborators, or by email from Pages CMS (no GitHub account needed for them).

### Design choices

- No theme: Astro + Tailwind v4 + `@tailwindcss/typography`, self-hosted fonts (Figtree for headings, Source Sans 3 for text), no client JavaScript except the alert-expiry one-liner. The 4-item menu is shown in full on every screen size (no burger). Lighthouse accessibility, best practices and SEO: 100.
- Colours and fonts live in `src/styles/global.css` (`@theme`).
- Icons are inline SVG in `src/components/Icon.astro`; their names can be used in `accueil.yaml`.
- Photos and logo: commune de Champmillon (see `src/assets/images/CREDITS.md`). The original photo library in `/photos/` is git-ignored.
