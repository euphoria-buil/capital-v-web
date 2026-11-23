# Capital V web

Sitio público (React + Vite). En producción se sirve desde Docker (nginx) detrás del nginx del host con TLS.

## Desarrollo

```bash
npm ci
npm run dev
```

## Docker

```bash
docker compose up -d --build
# local: http://127.0.0.1:8088
```

El contenedor solo escucha en loopback. El nginx del host hace HTTPS en `capitalv.me` / `www.capitalv.me`.

## VPS

```bash
git clone https://github.com/euphoria-buil/capital-v-web.git /opt/capital-v-web
cd /opt/capital-v-web
chmod +x deploy/deploy-vps.sh
./deploy/deploy-vps.sh
```

DNS A de `capitalv.me` y `www.capitalv.me` debe apuntar a la VPS antes de Certbot.
