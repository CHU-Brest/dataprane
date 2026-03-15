# Dataprane — Blog Datascience Santé

## Projet
Blog de datascience appliquée à la santé, fait avec Hugo et un thème custom.

## Stack technique
- **Hugo** v0.157+ (générateur de site statique)
- **Thème** : custom, situé dans `themes/dataprane/`
- **CSS** : Tailwind CSS (via CDN en dev, via CLI en prod)
- **Design** : inspiré de Medium.com, dark/light mode
- **Langue** : français principalement

## Structure Hugo
```
dataprane/
├── config/           # Configuration Hugo (toml)
├── content/          # Articles et pages
│   ├── posts/        # Billets de blog
│   └── authors/      # Pages auteurs
├── themes/dataprane/ # Thème custom
│   ├── layouts/      # Templates HTML
│   ├── static/       # Assets statiques
│   └── assets/       # Assets Hugo Pipes (CSS, JS)
└── static/           # Assets racine
```

## Design system
- Police : Inter (texte), Merriweather (titres articles)
- Couleurs primaires : bleu médical (`#0ea5e9`) et vert données (`#10b981`)
- Layout page principale : 2 colonnes (2/3 articles | 1/3 sidebar)
- Header : titre "dataprane" + barre de recherche + liens (contribution, github)
- Dark/light mode : toggle dans le header, persisté en localStorage

## Conventions
- Les articles vont dans `content/posts/YYYY/nom-article.md`
- Front matter en TOML
- Les catégories, tags et auteurs sont des taxonomies Hugo
- Tailwind classes directement dans les templates HTML
- Pas de JS framework, vanilla JS uniquement

## Commandes utiles
```bash
hugo server -D          # Dev avec drafts
hugo build              # Build prod
npx tailwindcss ...     # Compilation CSS si besoin
```
