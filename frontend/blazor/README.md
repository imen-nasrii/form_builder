# FormBuilder Pro - Blazor Frontend

## Configuration

### Démarrage
```bash
cd frontend/blazor
dotnet watch run --urls="https://localhost:7000"
```

### Variables d'environnement
```bash
DATABASE_URL=postgresql://neondb_owner:password@host.neon.tech/db?sslmode=require
```

### Migration Database
```bash
dotnet ef database update
```

## Accès
- Application: https://localhost:7000
- Interface alternative au frontend React