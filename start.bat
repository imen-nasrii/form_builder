@echo off
set "DATABASE_URL=postgresql://neondb_owner:npg_AqwN1UzQYI0O@ep-raspy-fire-a5rj10qu.us-east-2.aws.neon.tech/neondb?sslmode=require"
set "NODE_ENV=development"
set "PORT=5000"
set "ANTHROPIC_API_KEY=sk-ant-api03-DzZV1JMNGy9Zl2pY_5SLjqMvXD9QqUuLVJkTHT8WRGiMgPcJbkOY-Zp_7X3sR6N4uKwVfGjLpAqCxE2tB9M8oIvH_aU5nYrT"
set "SESSION_SECRET=your-super-secret-session-key"
npx tsx server/index.ts