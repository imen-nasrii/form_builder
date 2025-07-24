# FormBuilder Pro - Blazor .NET Edition - FAQ

## 🏗 Architecture du Projet

### Q: Quelle est l'architecture de la version Blazor ?
**R:** 
- **Frontend :** Blazor Server/WebAssembly + MudBlazor UI
- **Backend :** ASP.NET Core Web API + Entity Framework Core
- **Base de données :** PostgreSQL avec Npgsql
- **IA :** Python + Streamlit + venv isolé
- **Authentication :** ASP.NET Core Identity

### Q: Structure des dossiers ?
**R:** 
```
├── FormBuilder.BlazorApp/     # Application Blazor
├── FormBuilder.API/           # API ASP.NET Core
├── FormBuilder.Models/        # Modèles partagés
├── FormBuilder.Data/          # Entity Framework
├── ai-assistant/              # Python Streamlit (venv)
│   ├── requirements.txt
│   ├── app.py
│   └── models/
└── docker-compose.yml         # Orchestration
```

## 💾 Base de Données PostgreSQL

### Q: Comment configurer PostgreSQL ?
**R:** 
```csharp
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=formbuilder;Username=postgres;Password=password"
  }
}

// Program.cs
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
```

### Q: Migrations Entity Framework ?
**R:** 
```bash
# Créer une migration
dotnet ef migrations add InitialCreate

# Appliquer à la base
dotnet ef database update

# Script SQL pour production
dotnet ef migrations script
```

### Q: Modèles principaux ?
**R:** 
```csharp
public class FormDefinition
{
    public int Id { get; set; }
    public string MenuId { get; set; }
    public string Label { get; set; }
    public string FormWidth { get; set; }
    public string Layout { get; set; }
    public string FieldsJson { get; set; }
    public DateTime CreatedAt { get; set; }
    public string UserId { get; set; }
}

public class User : IdentityUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Role { get; set; } = "User";
}
```

## 🎨 Frontend Blazor + MudBlazor

### Q: Comment installer MudBlazor ?
**R:** 
```bash
# NuGet Package
dotnet add package MudBlazor

# Dans Program.cs
builder.Services.AddMudServices();

# Dans _Host.cshtml
<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" rel="stylesheet" />
<link href="_content/MudBlazor/MudBlazor.min.css" rel="stylesheet" />
<script src="_content/MudBlazor/MudBlazor.min.js"></script>
```

### Q: Composant drag & drop pour form builder ?
**R:** 
```razor
@using MudBlazor
@inject IJSRuntime JS

<MudContainer>
    <MudGrid>
        <MudItem xs="3">
            <MudPaper Class="pa-4">
                <MudText Typo="Typo.h6">Palette de Composants</MudText>
                @foreach (var component in ComponentPalette)
                {
                    <MudChip Draggable="true" 
                             ondragstart="@(() => SetDragData(component))"
                             Color="Color.Primary" 
                             Class="ma-1">
                        @component.Label
                    </MudChip>
                }
            </MudPaper>
        </MudItem>
        
        <MudItem xs="6">
            <MudPaper Class="pa-4 drop-zone" 
                      ondrop="@HandleDrop" 
                      ondragover="@HandleDragOver">
                <MudText Typo="Typo.h6">Zone de Construction</MudText>
                @foreach (var field in FormFields)
                {
                    <MudCard Class="ma-2">
                        <MudCardContent>
                            @RenderFormComponent(field)
                        </MudCardContent>
                    </MudCard>
                }
            </MudPaper>
        </MudItem>
        
        <MudItem xs="3">
            <MudPaper Class="pa-4">
                <MudText Typo="Typo.h6">Propriétés</MudText>
                @if (SelectedField != null)
                {
                    <MudTextField @bind-Value="SelectedField.Label" Label="Label" />
                    <MudTextField @bind-Value="SelectedField.DataField" Label="Data Field" />
                    <MudSwitch @bind-Checked="SelectedField.Required" Label="Required" />
                }
            </MudPaper>
        </MudItem>
    </MudGrid>
</MudContainer>

@code {
    private List<FormField> FormFields = new();
    private FormField? SelectedField;
    private string? DraggedComponent;
    
    private async Task HandleDrop()
    {
        if (!string.IsNullOrEmpty(DraggedComponent))
        {
            var newField = CreateFieldFromType(DraggedComponent);
            FormFields.Add(newField);
            StateHasChanged();
        }
    }
}
```

### Q: Composants MudBlazor pour formulaires ?
**R:** 
```razor
@* Mapping des composants *@
@switch (field.Type)
{
    case "TEXT":
        <MudTextField @bind-Value="field.Value" 
                      Label="@field.Label" 
                      Required="@field.Required" />
        break;
        
    case "SELECT":
        <MudSelect @bind-Value="field.Value" 
                   Label="@field.Label">
            @foreach (var option in field.Options)
            {
                <MudSelectItem Value="@option.Value">@option.Label</MudSelectItem>
            }
        </MudSelect>
        break;
        
    case "CHECKBOX":
        <MudCheckBox @bind-Checked="field.BoolValue" 
                     Label="@field.Label" />
        break;
        
    case "DATEPICKER":
        <MudDatePicker @bind-Date="field.DateValue" 
                       Label="@field.Label" />
        break;
}
```

## 🔐 Authentification ASP.NET Core Identity

### Q: Configuration de l'authentification ?
**R:** 
```csharp
// Program.cs
builder.Services.AddDefaultIdentity<ApplicationUser>(options => {
    options.SignIn.RequireConfirmedAccount = false;
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<ApplicationDbContext>();

// Middleware
app.UseAuthentication();
app.UseAuthorization();
```

### Q: Composant de connexion Blazor ?
**R:** 
```razor
@page "/login"
@using Microsoft.AspNetCore.Identity
@inject SignInManager<ApplicationUser> SignInManager
@inject NavigationManager Navigation

<MudContainer MaxWidth="MaxWidth.Small">
    <MudPaper Class="pa-6">
        <MudText Typo="Typo.h4" Align="Align.Center">Connexion</MudText>
        
        <EditForm Model="@loginModel" OnValidSubmit="@HandleLogin">
            <DataAnnotationsValidator />
            <ValidationSummary />
            
            <MudTextField @bind-Value="loginModel.Email" 
                          Label="Email" 
                          InputType="InputType.Email" 
                          Required="true" />
                          
            <MudTextField @bind-Value="loginModel.Password" 
                          Label="Mot de passe" 
                          InputType="InputType.Password" 
                          Required="true" />
                          
            <MudButton ButtonType="ButtonType.Submit" 
                       Variant="Variant.Filled" 
                       Color="Color.Primary" 
                       FullWidth="true">
                Se connecter
            </MudButton>
        </EditForm>
    </MudPaper>
</MudContainer>

@code {
    private LoginModel loginModel = new();
    
    private async Task HandleLogin()
    {
        var result = await SignInManager.PasswordSignInAsync(
            loginModel.Email, 
            loginModel.Password, 
            false, 
            lockoutOnFailure: false);
            
        if (result.Succeeded)
        {
            Navigation.NavigateTo("/");
        }
    }
}
```

## 🤖 Assistant IA Python Streamlit

### Q: Configuration de l'environnement Python ?
**R:** 
```bash
# Créer environnement virtuel
python -m venv ai-assistant
cd ai-assistant

# Activer (Windows)
Scripts\activate
# Activer (Linux/Mac)
source bin/activate

# Installer dépendances
pip install streamlit openai pandas numpy python-dotenv
pip freeze > requirements.txt
```

### Q: Structure de l'assistant Streamlit ?
**R:** 
```python
# app.py
import streamlit as st
import openai
import json
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

st.set_page_config(
    page_title="FormBuilder IA Assistant",
    page_icon="🤖",
    layout="wide"
)

def main():
    st.title("🤖 Assistant IA FormBuilder")
    
    # Sidebar pour configuration
    with st.sidebar:
        st.header("Configuration")
        program_type = st.selectbox(
            "Type de programme",
            ["ACCADJ", "BUYTYP", "PRIMNT", "SRCMNT"]
        )
        
        model = st.selectbox(
            "Modèle IA",
            ["gpt-4", "gpt-3.5-turbo"]
        )
    
    # Interface de chat
    if "messages" not in st.session_state:
        st.session_state.messages = []
    
    # Afficher l'historique
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Input utilisateur
    if prompt := st.chat_input("Décrivez votre programme..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Réponse IA
        with st.chat_message("assistant"):
            response = generate_program(prompt, program_type, model)
            st.markdown(response)
            st.session_state.messages.append({"role": "assistant", "content": response})

def generate_program(prompt, program_type, model):
    system_prompt = f"""
    Vous êtes un expert en génération de programmes {program_type}.
    Générez une configuration JSON complète basée sur la demande utilisateur.
    """
    
    response = openai.ChatCompletion.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]
    )
    
    return response.choices[0].message.content

if __name__ == "__main__":
    main()
```

### Q: Intégration avec l'API .NET ?
**R:** 
```csharp
// Service d'intégration IA
public class AIAssistantService
{
    private readonly HttpClient _httpClient;
    private readonly string _streamlitUrl;
    
    public AIAssistantService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _streamlitUrl = config["StreamlitUrl"] ?? "http://localhost:8501";
    }
    
    public async Task<string> GenerateProgramAsync(string prompt, string type)
    {
        var request = new
        {
            prompt = prompt,
            program_type = type
        };
        
        var response = await _httpClient.PostAsJsonAsync(
            $"{_streamlitUrl}/api/generate", 
            request);
            
        return await response.Content.ReadAsStringAsync();
    }
}

// Dans le composant Blazor
@inject AIAssistantService AIService

private async Task GenerateWithAI()
{
    isGenerating = true;
    try
    {
        var result = await AIService.GenerateProgramAsync(userPrompt, selectedType);
        generatedProgram = JsonSerializer.Deserialize<FormDefinition>(result);
    }
    finally
    {
        isGenerating = false;
    }
}
```

## 📊 Interface Dashboard avec MudBlazor

### Q: Dashboard avec tableaux de données ?
**R:** 
```razor
@page "/dashboard"
@using MudBlazor

<MudContainer MaxWidth="MaxWidth.ExtraLarge">
    <MudGrid>
        <MudItem xs="12">
            <MudText Typo="Typo.h4">Tableau de Bord</MudText>
        </MudItem>
        
        <!-- Statistiques -->
        <MudItem xs="3">
            <MudCard>
                <MudCardContent>
                    <MudText Typo="Typo.h6">Programmes Total</MudText>
                    <MudText Typo="Typo.h3" Color="Color.Primary">@totalPrograms</MudText>
                </MudCardContent>
            </MudCard>
        </MudItem>
        
        <!-- Tableau des programmes -->
        <MudItem xs="12">
            <MudDataGrid Items="@programs" 
                         Filterable="true" 
                         SortMode="SortMode.Multiple"
                         Pagination="true"
                         RowsPerPage="10">
                <Columns>
                    <PropertyColumn Property="x => x.MenuId" Title="Menu ID" />
                    <PropertyColumn Property="x => x.Label" Title="Label" />
                    <PropertyColumn Property="x => x.CreatedAt" Title="Créé le" />
                    <TemplateColumn Title="Actions">
                        <CellTemplate>
                            <MudButtonGroup>
                                <MudIconButton Icon="@Icons.Material.Filled.Edit" 
                                               Color="Color.Primary"
                                               OnClick="@(() => EditProgram(context.Item))" />
                                <MudIconButton Icon="@Icons.Material.Filled.Delete" 
                                               Color="Color.Error"
                                               OnClick="@(() => DeleteProgram(context.Item))" />
                            </MudButtonGroup>
                        </CellTemplate>
                    </TemplateColumn>
                </Columns>
            </MudDataGrid>
        </MudItem>
    </MudGrid>
</MudContainer>

@code {
    private List<FormDefinition> programs = new();
    private int totalPrograms;
    
    protected override async Task OnInitializedAsync()
    {
        await LoadPrograms();
    }
    
    private async Task LoadPrograms()
    {
        programs = await ProgramService.GetAllAsync();
        totalPrograms = programs.Count;
    }
}
```

## 🔧 API ASP.NET Core

### Q: Contrôleurs pour CRUD ?
**R:** 
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProgramsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ProgramsController> _logger;
    
    public ProgramsController(ApplicationDbContext context, ILogger<ProgramsController> logger)
    {
        _context = context;
        _logger = logger;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FormDefinition>>> GetPrograms()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        return await _context.FormDefinitions
            .Where(f => f.UserId == userId)
            .ToListAsync();
    }
    
    [HttpPost]
    public async Task<ActionResult<FormDefinition>> CreateProgram(CreateProgramDto dto)
    {
        var program = new FormDefinition
        {
            MenuId = dto.MenuId,
            Label = dto.Label,
            FormWidth = dto.FormWidth,
            Layout = dto.Layout,
            FieldsJson = JsonSerializer.Serialize(dto.Fields),
            UserId = User.FindFirstValue(ClaimTypes.NameIdentifier),
            CreatedAt = DateTime.UtcNow
        };
        
        _context.FormDefinitions.Add(program);
        await _context.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetProgram), new { id = program.Id }, program);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProgram(int id, UpdateProgramDto dto)
    {
        var program = await _context.FormDefinitions.FindAsync(id);
        
        if (program == null || program.UserId != User.FindFirstValue(ClaimTypes.NameIdentifier))
        {
            return NotFound();
        }
        
        program.Label = dto.Label;
        program.FormWidth = dto.FormWidth;
        program.FieldsJson = JsonSerializer.Serialize(dto.Fields);
        
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
}
```

## 🐳 Déploiement Docker

### Q: Configuration Docker Compose ?
**R:** 
```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: formbuilder
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  
  blazor-app:
    build: 
      context: .
      dockerfile: FormBuilder.BlazorApp/Dockerfile
    ports:
      - "5000:80"
    depends_on:
      - postgres
    environment:
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=formbuilder;Username=postgres;Password=password
  
  ai-assistant:
    build:
      context: ./ai-assistant
      dockerfile: Dockerfile
    ports:
      - "8501:8501"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./ai-assistant:/app

volumes:
  postgres_data:
```

### Q: Dockerfile pour Blazor ?
**R:** 
```dockerfile
# FormBuilder.BlazorApp/Dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["FormBuilder.BlazorApp/FormBuilder.BlazorApp.csproj", "FormBuilder.BlazorApp/"]
COPY ["FormBuilder.Models/FormBuilder.Models.csproj", "FormBuilder.Models/"]
RUN dotnet restore "FormBuilder.BlazorApp/FormBuilder.BlazorApp.csproj"

COPY . .
WORKDIR "/src/FormBuilder.BlazorApp"
RUN dotnet build "FormBuilder.BlazorApp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FormBuilder.BlazorApp.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FormBuilder.BlazorApp.dll"]
```

## 🚀 Scripts de Déploiement

### Q: Scripts PowerShell pour Windows ?
**R:** 
```powershell
# deploy.ps1
Write-Host "Déploiement FormBuilder Blazor" -ForegroundColor Green

# Arrêter les conteneurs existants
docker-compose down

# Construire les images
docker-compose build

# Démarrer les services
docker-compose up -d

# Attendre que PostgreSQL soit prêt
Write-Host "Attente de PostgreSQL..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Appliquer les migrations
dotnet ef database update --project FormBuilder.BlazorApp

Write-Host "Déploiement terminé!" -ForegroundColor Green
Write-Host "Application: http://localhost:5000" -ForegroundColor Cyan
Write-Host "IA Assistant: http://localhost:8501" -ForegroundColor Cyan
```

### Q: Scripts Bash pour Linux ?
**R:** 
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Déploiement FormBuilder Blazor"

# Arrêter les conteneurs
docker-compose down

# Construire et démarrer
docker-compose up -d --build

# Attendre PostgreSQL
echo "⏳ Attente de PostgreSQL..."
sleep 30

# Migrations
dotnet ef database update --project FormBuilder.BlazorApp

echo "✅ Déploiement terminé!"
echo "🌐 Application: http://localhost:5000"
echo "🤖 IA Assistant: http://localhost:8501"
```

## 🔍 Tests et Monitoring

### Q: Tests unitaires avec xUnit ?
**R:** 
```csharp
// FormBuilder.Tests/ProgramsControllerTests.cs
public class ProgramsControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;
    
    public ProgramsControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }
    
    [Fact]
    public async Task GetPrograms_ReturnsSuccessAndCorrectContentType()
    {
        // Arrange & Act
        var response = await _client.GetAsync("/api/programs");
        
        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal("application/json", response.Content.Headers.ContentType?.MediaType);
    }
    
    [Fact]
    public async Task CreateProgram_WithValidData_ReturnsCreated()
    {
        // Arrange
        var program = new CreateProgramDto
        {
            MenuId = "TEST_FORM",
            Label = "Test Form",
            FormWidth = "700px",
            Layout = "PROCESS",
            Fields = new List<FormField>()
        };
        
        // Act
        var response = await _client.PostAsJsonAsync("/api/programs", program);
        
        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }
}
```

---

**Technologies Stack :**
- .NET 8.0 + Blazor Server/WASM
- MudBlazor pour l'interface utilisateur
- Entity Framework Core + PostgreSQL
- ASP.NET Core Identity
- Python Streamlit + OpenAI
- Docker + Docker Compose

**Outils de développement :**
- Visual Studio 2022 / VS Code
- pgAdmin pour PostgreSQL
- Postman pour tester l'API
- Docker Desktop