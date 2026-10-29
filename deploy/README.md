# Deploying the API to EC2

Single-instance deployment: Docker runs the API on `127.0.0.1:8080`, nginx
terminates TLS on 80/443, and the database stays on Aiven.

```
GitHub  ──push to dev──▶  Actions  ──ssh──▶  EC2
                                              ├─ nginx :443  ──▶ 127.0.0.1:8080
                                              └─ docker compose ──▶ API
                                                        │
                                                        └──▶ Aiven Postgres
```

## What is in this folder

| File | Purpose |
| --- | --- |
| `ec2-setup.sh` | One-time provisioning: Docker, Compose, nginx, repo clone, vhost, TLS |
| `remote-deploy.sh` | Runs on the server: pull `dev`, rebuild, restart, wait for health |
| `nginx/phonex-api.conf` | Reverse-proxy vhost (`__DOMAIN__` is substituted by setup) |
| `env.production.example` | Template for the server's `.env` |
| `../docker-compose.yml` | The runtime stack (single `api` service) |
| `../.github/workflows/deploy-dev.yml` | Deploy on every push to `dev` |

## 1. Instance

The instance needs at least **t3.small / 2 GB RAM** — `npm ci` plus the
TypeScript build inside Docker needs headroom; a `t2.micro` will thrash.

Security group inbound rules:

| Port | Source | Why |
| --- | --- | --- |
| 22 | your IP | SSH |
| 80 | 0.0.0.0/0 | ACME challenge + HTTP→HTTPS redirect |
| 443 | 0.0.0.0/0 | the API |

Port 8080 stays closed — the container binds to loopback only.

## 2. DNS

Point the API hostname at the instance's public IP (an `A` record, or a
`CNAME` if you use an Elastic IP):

```
api.example.com  →  A  →  13.x.x.x
```

Wait for it to resolve (`dig +short api.example.com`) before running setup,
otherwise certbot cannot issue a certificate.

## 3. Provision

```bash
scp -i testing.pem deploy/ec2-setup.sh ubuntu@<host>:~/
ssh -i testing.pem ubuntu@<host> \
  'DOMAIN=api.example.com EMAIL=you@example.com bash ~/ec2-setup.sh'
```

The user is `ubuntu` on Ubuntu AMIs and `ec2-user` on Amazon Linux.

## 4. Configure secrets on the server

```bash
cd ~/phoneX-be
nano .env          # start from deploy/env.production.example
chmod 600 .env
```

Two things that differ from a local `.env`:

- **`sslrootcert` must be `./ca.pem`**, not a Windows path. The image copies
  `ca.pem` into `/app`, and relative paths resolve against the working
  directory.
- **`CORS_ORIGIN` must be the exact frontend origin**, with no trailing slash.

Generate the JWT secrets on the server:

```bash
openssl rand -hex 32   # JWT_ACCESS_SECRET
openssl rand -hex 32   # JWT_REFRESH_SECRET
```

Then start it:

```bash
sudo docker compose up -d --build
curl http://127.0.0.1:8080/api/v1/health
curl https://api.example.com/api/v1/health
```

## 5. Allow the instance in Aiven

Aiven only accepts connections from allowed IPs when an allowlist is set.
Add the instance's public IP (or an Elastic IP, which survives reboots) in
the Aiven console, then restart the container.

## 6. Wire up GitHub Actions

Add three repository secrets (Settings → Secrets and variables → Actions):

| Secret | Value |
| --- | --- |
| `EC2_HOST` | public IP or hostname |
| `EC2_USER` | `ubuntu` or `ec2-user` |
| `EC2_SSH_KEY` | full contents of `testing.pem`, including the BEGIN/END lines |

After that, every push to `dev` redeploys. The workflow fails the build if the
API does not answer `/api/v1/health` within 80 seconds, so a broken image never
sits in front of users silently.

## Routine operations

```bash
ssh ubuntu@<host> 'cd ~/phoneX-be && docker compose logs -f --tail=100'
ssh ubuntu@<host> 'cd ~/phoneX-be && docker compose restart'
ssh ubuntu@<host> 'cd ~/phoneX-be && docker compose down'         # stop
ssh ubuntu@<host> 'sudo certbot renew --dry-run'                  # TLS check
```

## Migrations

The container runs `prisma migrate deploy` before it starts, so a deploy
applies pending migrations automatically. The `prisma` CLI is a production
dependency for exactly this reason — it must not be dropped from
`dependencies`.

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| Container exits immediately, `Invalid environment variables` | `.env` missing a required key or a JWT secret under 32 chars |
| `Can't reach database server` | Aiven allowlist, or the Aiven service is powered off |
| `502 Bad Gateway` | Container down — `docker compose ps`, then `logs` |
| CORS errors in the browser | `CORS_ORIGIN` does not match the frontend origin exactly |
| `429 Too many requests` | `RATE_LIMIT_MAX` is too low for the traffic; raise it in `.env` and restart |
| `ERR_TOO_MANY_REDIRECTS` | `trust proxy` and the `X-Forwarded-Proto` header disagree |
