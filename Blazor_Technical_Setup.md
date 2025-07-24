# FormBuilder Pro - Blazor .NET Setup Guide

## 🚀 Installation et Configuration

### Q: Comment créer la structure de projet ?
**R:** 
```bash
# Créer la solution
dotnet new sln -n FormBuilderPro

# Projets .NET
dotnet new blazorserver -n FormBuilder.BlazorApp
dotnet new webapi -n FormBuilder.API  
dotnet new classlib -n FormBuilder.Models
dotnet new classlib -n FormBuilder.Data

# Ajouter à la solution
dotnet sln add FormBuilder.BlazorApp FormBuilder.API FormBuilder.Models FormBuilder.Data

# Références entre projets
cd FormBuilder.BlazorApp
dotnet add reference ../FormBuilder.Models ../FormBuilder.Data

cd ../FormBuilder.API
dotnet add reference ../FormBuilder.Models ../FormBuilder.Data

cd ../FormBuilder.Data
dotnet add reference ../FormBuilder.Models
```

### Q: Packages NuGet requis ?
**R:** 
```bash
# FormBuilder.BlazorApp
dotnet add package MudBlazor
dotnet add package MudBlazor.ThemeManager
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL

# FormBuilder.API
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Swashbuckle.AspNetCore

# FormBuilder.Data
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

## 💾 Configuration PostgreSQL

### Q: Installation PostgreSQL ?
**R:** 
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Windows (via Chocolatey)
choco install postgresql

# macOS (via Homebrew)
brew install postgresql

# Démarrer le service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Créer la base de données
sudo -u postgres createdb formbuilder
sudo -u postgres psql
ALTER USER postgres PASSWORD 'yourpassword';
```

### Q: Configuration Entity Framework ?
**R:** 
```csharp
// FormBuilder.Data/ApplicationDbContext.cs
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using FormBuilder.Models;

namespace FormBuilder.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<FormDefinition> FormDefinitions { get; set; }
        public DbSet<FormTemplate> FormTemplates { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configuration des entités
            builder.Entity<FormDefinition>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.MenuId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Label).IsRequired().HasMaxLength(200);
                entity.Property(e => e.FieldsJson).HasColumnType("jsonb");
                entity.HasIndex(e => e.MenuId);
                entity.HasIndex(e => e.UserId);
            });

            builder.Entity<ApplicationUser>(entity =>
            {
                entity.Property(e => e.FirstName).HasMaxLength(100);
                entity.Property(e => e.LastName).HasMaxLength(100);
                entity.Property(e => e.Role).HasDefaultValue("User");
            });
        }
    }
}
```

## 🎨 Configuration MudBlazor

### Q: Setup complet MudBlazor ?
**R:** 
```csharp
// Program.cs
using MudBlazor.Services;
using FormBuilder.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddMudServices();

// Base de données
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Authentification
builder.Services.AddDefaultIdentity<ApplicationUser>(options => {
    options.SignIn.RequireConfirmedAccount = false;
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<ApplicationDbContext>();

var app = builder.Build();

// Pipeline
if (!app.Environment.IsDevelopment())
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
app.MapFallbackToPage("/_Host");

app.Run();
```

### Q: Layout principal MudBlazor ?
**R:** 
```razor
@* Shared/MainLayout.razor *@
@using MudBlazor
@inherits LayoutView

<MudThemeProvider />
<MudDialogProvider />
<MudSnackbarProvider />

<MudLayout>
    <MudAppBar Elevation="1">
        <MudIconButton Icon="@Icons.Material.Filled.Menu" 
                       Color="Color.Inherit" 
                       Edge="Edge.Start" 
                       OnClick="@((e) => DrawerToggle())" />
        <MudText Typo="Typo.h6">FormBuilder Pro</MudText>
        <MudSpacer />
        <AuthorizeView>
            <Authorized>
                <MudMenu Icon="@Icons.Material.Filled.AccountCircle" Color="Color.Inherit">
                    <MudMenuItem OnClick="@(() => Navigation.NavigateTo("/profile"))">
                        Profil
                    </MudMenuItem>
                    <MudMenuItem OnClick="@LogoutAsync">
                        Déconnexion
                    </MudMenuItem>
                </MudMenu>
            </Authorized>
            <NotAuthorized>
                <MudButton Href="/login" Color="Color.Inherit">Connexion</MudButton>
            </NotAuthorized>
        </AuthorizeView>
    </MudAppBar>
    
    <MudDrawer @bind-Open="_drawerOpen" Elevation="2">
        <MudDrawerHeader>
            <MudText Typo="Typo.h6">Navigation</MudText>
        </MudDrawerHeader>
        <NavMenu />
    </MudDrawer>
    
    <MudMainContent>
        <MudContainer MaxWidth="MaxWidth.ExtraLarge" Class="my-16 pt-16">
            @Body
        </MudContainer>
    </MudMainContent>
</MudLayout>

@code {
    bool _drawerOpen = true;

    void DrawerToggle()
    {
        _drawerOpen = !_drawerOpen;
    }

    private async Task LogoutAsync()
    {
        await SignInManager.SignOutAsync();
        Navigation.NavigateTo("/");
    }
}
```

## 🐍 Assistant IA Python

### Q: Structure projet Python ?
**R:** 
```
ai-assistant/
├── requirements.txt
├── app.py
├── models/
│   ├── __init__.py
│   ├── form_generator.py
│   └── dfm_parser.py
├── templates/
│   ├── accadj_template.json
│   ├── buytyp_template.json
│   └── primnt_template.json
└── utils/
    ├── __init__.py
    └── helpers.py
```

### Q: Configuration requirements.txt ?
**R:** 
```txt
streamlit==1.28.1
openai==1.3.0
pandas==2.0.3
numpy==1.24.3
python-dotenv==1.0.0
requests==2.31.0
pydantic==2.4.2
fastapi==0.104.1
uvicorn==0.24.0
```

### Q: Assistant Streamlit principal ?
**R:** 
```python
# app.py
import streamlit as st
import openai
import json
import os
from dotenv import load_dotenv
from models.form_generator import FormGenerator
from models.dfm_parser import DFMParser

# Configuration
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

st.set_page_config(
    page_title="FormBuilder IA Assistant",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS personnalisé
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin-bottom: 2rem;
    }
    .chat-message {
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
    }
    .user-message {
        background: #e3f2fd;
        border-left: 4px solid #2196f3;
    }
    .assistant-message {
        background: #f3e5f5;
        border-left: 4px solid #9c27b0;
    }
</style>
""", unsafe_allow_html=True)

def main():
    # Header
    st.markdown('<div class="main-header"><h1>🤖 Assistant IA FormBuilder</h1></div>', 
                unsafe_allow_html=True)
    
    # Sidebar
    with st.sidebar:
        st.header("⚙️ Configuration")
        
        program_type = st.selectbox(
            "Type de programme",
            ["ACCADJ", "BUYTYP", "PRIMNT", "SRCMNT"],
            help="Sélectionnez le type de programme à générer"
        )
        
        model = st.selectbox(
            "Modèle IA",
            ["gpt-4", "gpt-3.5-turbo"],
            help="Modèle OpenAI à utiliser"
        )
        
        temperature = st.slider(
            "Température",
            0.0, 1.0, 0.7,
            help="Créativité du modèle"
        )
        
        st.divider()
        
        # Upload DFM
        uploaded_file = st.file_uploader(
            "📁 Upload fichier DFM",
            type=['dfm', 'txt'],
            help="Fichier Delphi Form à analyser"
        )
        
        if uploaded_file:
            if st.button("🔍 Analyser DFM"):
                analyze_dfm_file(uploaded_file)
    
    # Interface de chat
    if "messages" not in st.session_state:
        st.session_state.messages = []
        # Message de bienvenue
        welcome_msg = f"Bonjour ! Je suis votre assistant pour générer des programmes {program_type}. Comment puis-je vous aider ?"
        st.session_state.messages.append({"role": "assistant", "content": welcome_msg})
    
    # Afficher l'historique
    for message in st.session_state.messages:
        with st.container():
            if message["role"] == "user":
                st.markdown(f'<div class="chat-message user-message"><strong>Vous:</strong> {message["content"]}</div>', 
                           unsafe_allow_html=True)
            else:
                st.markdown(f'<div class="chat-message assistant-message"><strong>Assistant:</strong> {message["content"]}</div>', 
                           unsafe_allow_html=True)
    
    # Input utilisateur
    col1, col2 = st.columns([4, 1])
    
    with col1:
        user_input = st.text_input(
            "Votre message:",
            placeholder=f"Décrivez le programme {program_type} que vous voulez créer...",
            key="user_input"
        )
    
    with col2:
        send_button = st.button("📤 Envoyer", type="primary")
    
    # Boutons de suggestion
    st.subheader("💡 Suggestions rapides")
    col1, col2, col3, col4 = st.columns(4)
    
    suggestions = {
        "ACCADJ": "Créer un programme d'ajustement comptable avec validation",
        "BUYTYP": "Générer un système de gestion d'achats avec workflow",
        "PRIMNT": "Interface de maintenance primaire avec contrôles",
        "SRCMNT": "Module de recherche et maintenance avancé"
    }
    
    with col1:
        if st.button(f"🔧 {program_type} Simple"):
            process_user_input(f"Créer un {program_type} simple avec les champs de base", program_type, model, temperature)
    
    with col2:
        if st.button(f"⚡ {program_type} Avancé"):
            process_user_input(f"Générer un {program_type} avancé avec validation et workflow", program_type, model, temperature)
    
    with col3:
        if st.button(f"📊 Avec Grille"):
            process_user_input(f"Créer un {program_type} avec composant GRIDLKP pour affichage de données", program_type, model, temperature)
    
    with col4:
        if st.button(f"🎯 Personnalisé"):
            process_user_input(f"Guide-moi pour créer un {program_type} personnalisé selon mes besoins", program_type, model, temperature)
    
    # Traitement de l'input
    if send_button and user_input:
        process_user_input(user_input, program_type, model, temperature)
        st.experimental_rerun()

def process_user_input(user_input, program_type, model, temperature):
    """Traite l'input utilisateur et génère une réponse"""
    st.session_state.messages.append({"role": "user", "content": user_input})
    
    # Générer la réponse
    with st.spinner("🤔 Génération en cours..."):
        try:
            generator = FormGenerator(model, temperature)
            response = generator.generate_program(user_input, program_type)
            st.session_state.messages.append({"role": "assistant", "content": response})
        except Exception as e:
            error_msg = f"❌ Erreur lors de la génération: {str(e)}"
            st.session_state.messages.append({"role": "assistant", "content": error_msg})

def analyze_dfm_file(uploaded_file):
    """Analyse un fichier DFM uploadé"""
    try:
        content = uploaded_file.read().decode('utf-8')
        parser = DFMParser()
        analysis = parser.parse_dfm(content)
        
        st.success("✅ Fichier DFM analysé avec succès!")
        
        # Afficher l'analyse
        with st.expander("📋 Résultats de l'analyse"):
            st.json(analysis)
        
        # Proposer la génération
        if st.button("🚀 Générer programme JSON"):
            generator = FormGenerator()
            program_json = generator.generate_from_dfm_analysis(analysis)
            st.code(program_json, language='json')
            
    except Exception as e:
        st.error(f"❌ Erreur lors de l'analyse: {str(e)}")

if __name__ == "__main__":
    main()
```

## 🔗 Intégration API .NET ↔ Python

### Q: Service d'intégration côté .NET ?
**R:** 
```csharp
// Services/AIAssistantService.cs
using System.Text.Json;

namespace FormBuilder.BlazorApp.Services
{
    public interface IAIAssistantService
    {
        Task<string> GenerateProgramAsync(string prompt, string programType);
        Task<string> AnalyzeDfmAsync(string dfmContent);
    }

    public class AIAssistantService : IAIAssistantService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AIAssistantService> _logger;

        public AIAssistantService(
            HttpClient httpClient, 
            IConfiguration configuration,
            ILogger<AIAssistantService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<string> GenerateProgramAsync(string prompt, string programType)
        {
            try
            {
                var request = new
                {
                    prompt = prompt,
                    program_type = programType,
                    model = "gpt-4",
                    temperature = 0.7
                };

                var streamlitUrl = _configuration["StreamlitApiUrl"] ?? "http://localhost:8501";
                var response = await _httpClient.PostAsJsonAsync(
                    $"{streamlitUrl}/api/generate", 
                    request);

                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    _logger.LogError($"Erreur API Streamlit: {response.StatusCode}");
                    return "Erreur lors de la génération du programme.";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'appel à l'IA");
                return "Service IA temporairement indisponible.";
            }
        }

        public async Task<string> AnalyzeDfmAsync(string dfmContent)
        {
            try
            {
                var request = new { dfm_content = dfmContent };
                var streamlitUrl = _configuration["StreamlitApiUrl"] ?? "http://localhost:8501";
                
                var response = await _httpClient.PostAsJsonAsync(
                    $"{streamlitUrl}/api/analyze-dfm", 
                    request);

                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'analyse DFM");
                return "Erreur lors de l'analyse du fichier DFM.";
            }
        }
    }
}
```

### Q: API FastAPI pour Streamlit ?
**R:** 
```python
# api.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from models.form_generator import FormGenerator
from models.dfm_parser import DFMParser
import uvicorn

app = FastAPI(title="FormBuilder AI API", version="1.0.0")

class GenerateRequest(BaseModel):
    prompt: str
    program_type: str
    model: str = "gpt-4"
    temperature: float = 0.7

class DFMAnalyzeRequest(BaseModel):
    dfm_content: str

@app.post("/api/generate")
async def generate_program(request: GenerateRequest):
    """Génère un programme basé sur le prompt utilisateur"""
    try:
        generator = FormGenerator(request.model, request.temperature)
        result = generator.generate_program(request.prompt, request.program_type)
        return {"success": True, "program": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-dfm")
async def analyze_dfm(request: DFMAnalyzeRequest):
    """Analyse un fichier DFM"""
    try:
        parser = DFMParser()
        analysis = parser.parse_dfm(request.dfm_content)
        return {"success": True, "analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Check de santé de l'API"""
    return {"status": "healthy", "service": "FormBuilder AI API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## 🧪 Tests et Quality Assurance

### Q: Tests unitaires Blazor ?
**R:** 
```csharp
// Tests/ComponentTests/FormBuilderTests.cs
using Bunit;
using Microsoft.Extensions.DependencyInjection;
using MudBlazor.Services;
using FormBuilder.BlazorApp.Components;

namespace FormBuilder.Tests.ComponentTests
{
    public class FormBuilderTests : TestContext
    {
        public FormBuilderTests()
        {
            Services.AddMudServices();
        }

        [Fact]
        public void FormBuilder_RendersCorrectly()
        {
            // Arrange & Act
            var component = RenderComponent<FormBuilderComponent>();

            // Assert
            Assert.NotNull(component.Find(".component-palette"));
            Assert.NotNull(component.Find(".construction-zone"));
            Assert.NotNull(component.Find(".properties-panel"));
        }

        [Fact]
        public void AddComponent_UpdatesFormFields()
        {
            // Arrange
            var component = RenderComponent<FormBuilderComponent>();
            
            // Act
            var addButton = component.Find(".add-text-component");
            addButton.Click();

            // Assert
            var formFields = component.FindAll(".form-field");
            Assert.Single(formFields);
        }
    }
}
```

### Q: Tests d'intégration API ?
**R:** 
```csharp
// Tests/IntegrationTests/ProgramsApiTests.cs
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http.Json;

namespace FormBuilder.Tests.IntegrationTests
{
    public class ProgramsApiTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public ProgramsApiTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task CreateProgram_ValidData_ReturnsCreated()
        {
            // Arrange
            var program = new CreateProgramDto
            {
                MenuId = "TEST_FORM",
                Label = "Test Form",
                FormWidth = "700px",
                Layout = "PROCESS",
                Fields = new List<FormField>
                {
                    new FormField { Type = "TEXT", Label = "Nom", DataField = "name" }
                }
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/programs", program);

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            var createdProgram = await response.Content.ReadFromJsonAsync<FormDefinition>();
            Assert.Equal("TEST_FORM", createdProgram.MenuId);
        }
    }
}
```

## 📊 Monitoring et Logging

### Q: Configuration Serilog ?
**R:** 
```csharp
// Program.cs
using Serilog;

// Configuration Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .WriteTo.Console()
    .WriteTo.File("logs/formbuilder-.log", rollingInterval: RollingInterval.Day)
    .WriteTo.PostgreSQL(
        connectionString: builder.Configuration.GetConnectionString("DefaultConnection"),
        tableName: "logs",
        autoCreateSqlTable: true)
    .CreateLogger();

builder.Host.UseSerilog();

// appsettings.json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "System": "Warning"
      }
    }
  }
}
```

### Q: Health Checks ASP.NET Core ?
**R:** 
```csharp
// Program.cs
builder.Services.AddHealthChecks()
    .AddNpgSql(builder.Configuration.GetConnectionString("DefaultConnection"))
    .AddCheck<StreamlitHealthCheck>("streamlit")
    .AddCheck<AIServiceHealthCheck>("ai-service");

// Middleware
app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

// Custom Health Check
public class StreamlitHealthCheck : IHealthCheck
{
    private readonly HttpClient _httpClient;
    private readonly string _streamlitUrl;

    public StreamlitHealthCheck(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _streamlitUrl = config["StreamlitApiUrl"] ?? "http://localhost:8501";
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context, 
        CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.GetAsync($"{_streamlitUrl}/api/health", cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                return HealthCheckResult.Healthy("Streamlit API is responsive");
            }
            
            return HealthCheckResult.Unhealthy($"Streamlit API returned {response.StatusCode}");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy($"Streamlit API is unreachable: {ex.Message}");
        }
    }
}
```

---

**Stack complète Blazor .NET :**
- .NET 8.0 + Blazor Server/WebAssembly
- MudBlazor + ASP.NET Core Identity
- Entity Framework Core + PostgreSQL
- Python Streamlit + FastAPI
- Docker + Health Monitoring
- Tests unitaires et d'intégration