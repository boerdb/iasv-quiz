#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/iasv-quiz"
REPO="git@github.com:boerdb/iasv-quiz.git"
BRANCH="main"
DB_HOST="192.168.1.14"

echo "==> PM2 apps (huidige poorten):"
pm2 jlist 2>/dev/null | grep -oE '"PORT":"[0-9]+"' || pm2 list
echo ""
echo "==> Luisterende poorten 3000-3020:"
ss -tlnH | awk '{print $4}' | grep -oE '[0-9]+$' | sort -n | uniq | grep -E '^30(1[0-9]|20)$' || true

if [[ ! -d "$APP_DIR/.git" ]]; then
  echo "==> Clone naar $APP_DIR"
  git clone --branch "$BRANCH" "$REPO" "$APP_DIR"
fi

cd "$APP_DIR"
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

if [[ ! -f "$APP_DIR/.env.local" ]]; then
  echo "==> Maak .env.local (pas wachtwoord aan indien nodig)"
  cat > "$APP_DIR/.env.local" << EOF
DATABASE_URL=mysql://admin:kerkpoort@${DB_HOST}:3306/iasv_quiz
NEXT_PUBLIC_APP_NAME=iASV Beademing Quiz
NODE_ENV=production
EOF
fi

npm ci
npx prisma migrate deploy
QUESTION_COUNT=$(mysql -h "$DB_HOST" -u admin -pkerkpoort iasv_quiz -N -e "SELECT COUNT(*) FROM questions" 2>/dev/null || echo 0)
if [[ "${QUESTION_COUNT:-0}" -lt 100 ]]; then
  echo "==> Seed vragen ($QUESTION_COUNT in DB)"
  npm run db:seed
else
  echo "==> Vragenbank OK ($QUESTION_COUNT vragen), seed overgeslagen"
fi
npm run build

if ss -tlnH | grep -q ':3012 '; then
  echo "Waarschuwing: poort 3012 is al bezet. Pas PORT in ecosystem.config.cjs aan."
fi

pm2 startOrReload ecosystem.config.cjs
pm2 save

echo ""
echo "Klaar. Test: curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3012/"
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:3012/ || true
pm2 show iasv-quiz | grep -E 'status|PORT|url' || pm2 show iasv-quiz
