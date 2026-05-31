# iASV Quiz — productie op Next-server (192.168.1.32)

## Architectuur

```
Telefoon → HTTPS (subdomein) → Cloudflare Tunnel → Next.js :3012 → MariaDB 192.168.1.14
```

| Onderdeel | Host | Rol |
|-----------|------|-----|
| Next.js | **192.168.1.32** | PWA + API (`/var/www/iasv-quiz`) |
| MariaDB | **192.168.1.14** | database `iasv_quiz` |
| PM2 proces | `iasv-quiz` | poort **3012** |

## Poorten op .32 (referentie)

| App | Poort |
|-----|-------|
| museum-app | 3011 |
| **iasv-quiz** | **3012** |
| med-next-pwa | 3007 |
| print-adres-app | 3008 |

## Eerste deploy (vanaf Windows)

```powershell
cd C:\DEV\iasv-quiz
pip install paramiko
python scripts/deploy_remote.py
```

Upload tar, `npm ci`, Prisma migrate + seed, build, PM2.

## Update op de server (via git, zelfde patroon als museum-pwa)

```bash
ssh root@192.168.1.32
cd /var/www/iasv-quiz
bash scripts/deploy.sh
```

Of handmatig:

```bash
cd /var/www/iasv-quiz
git pull origin main
npm ci
npx prisma migrate deploy
npm run build
pm2 restart iasv-quiz --update-env
```

## Omgevingsvariabelen (`.env.local` op server)

```env
DATABASE_URL=mysql://admin:kerkpoort@192.168.1.14:3306/iasv_quiz
NEXT_PUBLIC_APP_NAME=iASV Beademing Quiz
NODE_ENV=production
```

## Cloudflare Tunnel

Voeg in `config.yml` toe (pad kan verschillen):

```yaml
ingress:
  - hostname: iasv.jouwdomein.nl
    service: http://127.0.0.1:3012
  - service: http_status:404
```

Test lokaal op de server:

```bash
curl -I http://127.0.0.1:3012/
pm2 logs iasv-quiz
```

## Lokaal ontwikkelen (Windows)

```powershell
cd C:\DEV\iasv-quiz
npm run dev
```

Open http://localhost:3000 — productie draait op poort **3012** op de server.
