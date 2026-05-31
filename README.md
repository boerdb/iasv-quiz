# iASV Beademing Quiz

Vrolijke PWA-quiz over Intelligent Adaptive Support Ventilation (iASV/ASV) op Hamilton-ventilatoren.

## Features

- 50 iASV-vragen in MariaDB
- Elke quiz: 10 willekeurige vragen
- Score 0–10 (1 punt per goed antwoord)
- Uitleg bij foute antwoorden na afloop
- Scoreboard met naam
- Installeerbaar als PWA

## Lokaal ontwikkelen

```powershell
cd C:\DEV\iasv-quiz
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open http://localhost:3000

## Productie

Live op **https://iasv-quiz.clvs.nl** (server 192.168.1.32, PM2 poort **3012**, map `/var/www/iasv-quiz`).

Zelfde setup als [museum-pwa](../museum-pwa).

Zie [docs/DEPLOY.md](docs/DEPLOY.md) voor volledige instructies.

```powershell
python scripts/deploy_remote.py
```

## Database

MariaDB op **192.168.1.14**, database `iasv_quiz`, user `admin`.

```env
DATABASE_URL=mysql://admin:kerkpoort@192.168.1.14:3306/iasv_quiz
```

## Scripts

| Script | Beschrijving |
|--------|--------------|
| `npm run dev` | Development server |
| `npm run build` | Productie build |
| `npm run start` | Productie start (PORT via PM2) |
| `npm run db:seed` | 50 vragen laden |
| `python scripts/deploy_remote.py` | Deploy naar .32 |
