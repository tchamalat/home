# Guide de Configuration - Backend PostgreSQL

## 🚀 Mise en place initiale

### 1. Configurer PostgreSQL dans Docker

Ajoutez PostgreSQL à votre `docker-compose.yml` (ou créez-le) :

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: romantcham-db
    environment:
      POSTGRES_USER: romantcham
      POSTGRES_PASSWORD: changeme
      POSTGRES_DB: romantcham
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - app-network

  app:
    build: .
    container_name: romantcham-app
    depends_on:
      - postgres
    environment:
      DATABASE_URL: "postgresql://romantcham:changeme@postgres:5432/romantcham?schema=public"
      NEXTAUTH_URL: https://your-domain.com
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
      ADMIN_GMAIL: ${ADMIN_GMAIL}
    ports:
      - "3000:3000"
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
```

### 2. Configuration .env

Copiez `.env.example` vers `.env` et configurez :

```bash
cp .env.example .env
```

Modifiez `.env` avec vos vraies valeurs :
- `DATABASE_URL` : connexion PostgreSQL
- `ADMIN_GMAIL` : votre email Google (sera automatiquement admin)
- `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` : OAuth Google

### 3. Générer Prisma Client et créer la base

```bash
# Générer le client Prisma
pnpm exec prisma generate

# Créer les tables dans PostgreSQL
pnpm exec prisma db push

# OU utiliser les migrations (recommandé en production)
pnpm exec prisma migrate dev --name init
```

### 4. Définir votre compte comme Admin

Modifiez [route.ts](app/api/auth/[...nextauth]/route.ts) pour ajouter :

```typescript
async signIn({ user, account }) {
  // Auto-set admin role on first login
  if (user.email === process.env.ADMIN_GMAIL) {
    await prisma.user.update({
      where: { email: user.email },
      data: { role: "ADMIN" },
    });
  }
  // ... rest of code
}
```

## 📊 Structure de la base de données

### Modèles principaux :

- **User** : Utilisateurs (ADMIN, FAMILY, GUEST)
- **Group** : Groupes de partage de photos
- **Photo** : Métadonnées des photos
- **GroupMember** : Appartenance aux groupes
- **JoinRequest** : Demandes pour rejoindre un groupe
- **AddMemberRequest** : Demandes de membres famille pour ajouter quelqu'un
- **ConnectionLog** : Logs de connexion/déconnexion

## 🔐 Routes API créées

### Routes Admin (ADMIN uniquement)

- `GET /api/admin/logs` - Liste des connexions
- `GET /api/admin/users` - Liste des utilisateurs
- `PATCH /api/admin/users` - Modifier le rôle d'un utilisateur
- `GET /api/admin/groups` - Liste des groupes
- `POST /api/admin/groups` - Créer un groupe
- `DELETE /api/admin/groups` - Supprimer un groupe
- `POST /api/admin/groups/[groupId]/members` - Ajouter un membre
- `DELETE /api/admin/groups/[groupId]/members` - Retirer un membre
- `GET /api/admin/requests/join` - Demandes de rejoindre un groupe
- `PATCH /api/admin/requests/join` - Approuver/rejeter une demande
- `GET /api/admin/requests/add-member` - Demandes d'ajout de membres
- `PATCH /api/admin/requests/add-member` - Approuver/rejeter

### Routes utilisateurs

- `POST /api/requests/join` - Demander à rejoindre un groupe
- `GET /api/requests/join` - Mes demandes
- `POST /api/requests/add-member` - (FAMILY) Demander d'ajouter quelqu'un
- `GET /api/requests/add-member` - Mes demandes d'ajout
- `GET /api/groups` - Mes groupes

## 🎯 Prochaines étapes

### À implémenter :

1. **Upload de photos** (avec MinIO ou stockage local)
2. **Interface admin** ([app/admin](app/admin))
3. **Pages séparées pour famille vs invités**
4. **Gestion des permissions de partage de photos**
5. **Optimisation des images** (Sharp, Next.js Image)

### Commandes utiles :

```bash
# Visualiser la base de données
pnpm exec prisma studio

# Réinitialiser la base
pnpm exec prisma migrate reset

# Voir l'état des migrations
pnpm exec prisma migrate status
```

## ⚙️ Proxmox & Docker

Votre setup actuel :
- ✅ App Next.js dans Docker (VM Proxmox)
- ✅ Nginx reverse proxy (container Proxmox)
- ✅ PostgreSQL ajouté au même réseau Docker

Configuration Nginx pour le proxy :

```nginx
location /api/ {
    proxy_pass http://romantcham-app:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```
