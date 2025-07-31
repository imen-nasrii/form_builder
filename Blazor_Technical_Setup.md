# FormBuilder Pro - Setup Technique Blazor

## Configuration Complète de l'Environnement

### 1. Prérequis Système

**Q: Quels sont les prérequis pour développer avec cette stack ?**

**R:** Configuration système requise :
```bash
# .NET Core 8 SDK
dotnet --version  # Doit être >= 8.0.0

# Python 3.11+
python --version  # Recommandé 3.11 ou plus récent

# Node.js 18+ pour Vite.js
node --version    # Pour la gestion des assets

# PostgreSQL 15+
psql --version    # Base de données principale

# Git pour versioning
git --version
```

### 2. Structure de Projet Complète

**Q: Comment organiser la structure de projet ?**

**R:** Architecture de fichiers recommandée :
```
FormBuilderPro/
├── src/
│   ├── FormBuilder.Blazor/              # Application Blazor Server
│   │   ├── Components/
│   │   │   ├── FormBuilder/
│   │   │   │   ├── FormBuilderMain.razor
│   │   │   │   ├── ComponentPalette.razor
│   │   │   │   ├── PropertiesPanel.razor
│   │   │   │   └── ConstructionZone.razor
│   │   │   ├── MfactComponents/
│   │   │   │   ├── GridLookup.razor
│   │   │   │   ├── ListLookup.razor
│   │   │   │   ├── SelectField.razor
│   │   │   │   └── DatePicker.razor
│   │   │   ├── Layout/
│   │   │   │   ├── MainLayout.razor
│   │   │   │   ├── NavMenu.razor
│   │   │   │   └── LoginDisplay.razor
│   │   │   └── Shared/
│   │   │       ├── LoadingSpinner.razor
│   │   │       └── ErrorBoundary.razor
│   │   ├── Pages/
│   │   │   ├── Index.razor
│   │   │   ├── FormBuilder.razor
│   │   │   ├── Dashboard.razor
│   │   │   ├── UserManagement.razor
│   │   │   └── Analytics.razor
│   │   ├── Services/
│   │   │   ├── FormBuilderService.cs
│   │   │   ├── MfactModelService.cs
│   │   │   ├── NotificationService.cs
│   │   │   └── AuthenticationService.cs
│   │   ├── Data/
│   │   │   ├── ApplicationDbContext.cs
│   │   │   └── Migrations/
│   │   ├── Models/
│   │   │   ├── FormModels.cs
│   │   │   ├── UserModels.cs
│   │   │   └── ComponentModels.cs
│   │   ├── wwwroot/
│   │   │   ├── css/
│   │   │   ├── js/
│   │   │   ├── images/
│   │   │   └── dist/           # Assets Vite.js
│   │   ├── appsettings.json
│   │   ├── appsettings.Development.json
│   │   └── Program.cs
│   │
│   ├── FormBuilder.Api/                 # API .NET Core (optionnel)
│   │   ├── Controllers/
│   │   │   ├── FormsController.cs
│   │   │   ├── UsersController.cs
│   │   │   └── MfactController.cs
│   │   ├── Services/
│   │   ├── Models/
│   │   └── Program.cs
│   │
│   ├── FormBuilder.Shared/              # Modèles partagés
│   │   ├── Models/
│   │   │   ├── FormDto.cs
│   │   │   ├── UserDto.cs
│   │   │   └── ComponentDto.cs
│   │   ├── Enums/
│   │   │   ├── ComponentType.cs
│   │   │   ├── FormLayout.cs
│   │   │   └── UserRole.cs
│   │   └── Constants/
│   │       └── MfactConstants.cs
│   │
│   └── MfactModels/                     # 178 modèles C# MFact
│       ├── Accounting/
│       │   ├── ACCADJ.cs
│       │   ├── ACTYPE.cs
│       │   └── GL.cs
│       ├── Finance/
│       │   ├── BUYTYP.cs
│       │   ├── PRIMNT.cs
│       │   └── SECRTY.cs
│       ├── General/
│       │   ├── USERS.cs
│       │   ├── CODES.cs
│       │   └── CURNCY.cs
│       └── ModelCategories.cs
│
├── ai/                                  # Assistant IA Python
│   ├── formbuilder_venv/               # Environment virtuel
│   ├── src/
│   │   ├── streamlit_app.py            # Interface principale
│   │   ├── services/
│   │   │   ├── ai_service.py
│   │   │   ├── dfm_parser.py
│   │   │   └── form_generator.py
│   │   ├── models/
│   │   │   └── mfact_templates.py
│   │   └── utils/
│   │       ├── file_handlers.py
│   │       └── json_validators.py
│   ├── requirements.txt
│   ├── .env
│   └── config.py
│
├── frontend-assets/                     # Assets Vite.js
│   ├── src/
│   │   ├── styles/
│   │   │   ├── main.css
│   │   │   ├── components.css
│   │   │   └── mudblazor-custom.css
│   │   ├── js/
│   │   │   ├── formbuilder.js
│   │   │   └── drag-drop.js
│   │   └── images/
│   │       └── logo.svg
│   ├── vite.config.js
│   ├── package.json
│   └── package-lock.json
│
├── database/
│   ├── migrations/
│   ├── seed-data/
│   └── scripts/
│       ├── setup.sql
│       └── cleanup.sql
│
├── docs/
│   ├── API.md
│   ├── Deployment.md
│   └── Architecture.md
│
├── tests/
│   ├── FormBuilder.Tests/
│   ├── Integration.Tests/
│   └── Performance.Tests/
│
├── docker/
│   ├── Dockerfile.blazor
│   ├── Dockerfile.api
│   ├── Dockerfile.ai
│   └── docker-compose.yml
│
├── scripts/
│   ├── start-dev.sh
│   ├── setup-env.sh
│   ├── deploy.sh
│   └── backup-db.sh
│
├── FormBuilderPro.sln
├── .gitignore
├── README.md
└── LICENSE
```

### 3. Configuration Blazor Server Détaillée

**Q: Comment configurer Program.cs pour Blazor Server ?**

**R:** Configuration complète :
```csharp
// Program.cs - FormBuilder.Blazor
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MudBlazor.Services;
using FormBuilder.Blazor.Data;
using FormBuilder.Blazor.Services;
using FormBuilder.Shared.Models;

var builder = WebApplication.CreateBuilder(args);

// Configuration de la base de données
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Configuration Identity
builder.Services.AddDefaultIdentity<ApplicationUser>(options => 
{
    options.SignIn.RequireConfirmedAccount = false;
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = false;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<ApplicationDbContext>();

// Services Blazor
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor(options =>
{
    options.DetailedErrors = builder.Environment.IsDevelopment();
    options.DisableWebSocketsOriginValidation = true;
});

// MudBlazor
builder.Services.AddMudServices(config =>
{
    config.SnackbarConfiguration.PositionClass = Defaults.Classes.Position.BottomLeft;
    config.SnackbarConfiguration.PreventDuplicates = false;
    config.SnackbarConfiguration.NewestOnTop = false;
    config.SnackbarConfiguration.ShowCloseIcon = true;
    config.SnackbarConfiguration.VisibleStateDuration = 10000;
    config.SnackbarConfiguration.HideTransitionDuration = 500;
    config.SnackbarConfiguration.ShowTransitionDuration = 500;
    config.SnackbarConfiguration.SnackbarVariant = Variant.Filled;
});

// Services personnalisés
builder.Services.AddScoped<IFormBuilderService, FormBuilderService>();
builder.Services.AddScoped<IMfactModelService, MfactModelService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<FormBuilderState>();
builder.Services.AddSingleton<AppState>();

// Configuration HttpClient pour IA
builder.Services.AddHttpClient<AiAssistantService>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["AiService:BaseUrl"] ?? "http://localhost:8501");
    client.Timeout = TimeSpan.FromMinutes(5);
});

// Configuration SignalR pour notifications temps réel
builder.Services.AddSignalR();

// Configuration autorisation
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("FormBuilder", policy => policy.RequireRole("Admin", "User"));
    options.AddPolicy("ViewOnly", policy => policy.RequireRole("Admin", "User", "Viewer"));
});

var app = builder.Build();

// Configuration du pipeline
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapRazorPages();
app.MapBlazorHub();
app.MapHub<NotificationHub>("/notificationhub");
app.MapFallbackToPage("/_Host");

// Initialisation des données
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    
    await DbInitializer.InitializeAsync(context, userManager, roleManager);
}

app.Run();
```

### 4. Configuration Entity Framework avec PostgreSQL

**Q: Comment configurer le DbContext pour PostgreSQL ?**

**R:** Configuration complète du contexte :
```csharp
// Data/ApplicationDbContext.cs
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using FormBuilder.Shared.Models;
using System.Text.Json;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    // Tables principales
    public DbSet<FormModel> Forms { get; set; }
    public DbSet<FormField> FormFields { get; set; }
    public DbSet<FormTemplate> FormTemplates { get; set; }
    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<FormAssignment> FormAssignments { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuration FormModel
        modelBuilder.Entity<FormModel>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.MenuId).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Label).IsRequired().HasMaxLength(200);
            entity.Property(e => e.FormWidth).HasMaxLength(20).HasDefaultValue("700px");
            entity.Property(e => e.Layout).HasMaxLength(50).HasDefaultValue("PROCESS");
            
            // Stockage JSON des champs
            entity.Property(e => e.Fields)
                  .HasColumnType("jsonb")
                  .HasConversion(
                      v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                      v => JsonSerializer.Deserialize<List<FormFieldDto>>(v, (JsonSerializerOptions)null)
                  );

            // Configuration des propriétés personnalisées
            entity.Property(e => e.CustomProperties)
                  .HasColumnType("jsonb")
                  .HasConversion(
                      v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                      v => JsonSerializer.Deserialize<Dictionary<string, object>>(v, (JsonSerializerOptions)null)
                  );

            // Relations
            entity.HasOne(e => e.CreatedBy)
                  .WithMany(u => u.CreatedForms)
                  .HasForeignKey(e => e.CreatedById)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(e => e.Assignments)
                  .WithOne(a => a.Form)
                  .HasForeignKey(a => a.FormId);

            // Index pour performance
            entity.HasIndex(e => e.MenuId).IsUnique();
            entity.HasIndex(e => e.CreatedById);
            entity.HasIndex(e => new { e.CreatedAt, e.UpdatedAt });
        });

        // Configuration FormField
        modelBuilder.Entity<FormField>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Label).IsRequired().HasMaxLength(200);
            entity.Property(e => e.DataField).IsRequired().HasMaxLength(100);
            
            // Propriétés JSON pour flexibilité
            entity.Property(e => e.Properties)
                  .HasColumnType("jsonb")
                  .HasConversion(
                      v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                      v => JsonSerializer.Deserialize<Dictionary<string, object>>(v, (JsonSerializerOptions)null)
                  );

            // Validation des colonnes
            entity.Property(e => e.ValidationRules)
                  .HasColumnType("jsonb");

            // Relations
            entity.HasOne(e => e.Form)
                  .WithMany(f => f.FormFields)
                  .HasForeignKey(e => e.FormId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuration Notification
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Message).HasMaxLength(1000);
            entity.Property(e => e.Type).HasMaxLength(50).HasDefaultValue("Info");
            entity.Property(e => e.Priority).HasMaxLength(20).HasDefaultValue("Normal");
            
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Notifications)
                  .HasForeignKey(e => e.UserId);

            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => new { e.CreatedAt, e.IsRead });
        });

        // Configuration FormAssignment
        modelBuilder.Entity<FormAssignment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("Assigned");
            entity.Property(e => e.Priority).HasMaxLength(20).HasDefaultValue("Normal");
            
            entity.HasOne(e => e.Form)
                  .WithMany(f => f.Assignments)
                  .HasForeignKey(e => e.FormId);

            entity.HasOne(e => e.AssignedTo)
                  .WithMany(u => u.AssignedForms)
                  .HasForeignKey(e => e.AssignedToId);

            entity.HasOne(e => e.AssignedBy)
                  .WithMany()
                  .HasForeignKey(e => e.AssignedById);

            // Index composé pour éviter doublons
            entity.HasIndex(e => new { e.FormId, e.AssignedToId }).IsUnique();
        });

        // Configuration AuditLog
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Action).IsRequired().HasMaxLength(100);
            entity.Property(e => e.EntityType).IsRequired().HasMaxLength(100);
            entity.Property(e => e.EntityId).IsRequired().HasMaxLength(100);
            
            entity.Property(e => e.Changes)
                  .HasColumnType("jsonb");

            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId);

            entity.HasIndex(e => new { e.EntityType, e.EntityId });
            entity.HasIndex(e => e.CreatedAt);
        });

        // Seed data
        SeedInitialData(modelBuilder);
    }

    private void SeedInitialData(ModelBuilder modelBuilder)
    {
        // Rôles par défaut
        modelBuilder.Entity<IdentityRole>().HasData(
            new IdentityRole { Id = "1", Name = "Admin", NormalizedName = "ADMIN" },
            new IdentityRole { Id = "2", Name = "User", NormalizedName = "USER" },
            new IdentityRole { Id = "3", Name = "Viewer", NormalizedName = "VIEWER" }
        );

        // Templates de formulaires par défaut
        modelBuilder.Entity<FormTemplate>().HasData(
            new FormTemplate
            {
                Id = 1,
                Name = "BUYTYP Template",
                Description = "Template for Buy Type forms",
                Category = "Finance",
                JsonTemplate = JsonSerializer.Serialize(GetBuytypTemplate()),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new FormTemplate
            {
                Id = 2,
                Name = "ACCADJ Template", 
                Description = "Template for Account Adjustment forms",
                Category = "Accounting",
                JsonTemplate = JsonSerializer.Serialize(GetAccadjTemplate()),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        );
    }

    private static object GetBuytypTemplate()
    {
        return new
        {
            menuId = "BUYTYP_TEMPLATE",
            label = "Buy Type Form",
            formWidth = "600px",
            layout = "PROCESS",
            fields = new[]
            {
                new { Type = "TEXT", Label = "Code", DataField = "Code", Required = true },
                new { Type = "TEXT", Label = "Description", DataField = "Description", Required = true },
                new { Type = "CHECKBOX", Label = "Is Active", DataField = "IsActive", Value = true }
            }
        };
    }

    private static object GetAccadjTemplate()
    {
        return new
        {
            menuId = "ACCADJ_TEMPLATE",
            label = "Account Adjustments",
            formWidth = "800px", 
            layout = "PROCESS",
            fields = new[]
            {
                new
                {
                    Type = "GRIDLKP",
                    Label = "Adjustments Grid",
                    DataField = "AdjustmentData",
                    LoadDataInfo_DataModel = "ACCADJ",
                    KeyColumn = "Id"
                }
            }
        };
    }
}
```

### 5. Services Blazor Personnalisés

**Q: Comment créer les services métier pour FormBuilder ?**

**R:** Services avec injection de dépendances :
```csharp
// Services/IFormBuilderService.cs
public interface IFormBuilderService
{
    Task<List<FormModel>> GetFormsAsync(string userId = null);
    Task<FormModel> GetFormAsync(int id);
    Task<FormModel> CreateFormAsync(CreateFormDto dto);
    Task<FormModel> UpdateFormAsync(int id, UpdateFormDto dto);
    Task DeleteFormAsync(int id);
    Task<List<FormTemplate>> GetTemplatesAsync();
    Task<string> ExportFormAsync(int id, string format);
}

// Services/FormBuilderService.cs
public class FormBuilderService : IFormBuilderService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<FormBuilderService> _logger;
    private readonly ICurrentUserService _currentUser;
    private readonly INotificationService _notifications;

    public FormBuilderService(
        ApplicationDbContext context,
        ILogger<FormBuilderService> logger,
        ICurrentUserService currentUser,
        INotificationService notifications)
    {
        _context = context;
        _logger = logger;
        _currentUser = currentUser;
        _notifications = notifications;
    }

    public async Task<List<FormModel>> GetFormsAsync(string userId = null)
    {
        var query = _context.Forms
            .Include(f => f.CreatedBy)
            .Include(f => f.Assignments)
            .AsQueryable();

        // Filtrage par utilisateur si spécifié
        if (!string.IsNullOrEmpty(userId))
        {
            query = query.Where(f => f.CreatedById == userId || 
                                   f.Assignments.Any(a => a.AssignedToId == userId));
        }

        // Filtrage par rôle utilisateur
        if (!await _currentUser.IsInRoleAsync("Admin"))
        {
            var currentUserId = await _currentUser.GetUserIdAsync();
            query = query.Where(f => f.CreatedById == currentUserId ||
                                   f.Assignments.Any(a => a.AssignedToId == currentUserId));
        }

        return await query
            .OrderByDescending(f => f.UpdatedAt)
            .ToListAsync();
    }

    public async Task<FormModel> GetFormAsync(int id)
    {
        var form = await _context.Forms
            .Include(f => f.CreatedBy)
            .Include(f => f.FormFields)
            .Include(f => f.Assignments)
            .FirstOrDefaultAsync(f => f.Id == id);

        if (form == null)
        {
            throw new NotFoundException($"Form with id {id} not found");
        }

        // Vérification des permissions
        if (!await _currentUser.IsInRoleAsync("Admin"))
        {
            var currentUserId = await _currentUser.GetUserIdAsync();
            if (form.CreatedById != currentUserId && 
                !form.Assignments.Any(a => a.AssignedToId == currentUserId))
            {
                throw new UnauthorizedAccessException("Access denied to this form");
            }
        }

        return form;
    }

    public async Task<FormModel> CreateFormAsync(CreateFormDto dto)
    {
        var currentUserId = await _currentUser.GetUserIdAsync();
        
        var form = new FormModel
        {
            MenuId = dto.MenuId ?? $"FORM_{DateTime.Now.Ticks}",
            Label = dto.Label,
            FormWidth = dto.FormWidth ?? "700px",
            Layout = dto.Layout ?? "PROCESS",
            Fields = dto.Fields ?? new List<FormFieldDto>(),
            CreatedById = currentUserId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Forms.Add(form);
        await _context.SaveChangesAsync();

        // Log d'audit
        await LogAuditAsync("CREATE", "Form", form.Id.ToString(), null, form);

        // Notification
        await _notifications.NotifyAsync(currentUserId, 
            "Form Created", 
            $"Form '{form.Label}' has been created successfully",
            NotificationType.Success);

        _logger.LogInformation("Form {FormId} created by user {UserId}", form.Id, currentUserId);

        return form;
    }

    public async Task<FormModel> UpdateFormAsync(int id, UpdateFormDto dto)
    {
        var form = await GetFormAsync(id);
        var oldValues = JsonSerializer.Serialize(form);

        // Mise à jour des propriétés
        form.Label = dto.Label ?? form.Label;
        form.FormWidth = dto.FormWidth ?? form.FormWidth;
        form.Layout = dto.Layout ?? form.Layout;
        form.Fields = dto.Fields ?? form.Fields;
        form.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Log d'audit
        await LogAuditAsync("UPDATE", "Form", form.Id.ToString(), oldValues, form);

        _logger.LogInformation("Form {FormId} updated by user {UserId}", 
            form.Id, await _currentUser.GetUserIdAsync());

        return form;
    }

    public async Task DeleteFormAsync(int id)
    {
        var form = await GetFormAsync(id);
        
        _context.Forms.Remove(form);
        await _context.SaveChangesAsync();

        // Log d'audit
        await LogAuditAsync("DELETE", "Form", form.Id.ToString(), form, null);

        _logger.LogInformation("Form {FormId} deleted by user {UserId}", 
            form.Id, await _currentUser.GetUserIdAsync());
    }

    private async Task LogAuditAsync(string action, string entityType, string entityId, 
        object oldValues, object newValues)
    {
        var auditLog = new AuditLog
        {
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            UserId = await _currentUser.GetUserIdAsync(),
            Changes = JsonSerializer.Serialize(new { OldValues = oldValues, NewValues = newValues }),
            CreatedAt = DateTime.UtcNow
        };

        _context.AuditLogs.Add(auditLog);
    }
}
```

Cette configuration technique complète permet de démarrer le développement avec la stack Blazor pure.