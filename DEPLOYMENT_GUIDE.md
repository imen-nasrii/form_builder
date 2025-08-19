# FormBuilder Pro - Deployment Guide

Complete deployment guide for production environments with both React/Express.js and .NET Blazor architectures.

## Table of Contents

1. [Pre-deployment Checklist](#pre-deployment-checklist)
2. [Environment Preparation](#environment-preparation)
3. [Database Deployment](#database-deployment)
4. [Application Deployment](#application-deployment)
5. [Cloud Platform Deployments](#cloud-platform-deployments)
6. [Docker Deployment](#docker-deployment)
7. [CI/CD Pipeline Setup](#cicd-pipeline-setup)
8. [Post-deployment Verification](#post-deployment-verification)
9. [Monitoring & Maintenance](#monitoring--maintenance)

## Pre-deployment Checklist

### Security Review
- [ ] All environment variables configured
- [ ] API keys secured and rotated
- [ ] Database credentials encrypted
- [ ] HTTPS certificates obtained
- [ ] CORS settings configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention verified

### Performance Review
- [ ] Database indexes optimized
- [ ] Static assets minified
- [ ] CDN configured for static content
- [ ] Caching strategies implemented
- [ ] Bundle size optimized
- [ ] Database connection pooling enabled

### Functionality Review
- [ ] All features tested in staging
- [ ] Database migrations tested
- [ ] Email notifications working
- [ ] AI integration functional
- [ ] File uploads working
- [ ] Authentication flow verified

## Environment Preparation

### Production Environment Variables

#### React/Express.js
```env
# Production Environment
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://username:password@host:5432/formbuilder_pro

# API Keys
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
OPENAI_API_KEY=sk-xxxxx

# Security
SESSION_SECRET=your-super-secure-session-secret-256-chars-long
CORS_ORIGIN=https://yourdomain.com

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASS=your-app-password
EMAIL_FROM=FormBuilder Pro <noreply@yourdomain.com>

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

#### .NET Blazor
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=your-host;Database=formbuilder_pro;Username=username;Password=password;SSL Mode=Require"
  },
  "ApiKeys": {
    "AnthropicApiKey": "sk-ant-api03-xxxxx",
    "OpenAiApiKey": "sk-xxxxx"
  },
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "EnableSsl": true,
    "SenderEmail": "noreply@yourdomain.com",
    "SenderPassword": "your-app-password",
    "SenderName": "FormBuilder Pro"
  },
  "SecuritySettings": {
    "JwtSecret": "your-jwt-secret-key-here",
    "AllowedOrigins": ["https://yourdomain.com"]
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  }
}
```

### SSL/TLS Configuration

#### Let's Encrypt Certificate (Linux)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Manual Certificate Setup
```bash
# Generate private key
openssl genrsa -out private.key 2048

# Generate certificate signing request
openssl req -new -key private.key -out certificate.csr

# Install certificate files
sudo cp certificate.crt /etc/ssl/certs/
sudo cp private.key /etc/ssl/private/
```

## Database Deployment

### Production PostgreSQL Setup

#### Installation (Ubuntu/Debian)
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Secure installation
sudo -u postgres psql
ALTER USER postgres PASSWORD 'secure-password';
\q

# Configure PostgreSQL
sudo nano /etc/postgresql/14/main/postgresql.conf
# Set: listen_addresses = '*'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Add: host all all 0.0.0.0/0 md5

sudo systemctl restart postgresql
```

#### Database Creation
```sql
-- Connect as postgres user
sudo -u postgres psql

-- Create production database
CREATE DATABASE formbuilder_pro_prod;

-- Create application user
CREATE USER formbuilder_app WITH ENCRYPTED PASSWORD 'secure-app-password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE formbuilder_pro_prod TO formbuilder_app;
ALTER USER formbuilder_app CREATEDB;

-- Exit
\q
```

#### Database Migration

##### React/Express.js
```bash
# Set production database URL
export DATABASE_URL="postgresql://formbuilder_app:password@host:5432/formbuilder_pro_prod"

# Run migrations
npm run db:migrate

# Verify migration
npm run db:verify
```

##### .NET Blazor
```bash
# Set connection string
export ConnectionStrings__DefaultConnection="Host=host;Database=formbuilder_pro_prod;Username=formbuilder_app;Password=password"

# Apply migrations
dotnet ef database update --configuration Release

# Verify migration
dotnet ef migrations list
```

### Database Backup Strategy

#### Automated Backup Script
```bash
#!/bin/bash
# backup-db.sh

DB_NAME="formbuilder_pro_prod"
DB_USER="formbuilder_app"
DB_HOST="localhost"
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_DIR/formbuilder_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/formbuilder_backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "formbuilder_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: formbuilder_backup_$DATE.sql.gz"
```

#### Cron Job Setup
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup-db.sh
```

## Application Deployment

### React/Express.js Deployment

#### Build for Production
```bash
# Install dependencies
npm ci --production

# Build application
npm run build

# Verify build
ls -la dist/
```

#### PM2 Process Manager
```bash
# Install PM2 globally
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'formbuilder-pro',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
```

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/formbuilder-pro
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/ssl/certs/certificate.crt;
    ssl_certificate_key /etc/ssl/private/private.key;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Static files
    location /static/ {
        alias /var/www/formbuilder-pro/dist/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API routes
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Main application
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### .NET Blazor Deployment

#### Build for Production
```bash
# Publish application
dotnet publish -c Release -o ./publish

# Verify publish
ls -la publish/
```

#### Systemd Service
```ini
# /etc/systemd/system/formbuilder-pro.service
[Unit]
Description=FormBuilder Pro .NET Application
After=network.target

[Service]
Type=notify
ExecStart=/usr/bin/dotnet /var/www/formbuilder-pro/publish/FormBuilderPro.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=formbuilder-pro
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://localhost:5000
WorkingDirectory=/var/www/formbuilder-pro/publish

[Install]
WantedBy=multi-user.target
```

#### Enable Service
```bash
# Enable and start service
sudo systemctl enable formbuilder-pro.service
sudo systemctl start formbuilder-pro.service

# Check status
sudo systemctl status formbuilder-pro.service

# View logs
sudo journalctl -u formbuilder-pro.service -f
```

## Cloud Platform Deployments

### Replit Deployment

#### Setup Steps
1. Connect GitHub repository to Replit
2. Configure environment variables in Secrets
3. Ensure `.replit` file is configured
4. Use "Deploy" button in Replit interface

#### .replit Configuration
```toml
modules = ["nodejs-20", "postgresql"]

[deployment]
run = ["npm", "run", "start"]
deploymentTarget = "cloudrun"

[[ports]]
localPort = 5000
externalPort = 80
```

### Heroku Deployment

#### Setup Steps
```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login to Heroku
heroku login

# Create application
heroku create formbuilder-pro

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set ANTHROPIC_API_KEY=your-key

# Deploy
git push heroku main
```

#### Procfile
```
web: npm start
worker: npm run worker
release: npm run db:migrate
```

### DigitalOcean App Platform

#### app.yaml Configuration
```yaml
name: formbuilder-pro
services:
- name: web
  source_dir: /
  github:
    repo: imen-nasrii/formbuilder-pro
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  env_vars:
  - key: NODE_ENV
    value: production
  - key: ANTHROPIC_API_KEY
    value: your-key
    type: SECRET
databases:
- name: formbuilder-db
  engine: PG
  size: basic
```

### AWS Deployment

#### EC2 + RDS Setup
```bash
# EC2 User Data Script
#!/bin/bash
yum update -y
curl -sL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs git

# Clone and setup application
cd /home/ec2-user
git clone https://github.com/imen-nasrii/formbuilder-pro.git
cd formbuilder-pro
npm install
npm run build

# Install PM2
npm install -g pm2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

#### RDS Configuration
```sql
-- RDS Parameter Group Settings
shared_preload_libraries = 'pg_stat_statements'
log_statement = 'all'
log_min_duration_statement = 1000
```

## Docker Deployment

### Dockerfile for React/Express.js
```dockerfile
# Multi-stage build
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=build --chown=nextjs:nodejs /app .

USER nextjs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

CMD ["npm", "start"]
```

### Dockerfile for .NET Blazor
```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY *.csproj .
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Create non-root user
RUN useradd -m -u 1001 appuser

COPY --from=build --chown=appuser:appuser /app/publish .

USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

ENTRYPOINT ["dotnet", "FormBuilderPro.dll"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://formbuilder:password@db:5432/formbuilder_pro
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    depends_on:
      - db
    restart: unless-stopped
    networks:
      - app-network

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=formbuilder_pro
      - POSTGRES_USER=formbuilder
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

## CI/CD Pipeline Setup

### GitHub Actions

#### .github/workflows/deploy.yml
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: dist/
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/formbuilder-pro
          git pull origin main
          npm ci --production
          npm run build
          pm2 restart formbuilder-pro
```

### GitLab CI/CD

#### .gitlab-ci.yml
```yaml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

test:
  stage: test
  image: node:$NODE_VERSION
  cache:
    paths:
      - node_modules/
  script:
    - npm ci
    - npm test
    - npm run lint

build:
  stage: build
  image: node:$NODE_VERSION
  cache:
    paths:
      - node_modules/
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "
        cd /var/www/formbuilder-pro &&
        git pull origin main &&
        npm ci --production &&
        npm run build &&
        pm2 restart formbuilder-pro"
  only:
    - main
```

## Post-deployment Verification

### Health Check Endpoints

#### Express.js Health Check
```javascript
// server/routes/health.js
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    const dbCheck = await db.query('SELECT 1');
    
    // Check external APIs
    const aiCheck = await checkAnthropicAPI();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbCheck ? 'ok' : 'error',
        ai_service: aiCheck ? 'ok' : 'error'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

#### .NET Health Check
```csharp
// Program.cs
builder.Services.AddHealthChecks()
    .AddNpgSql(connectionString)
    .AddCheck<AnthropicHealthCheck>("anthropic");

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
```

### Verification Checklist
- [ ] Application starts successfully
- [ ] Database connection established
- [ ] SSL certificate valid
- [ ] All API endpoints responding
- [ ] Authentication working
- [ ] Email notifications sent
- [ ] AI integration functional
- [ ] File uploads working
- [ ] Performance metrics normal

### Load Testing
```bash
# Install Artillery
npm install -g artillery

# Create load test
cat > load-test.yml << EOF
config:
  target: 'https://yourdomain.com'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Load test"
    requests:
      - get:
          url: "/"
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password"
EOF

# Run load test
artillery run load-test.yml
```

## Monitoring & Maintenance

### Log Management

#### Centralized Logging
```bash
# Install and configure rsyslog
sudo apt install rsyslog

# Configure log rotation
sudo nano /etc/logrotate.d/formbuilder-pro
```

```
/var/log/formbuilder-pro/*.log {
    daily
    missingok
    rotate 30
    compress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload formbuilder-pro
    endscript
}
```

### Monitoring Setup

#### System Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Setup system alerts
sudo nano /etc/cron.d/system-monitor
# 0 * * * * root /usr/local/bin/check-system-health.sh
```

#### Application Monitoring
```javascript
// Integrate with monitoring service
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

// Performance monitoring
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
```

### Backup Verification
```bash
#!/bin/bash
# verify-backup.sh

BACKUP_FILE="/var/backups/postgresql/latest.sql.gz"
TEST_DB="formbuilder_test_restore"

# Create test database
sudo -u postgres createdb $TEST_DB

# Restore backup
gunzip -c $BACKUP_FILE | sudo -u postgres psql $TEST_DB

# Verify restoration
TABLES=$(sudo -u postgres psql -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';" $TEST_DB)

if [ $TABLES -gt 0 ]; then
    echo "Backup verification successful: $TABLES tables restored"
else
    echo "Backup verification failed: No tables found"
    exit 1
fi

# Cleanup
sudo -u postgres dropdb $TEST_DB
```

### Security Maintenance

#### Regular Security Updates
```bash
#!/bin/bash
# security-updates.sh

# Update system packages
sudo apt update
sudo apt upgrade -y

# Update Node.js packages
npm audit fix

# Update .NET packages
dotnet list package --outdated
dotnet update
```

#### SSL Certificate Renewal
```bash
# Automated SSL renewal check
0 2 * * 1 /usr/bin/certbot renew --quiet && systemctl reload nginx
```

---

**Deployment Guide Version**: 2.0.0  
**Last Updated**: August 2025  
**Maintainers**: FormBuilder Pro DevOps Team