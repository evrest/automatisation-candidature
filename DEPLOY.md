# Déploiement — Job Automator

Architecture cible :

```
       ┌──────────────────────┐         ┌────────────────────────┐
GitHub │ Vercel (frontend)    │  /api   │ Fly.io (backend)        │
push   │ React + Vite         │ ──────▶ │ FastAPI + SQLite        │
main ─▶│ <app>.vercel.app     │ rewrite │ <app>.fly.dev           │
       └──────────────────────┘         └────────────────────────┘
              ▲                                  ▲
              │                                  │
           Workflow                          Workflow
       deploy-frontend.yml             deploy-backend.yml
```

Le front et le back se déploient indépendamment, déclenchés par les chemins modifiés
sur la branche `main`. Le rewrite `/api/*` dans `vercel.json` évite tout problème CORS :
le navigateur ne voit que le domaine Vercel.

---

## 0. Prérequis locaux

| Outil    | Installation                                   |
|----------|------------------------------------------------|
| `git`    | déjà là                                        |
| `gh`     | `brew install gh` (utile pour les secrets)     |
| `flyctl` | `brew install flyctl` puis `fly auth login`    |
| `vercel` | `npm i -g vercel` puis `vercel login`          |
| Node 20  | via `nvm install 20` ou homebrew               |
| Python 3.12 | via `pyenv` ou homebrew                     |

---

## 1. Initialiser le dépôt Git et pousser sur GitHub

Le projet n'est pas encore un repo git :

```bash
cd /Users/hugomarras/Desktop/Projets-Perso/Automatisation-Candidature
git init
git add .
git commit -m "init: backend FastAPI + frontend React + CI/CD"
gh repo create automatisation-candidature --public --source=. --push
```

---

## 2. Backend → Fly.io

### 2.1 Création de l'app et du volume (une seule fois)

```bash
cd backend

# Crée l'app (réutilise fly.toml — réponds "No" à "copy from existing app")
fly launch --no-deploy

# Si fly te propose de renommer, choisis quelque chose d'unique, par ex.
# job-automator-api-<tonpseudo>, et mets à jour le champ `app = ...` de fly.toml.

# Volume persistant pour SQLite
fly volumes create data --size 1 --region cdg
```

> ⚠️ **SQLite + Fly.io = 1 seule machine.** Le volume n'est attaché qu'à une machine.
> Si tu scales à plusieurs instances, les écritures divergent. Pour scaler,
> bascule sur Postgres (`fly postgres create`) et mets `DATABASE_URL` en secret.

### 2.2 Secrets

```bash
# Remplace par ton URL Vercel finale après le 1er déploiement front
fly secrets set CORS_ORIGINS="https://job-automator.vercel.app"
```

### 2.3 Premier déploiement manuel

```bash
fly deploy
fly status
fly logs
```

Vérifie : `curl https://<ton-app>.fly.dev/health` → `{"status":"ok"}`.

### 2.4 Token pour GitHub Actions

```bash
fly tokens create deploy -x 999999h
```

Copie le token et ajoute-le dans **GitHub → Settings → Secrets → Actions** :

| Secret         | Valeur                       |
|----------------|------------------------------|
| `FLY_API_TOKEN`| la sortie de `fly tokens …`  |

---

## 3. Frontend → Vercel

### 3.1 Mettre à jour `vercel.json`

Édite `frontend/vercel.json` et remplace `job-automator-api.fly.dev` par l'URL
réelle du backend (cf. sortie de `fly status`).

### 3.2 Lier le projet Vercel (une seule fois)

```bash
cd frontend
vercel link
# Choisis ton compte / scope, et "create new project" si pas existant.
# Vérifie que "Root Directory" = . (on est déjà dans frontend/)
```

Cela crée `frontend/.vercel/project.json`. **Ne pas commiter** (déjà dans `.gitignore`).

### 3.3 Premier déploiement manuel

```bash
vercel deploy --prod
```

Note l'URL de production retournée — c'est elle qui doit aller dans `CORS_ORIGINS`
côté backend (étape 2.2).

### 3.4 Secrets pour GitHub Actions

Récupère les ids depuis `frontend/.vercel/project.json` :

```bash
cat frontend/.vercel/project.json
# { "orgId": "...", "projectId": "..." }
```

Crée un token sur https://vercel.com/account/tokens, puis ajoute :

| Secret              | Valeur                                  |
|---------------------|-----------------------------------------|
| `VERCEL_TOKEN`      | le token créé                            |
| `VERCEL_ORG_ID`     | `orgId` du fichier `project.json`        |
| `VERCEL_PROJECT_ID` | `projectId` du fichier `project.json`    |

---

## 4. Workflows GitHub Actions

Trois workflows sont définis dans `.github/workflows/` :

| Fichier                  | Déclencheur                              | Rôle                                  |
|--------------------------|------------------------------------------|---------------------------------------|
| `ci.yml`                 | `pull_request` + `push` main             | Smoke import backend, build front     |
| `deploy-backend.yml`     | push main sur `backend/**`               | `flyctl deploy --remote-only`         |
| `deploy-frontend.yml`    | push main sur `frontend/**`              | `vercel pull → build → deploy --prod` |

Tu peux aussi les déclencher à la main depuis l'onglet **Actions** (workflow_dispatch).

### Récap des secrets nécessaires

| Secret              | Pour                  |
|---------------------|-----------------------|
| `FLY_API_TOKEN`     | Backend deploy        |
| `VERCEL_TOKEN`      | Frontend deploy       |
| `VERCEL_ORG_ID`     | Frontend deploy       |
| `VERCEL_PROJECT_ID` | Frontend deploy       |

Ajoute-les via `gh` en une fois :

```bash
gh secret set FLY_API_TOKEN     --body "fo1_..."
gh secret set VERCEL_TOKEN      --body "..."
gh secret set VERCEL_ORG_ID     --body "team_..."
gh secret set VERCEL_PROJECT_ID --body "prj_..."
```

---

## 5. Cycle de déploiement courant

```bash
git checkout -b feat/whatever
# ... tu codes ...
git commit -am "feat: ..."
git push -u origin feat/whatever
gh pr create --fill          # CI tourne sur la PR
# merge → push sur main → deploy auto du seul côté qui a changé
```

---

## 6. Troubleshooting

| Symptôme | Cause probable | Fix |
|----------|----------------|-----|
| `502` sur le front en prod, OK en local | rewrite Vercel pointe sur la mauvaise URL Fly | mets à jour `frontend/vercel.json` puis re-deploy |
| `CORS error` direct sur `<app>.fly.dev/api` | tu appelles le backend en bypassant le rewrite | passe toujours par le domaine Vercel, ou ajoute le domaine dans `CORS_ORIGINS` |
| `database is locked` côté Fly | plusieurs machines écrivent sur le volume | force 1 machine : `fly scale count 1` ; migre vers Postgres pour scaler |
| Build front KO sur CI : `npm ci` plante | `package-lock.json` pas commité | `cd frontend && npm install && git add package-lock.json && git commit` |
| `flyctl deploy` : `app not found` | nom dans `fly.toml` != app réelle | aligne le champ `app` ou renomme l'app sur Fly |
| Vercel deploy KO : `Project not found` | `VERCEL_PROJECT_ID` faux ou pas re-link après suppression | refais `vercel link` puis recopie les ids |

### Voir les logs

```bash
fly logs                    # backend en direct
fly status
vercel logs <deployment-url>  # front
```

---

## 7. Coûts

- **Fly.io** : 1 VM shared 256MB ~gratuite, volume 1GB ~0.15$/mois, auto-stop activé.
- **Vercel** : Hobby gratuit (limites raisonnables pour MVP perso).
- **GitHub Actions** : 2000 min/mois gratuit sur compte perso, largement suffisant.

---

## 8. Aller plus loin

- **Postgres** au lieu de SQLite : `fly postgres create` + `fly postgres attach`
  → injecte automatiquement `DATABASE_URL`. Adapter `requirements.txt` (`psycopg[binary]`).
- **Custom domain** : `fly certs add api.tondomaine.com` + côté Vercel onglet Domains.
- **Migrations** : passer de `Base.metadata.create_all` à Alembic dès que le schéma bouge.
- **Auth** : Clerk / Auth.js côté front, vérification de JWT côté FastAPI.
