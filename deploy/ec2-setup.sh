#!/usr/bin/env bash
#
# One-time provisioning for the PhoneX API on a fresh EC2 instance.
#
#   DOMAIN=api.example.com EMAIL=you@example.com bash deploy/ec2-setup.sh
#
# Idempotent: safe to re-run. It installs Docker + nginx, clones the repo,
# installs the reverse-proxy vhost, and (when DOMAIN/EMAIL are set and DNS
# already points here) issues a Let's Encrypt certificate.
#
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/sany2407/phoneX-be.git}"
BRANCH="${BRANCH:-dev}"
APP_DIR="${APP_DIR:-$HOME/phoneX-be}"
DOMAIN="${DOMAIN:-}"
EMAIL="${EMAIL:-}"

say() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }
warn() { printf '\n\033[1;33m!! %s\033[0m\n' "$*"; }

# ── Packages ────────────────────────────────────────────────────────────────
say "Installing system packages"
if command -v apt-get >/dev/null 2>&1; then
  export DEBIAN_FRONTEND=noninteractive
  sudo apt-get update -qq
  sudo apt-get install -y -qq ca-certificates curl git nginx certbot python3-certbot-nginx
  PKG=debian
elif command -v dnf >/dev/null 2>&1; then
  sudo dnf install -y -q git nginx certbot python3-certbot-nginx
  PKG=rhel
else
  echo "Unsupported distribution: install git, nginx, certbot and Docker manually." >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  say "Installing Docker"
  if [ "$PKG" = debian ]; then
    curl -fsSL https://get.docker.com | sudo sh
  else
    sudo dnf install -y -q docker
  fi
fi

sudo systemctl enable --now docker
sudo usermod -aG docker "$USER" || true

# Compose plugin (v2) — install the standalone binary if the distro lacks it.
if ! sudo docker compose version >/dev/null 2>&1; then
  say "Installing the Docker Compose plugin"
  case "$(uname -m)" in
    x86_64) COMPOSE_ARCH=x86_64 ;;
    aarch64|arm64) COMPOSE_ARCH=aarch64 ;;
    *) echo "Unsupported CPU architecture: $(uname -m)" >&2; exit 1 ;;
  esac
  PLUGIN_DIR=/usr/local/lib/docker/cli-plugins
  sudo mkdir -p "$PLUGIN_DIR"
  sudo curl -fsSL \
    "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-${COMPOSE_ARCH}" \
    -o "$PLUGIN_DIR/docker-compose"
  sudo chmod 0755 "$PLUGIN_DIR/docker-compose"
fi

# ── Code ────────────────────────────────────────────────────────────────────
if [ ! -d "$APP_DIR/.git" ]; then
  say "Cloning $REPO_URL ($BRANCH) into $APP_DIR"
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
else
  say "Updating $APP_DIR"
  git -C "$APP_DIR" fetch --prune origin
  git -C "$APP_DIR" checkout -q "$BRANCH"
  git -C "$APP_DIR" reset -q --hard "origin/$BRANCH"
fi

# ── Environment ─────────────────────────────────────────────────────────────
if [ ! -f "$APP_DIR/.env" ]; then
  say "Creating $APP_DIR/.env from the production template"
  cp "$APP_DIR/deploy/env.production.example" "$APP_DIR/.env"
  chmod 600 "$APP_DIR/.env"
  warn "Edit $APP_DIR/.env before the first deploy — the API exits at boot if
   any required variable is missing or too short."
fi

# ── nginx ───────────────────────────────────────────────────────────────────
if [ -n "$DOMAIN" ]; then
  say "Installing the nginx vhost for $DOMAIN"
  RENDERED="$(mktemp)"
  sed "s/__DOMAIN__/${DOMAIN}/g" "$APP_DIR/deploy/nginx/phonex-api.conf" >"$RENDERED"

  if [ "$PKG" = debian ]; then
    sudo install -m 0644 "$RENDERED" /etc/nginx/sites-available/phonex-api.conf
    sudo ln -sfn /etc/nginx/sites-available/phonex-api.conf /etc/nginx/sites-enabled/phonex-api.conf
    sudo rm -f /etc/nginx/sites-enabled/default
  else
    sudo install -m 0644 "$RENDERED" /etc/nginx/conf.d/phonex-api.conf
  fi
  rm -f "$RENDERED"

  sudo nginx -t
  sudo systemctl enable --now nginx
  sudo systemctl reload nginx
fi

# ── TLS ─────────────────────────────────────────────────────────────────────
if [ -n "$DOMAIN" ] && [ -n "$EMAIL" ]; then
  say "Requesting a Let's Encrypt certificate for $DOMAIN"
  sudo certbot --nginx -d "$DOMAIN" \
    --non-interactive --agree-tos -m "$EMAIL" --redirect ||
    warn "certbot failed — DNS may not point at this instance yet. Re-run:
   sudo certbot --nginx -d $DOMAIN --agree-tos -m $EMAIL --redirect"
else
  warn "Skipping TLS: pass DOMAIN and EMAIL to issue a certificate."
fi

# ── Done ────────────────────────────────────────────────────────────────────
cat <<EOF

────────────────────────────────────────────────────────────────────
 Next steps

 1. Fill in the environment file:
      nano $APP_DIR/.env

 2. Start the stack:
      cd $APP_DIR && sudo docker compose up -d --build

 3. Confirm it answers:
      curl http://127.0.0.1:8080/api/v1/health

 4. Log out and back in so the docker group applies, then future
    deploys need no sudo.

 Security group must allow inbound 22, 80 and 443.
────────────────────────────────────────────────────────────────────
EOF
