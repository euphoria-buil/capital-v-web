#!/usr/bin/env bash
# Build and publish Capital V web on this VPS (docker + host nginx + certbot).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE="${SITE_NAME:-capitalv.me}"
WWW="www.${SITE}"
NGINX_AVAIL="/etc/nginx/sites-available/${SITE}"
NGINX_EN="/etc/nginx/sites-enabled/${SITE}"

cd "$ROOT"

if [[ ! -f docker-compose.yml ]]; then
  echo "Run from capital-v-web checkout." >&2
  exit 1
fi

docker compose build
docker compose up -d --remove-orphans

install -m 644 "$ROOT/deploy/nginx.host.conf" "$NGINX_AVAIL"
ln -sfn "$NGINX_AVAIL" "$NGINX_EN"
nginx -t
systemctl reload nginx

if [[ ! -d "/etc/letsencrypt/live/${SITE}" ]]; then
  mkdir -p /var/www/html
  certbot --nginx -d "$SITE" -d "$WWW" --non-interactive --agree-tos --register-unsafely-without-email --redirect
else
  certbot --nginx -d "$SITE" -d "$WWW" --non-interactive --reinstall --redirect || true
fi

nginx -t
systemctl reload nginx
curl -fsS "http://127.0.0.1:8088/healthz"
echo
echo "Deployed. https://${SITE}/"
