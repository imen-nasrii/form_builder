# FormBuilder Pro - Troubleshooting Guide

Comprehensive troubleshooting guide for common issues in both React/Express.js and .NET Blazor implementations.

## Table of Contents

1. [Quick Diagnostic Tools](#quick-diagnostic-tools)
2. [Common Installation Issues](#common-installation-issues)
3. [Database Connection Issues](#database-connection-issues)
4. [Application Startup Issues](#application-startup-issues)
5. [API and Backend Issues](#api-and-backend-issues)
6. [Frontend Issues](#frontend-issues)
7. [Authentication Issues](#authentication-issues)
8. [Performance Issues](#performance-issues)
9. [Production Issues](#production-issues)
10. [Emergency Recovery](#emergency-recovery)

## Quick Diagnostic Tools

### System Health Check Script
```bash
#!/bin/bash
# health-check.sh

echo "=== FormBuilder Pro Health Check ==="
echo "Date: $(date)"
echo ""

# Check system resources
echo "📊 System Resources:"
echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')%"
echo "Memory: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
echo "Disk: $(df -h / | awk 'NR==2 {print $5 " used"}')"
echo ""

# Check services
echo "🔧 Services Status:"
if command -v systemctl &> /dev/null; then
    echo "PostgreSQL: $(systemctl is-active postgresql)"
    echo "Nginx: $(systemctl is-active nginx)"
fi

# Check Node.js/npm
if command -v node &> /dev/null; then
    echo "Node.js: $(node --version)"
    echo "npm: $(npm --version)"
fi

# Check .NET
if command -v dotnet &> /dev/null; then
    echo ".NET: $(dotnet --version)"
fi

# Check database connection
echo ""
echo "🗄️  Database Connection:"
if pg_isready -h localhost -p 5432; then
    echo "PostgreSQL: ✅ Connected"
else
    echo "PostgreSQL: ❌ Connection failed"
fi

# Check application endpoints
echo ""
echo "🌐 Application Endpoints:"
for port in 5000 7000; do
    if curl -s http://localhost:$port/health > /dev/null 2>&1; then
        echo "Port $port: ✅ Responding"
    else
        echo "Port $port: ❌ Not responding"
    fi
done

echo ""
echo "=== Health Check Complete ==="
```

### Log Analysis Tool
```bash
#!/bin/bash
# analyze-logs.sh

LOG_DIR="/var/log/formbuilder-pro"
LINES=50

echo "=== Recent Error Logs ==="

# Application logs
if [ -f "$LOG_DIR/error.log" ]; then
    echo "Application Errors (last $LINES lines):"
    tail -n $LINES "$LOG_DIR/error.log"
fi

# System logs
echo "System Logs (formbuilder related):"
journalctl -u formbuilder-pro --lines=$LINES --no-pager

# Database logs
echo "PostgreSQL Logs:"
sudo tail -n $LINES /var/log/postgresql/postgresql-*.log
```

## Common Installation Issues

### Node.js Installation Issues

#### Issue: "node: command not found"
```bash
# Check if Node.js is installed
which node

# If not found, install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### Issue: npm permission errors
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use n to manage Node.js versions
sudo npm install -g n
sudo n stable
```

#### Issue: "npm ERR! peer dep missing"
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Install peer dependencies manually
npm install [missing-peer-dep]
```

### .NET Installation Issues

#### Issue: ".NET SDK not found"
```bash
# Install .NET 8.0 SDK (Ubuntu/Debian)
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get update
sudo apt-get install -y dotnet-sdk-8.0

# Verify installation
dotnet --version
```

#### Issue: "MSBuild version not supported"
```bash
# Clear NuGet cache
dotnet nuget locals all --clear

# Restore packages
dotnet restore --force

# Rebuild solution
dotnet build --configuration Release
```

### Package Installation Issues

#### Issue: Python dependencies for AI features
```bash
# Install Python and pip
sudo apt install python3 python3-pip

# Install required packages
pip3 install anthropic openai streamlit pandas

# Verify installation
python3 -c "import anthropic; print('Anthropic installed')"
```

## Database Connection Issues

### PostgreSQL Connection Problems

#### Issue: "Connection refused"
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL if stopped
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check listening ports
sudo netstat -tlnp | grep postgres
```

#### Issue: "Authentication failed"
```bash
# Reset PostgreSQL password
sudo -u postgres psql
ALTER USER postgres PASSWORD 'newpassword';
\q

# Update connection string
export DATABASE_URL="postgresql://postgres:newpassword@localhost:5432/formbuilder_pro"
```

#### Issue: "Database does not exist"
```sql
-- Connect as postgres user
sudo -u postgres psql

-- List existing databases
\l

-- Create database if missing
CREATE DATABASE formbuilder_pro;

-- Create user if missing
CREATE USER formbuilder_user WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE formbuilder_pro TO formbuilder_user;

\q
```

#### Issue: "Too many connections"
```bash
# Check current connections
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"

# Edit PostgreSQL configuration
sudo nano /etc/postgresql/14/main/postgresql.conf
# Increase: max_connections = 200

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Migration Issues

#### Issue: Migration fails
```bash
# React/Express.js - Reset migrations
rm -rf drizzle/migrations/*
npm run db:generate
npm run db:migrate

# .NET Blazor - Reset migrations
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
dotnet ef database update
```

#### Issue: Schema mismatch
```sql
-- Check current schema
\d+ forms
\d+ users

-- Drop and recreate problematic tables
DROP TABLE IF EXISTS forms CASCADE;
-- Then run migrations again
```

## Application Startup Issues

### React/Express.js Startup Issues

#### Issue: "Port already in use"
```bash
# Find process using port 5000
sudo netstat -tlnp | grep 5000
# or
sudo lsof -i :5000

# Kill the process
sudo kill -9 [PID]

# Start application
npm run dev
```

#### Issue: "Module not found"
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for missing dependencies
npm ls --depth=0

# Install missing dependencies
npm install [missing-module]
```

#### Issue: Environment variables not loaded
```bash
# Verify .env file exists and has correct permissions
ls -la .env
chmod 600 .env

# Check if variables are loaded
node -e "console.log(process.env.DATABASE_URL)"

# Source environment manually
export $(cat .env | xargs)
```

### .NET Blazor Startup Issues

#### Issue: "Unable to start ASP.NET Core"
```bash
# Check for conflicting processes
sudo netstat -tlnp | grep 5000
sudo netstat -tlnp | grep 7000

# Clear temporary files
rm -rf bin/ obj/
dotnet clean
dotnet restore
dotnet build
```

#### Issue: "Configuration error"
```bash
# Validate appsettings.json
cat appsettings.Development.json | jq .

# Check environment variables
printenv | grep ConnectionStrings
printenv | grep ApiKeys

# Verify configuration loading
dotnet run --verbosity diagnostic
```

## API and Backend Issues

### Express.js API Issues

#### Issue: "Cannot GET /api/[endpoint]"
```bash
# Check route definitions
grep -r "router.get" server/routes/

# Verify middleware order
# Ensure auth middleware comes before protected routes

# Check request logs
tail -f logs/access.log
```

#### Issue: CORS errors
```javascript
// server/index.js
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Verify in browser console
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

#### Issue: Session/Authentication problems
```javascript
// Check session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
```

### .NET API Issues

#### Issue: "HTTP 500 Internal Server Error"
```bash
# Enable detailed errors
export ASPNETCORE_ENVIRONMENT=Development

# Check application logs
dotnet run --verbosity diagnostic

# View detailed exception information
tail -f /var/log/formbuilder-pro/error.log
```

#### Issue: SignalR connection fails
```csharp
// Check hub configuration in Program.cs
app.MapHub<FormHub>("/formhub");

// Client-side debugging
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/formhub")
    .configureLogging(signalR.LogLevel.Debug)
    .build();
```

## Frontend Issues

### React Frontend Issues

#### Issue: "White screen of death"
```bash
# Check browser console for errors
# Open DevTools > Console

# Check for build errors
npm run build 2>&1 | tee build.log

# Verify all imports are correct
grep -r "import.*from" src/ | grep -v node_modules
```

#### Issue: Components not rendering
```javascript
// Check React DevTools
// Install: React Developer Tools browser extension

// Verify component props
console.log('Component props:', props);

// Check for key warnings
// Each list item should have unique key prop
```

#### Issue: Styling issues
```bash
# Verify Tailwind CSS compilation
npm run build:css

# Check for conflicting CSS
grep -r "!important" src/styles/

# Verify CSS imports order
# Global styles should come before component styles
```

### Blazor Frontend Issues

#### Issue: "Blazor failed to start"
```html
<!-- Check browser console for detailed errors -->
<!-- Verify _framework files are loaded correctly -->

<!-- Check SignalR connection -->
<script>
console.log('Blazor starting...');
Blazor.start({
  configureSignalR: function (builder) {
    builder.configureLogging("information");
  }
});
</script>
```

#### Issue: Component state not updating
```csharp
// Ensure StateHasChanged() is called
private async Task UpdateComponent()
{
    // Update state
    componentData = await GetNewData();
    
    // Trigger re-render
    StateHasChanged();
}

// For async operations
protected override async Task OnInitializedAsync()
{
    await LoadDataAsync();
    StateHasChanged();
}
```

## Authentication Issues

### Session Management Issues

#### Issue: User gets logged out frequently
```javascript
// Increase session timeout
app.use(session({
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  rolling: true // Reset expiry on activity
}));
```

#### Issue: Authentication state inconsistent
```javascript
// Clear authentication state
localStorage.clear();
sessionStorage.clear();

// For Blazor, check cookie persistence
document.cookie.split(';').forEach(cookie => {
  if (cookie.includes('auth')) {
    console.log('Auth cookie:', cookie);
  }
});
```

### Password Issues

#### Issue: Password reset not working
```bash
# Check email service configuration
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
transporter.verify(console.log);
"
```

#### Issue: Password hashing errors
```javascript
// Verify bcrypt installation
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('testpassword', 10);
const isValid = bcrypt.compareSync('testpassword', hash);
console.log('Bcrypt working:', isValid);
```

## Performance Issues

### Slow Database Queries

#### Issue: Form loading is slow
```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Add indexes for common queries
CREATE INDEX idx_forms_user_id ON forms(user_id);
CREATE INDEX idx_forms_created_at ON forms(created_at);
```

#### Issue: High memory usage
```bash
# Check memory usage
free -h
ps aux --sort=-%mem | head -10

# Check Node.js memory usage
node --inspect=0.0.0.0:9229 server/index.js
# Then open chrome://inspect in Chrome
```

### Frontend Performance Issues

#### Issue: Large bundle size
```bash
# Analyze bundle size
npm run build
npx webpack-bundle-analyzer dist/

# Enable code splitting
# Use dynamic imports for large components
const LazyComponent = lazy(() => import('./LazyComponent'));
```

#### Issue: Slow form rendering
```javascript
// Use React.memo for expensive components
const FormComponent = React.memo(({ formData }) => {
  // Component logic
});

// Optimize re-renders
const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

## Production Issues

### SSL Certificate Issues

#### Issue: "Certificate has expired"
```bash
# Check certificate expiry
openssl x509 -in /etc/ssl/certs/certificate.crt -text -noout | grep "Not After"

# Renew Let's Encrypt certificate
sudo certbot renew

# Restart web server
sudo systemctl restart nginx
```

#### Issue: "Mixed content" warnings
```nginx
# Force HTTPS redirects
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# Update CSP headers
add_header Content-Security-Policy "upgrade-insecure-requests;";
```

### Load Balancer Issues

#### Issue: Health check failures
```bash
# Test health endpoint
curl -f http://localhost:5000/health

# Check health check implementation
# Ensure it tests database connectivity
```

#### Issue: Session persistence with multiple instances
```javascript
// Use Redis for session storage
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const client = redis.createClient();

app.use(session({
  store: new RedisStore({ client: client }),
  // ... other options
}));
```

## Emergency Recovery

### Database Recovery

#### Issue: Database corruption
```bash
# Stop application
sudo systemctl stop formbuilder-pro

# Check database integrity
sudo -u postgres pg_dump formbuilder_pro > /dev/null

# Restore from backup
sudo -u postgres dropdb formbuilder_pro
sudo -u postgres createdb formbuilder_pro
gunzip -c /var/backups/postgresql/latest.sql.gz | sudo -u postgres psql formbuilder_pro
```

#### Issue: Complete data loss
```bash
# Restore from most recent backup
LATEST_BACKUP=$(ls -t /var/backups/postgresql/*.sql.gz | head -1)
echo "Restoring from: $LATEST_BACKUP"

# Create new database
sudo -u postgres createdb formbuilder_pro_recovery

# Restore backup
gunzip -c "$LATEST_BACKUP" | sudo -u postgres psql formbuilder_pro_recovery

# Verify restoration
sudo -u postgres psql formbuilder_pro_recovery -c "SELECT count(*) FROM forms;"
```

### Application Recovery

#### Issue: Application completely unresponsive
```bash
# Force restart all services
sudo systemctl daemon-reload
sudo systemctl restart postgresql
sudo systemctl restart nginx
sudo systemctl restart formbuilder-pro

# Check system resources
top -p $(pgrep -d',' -f formbuilder)
```

#### Issue: File system full
```bash
# Check disk usage
df -h

# Clean up logs
sudo truncate -s 0 /var/log/formbuilder-pro/*.log
sudo logrotate -f /etc/logrotate.d/formbuilder-pro

# Clean up temporary files
sudo find /tmp -name "*formbuilder*" -delete
sudo find /var/tmp -name "*formbuilder*" -delete
```

### Emergency Contacts

```bash
# Create emergency contact script
cat > /usr/local/bin/emergency-contact.sh << 'EOF'
#!/bin/bash
ADMIN_EMAIL="admin@yourdomain.com"
SUBJECT="EMERGENCY: FormBuilder Pro Service Down"
BODY="FormBuilder Pro service is experiencing critical issues. Immediate attention required."

echo "$BODY" | mail -s "$SUBJECT" "$ADMIN_EMAIL"
echo "Emergency notification sent to $ADMIN_EMAIL"
EOF

chmod +x /usr/local/bin/emergency-contact.sh
```

### Recovery Verification Checklist

After any recovery procedure:

- [ ] Database accessible and contains expected data
- [ ] Application starts without errors
- [ ] All API endpoints responding
- [ ] Authentication working
- [ ] File uploads functional
- [ ] Email notifications working
- [ ] AI integration operational
- [ ] SSL certificates valid
- [ ] Monitoring systems active
- [ ] Backups resuming normally

---

**Troubleshooting Guide Version**: 2.0.0  
**Last Updated**: August 2025  
**Emergency Contact**: FormBuilder Pro Support Team