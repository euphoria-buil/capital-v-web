# Capital V Web

Web de promoción y comunidad para el servidor **Capital V Roleplay**: foro, cuenta de usuario, reportes in-game, tienda de packs, panel admin y gestión de permisos (owner).

## Estructura

| Carpeta | Descripción |
|---------|-------------|
| `client/` | Frontend React + Vite + TypeScript |
| `server/` | API Express + Prisma + PostgreSQL |
| `legacy/` | Prototipo HTML estático original |
| `docker-compose.yml` | PostgreSQL local |

## Arranque rápido

1. **Base de datos**

PostgreSQL del proyecto expone el puerto **55432** en el host (evita choque con un Postgres local en 5432/5433).

```bash
docker compose up -d
copy .env.example server\.env
```

2. **API**

```bash
cd server
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

3. **Web**

```bash
cd client
npm install
npm run dev
```

- Web: http://localhost:5173  
- API: http://localhost:4000  

**Usuario seed (owner):** ver `SEED_OWNER_*` en `server/.env` (por defecto `owner@capitalv.local` / `Owner123!`).

## Roles

- `USER` — foro y reportes propios  
- `SUPPORT` — gestión de reportes + admin básico  
- `ADMIN` — moderación foro, usuarios, tienda  
- `OWNER` — matriz de permisos web en `/owner/permisos`

## Scripts raíz

```bash
npm run db:up
npm run dev:server
npm run dev:client
```