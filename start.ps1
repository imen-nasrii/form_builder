# FormBuilder Pro - Script de démarrage Windows
Write-Host "Demarrage de FormBuilder Pro..." -ForegroundColor Green

# Configuration des variables d'environnement
$env:DATABASE_URL="postgresql://neondb_owner:npg_AqwN1UzQYI0O@ep-raspy-fire-a5rj10qu.us-east-2.aws.neon.tech/neondb?sslmode=require"
$env:NODE_ENV="development"
$env:PORT="5000" 
$env:ANTHROPIC_API_KEY="sk-ant-api03-DzZV1JMNGy9Zl2pY_5SLjqMvXD9QqUuLVJkTHT8WRGiMgPcJbkOY-Zp_7X3sR6N4uKwVfGjLpAqCxE2tB9M8oIvH_aU5nYrT"
$env:SESSION_SECRET="your-super-secret-session-key"

Write-Host "Variables d'environnement configurees" -ForegroundColor Yellow
Write-Host "Demarrage du serveur sur port 5000..." -ForegroundColor Yellow

# Démarrage de l'application
npx tsx server/index.ts