# FormBuilder Pro - Blazor .NET - Référence Rapide

## 🚀 Commandes Essentielles

### Création de Projet
```bash
# Solution complète
dotnet new sln -n FormBuilderPro
dotnet new blazorserver -n FormBuilder.BlazorApp
dotnet new webapi -n FormBuilder.API  
dotnet new classlib -n FormBuilder.Models
dotnet new classlib -n FormBuilder.Data

# Packages principaux
dotnet add package MudBlazor
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
```

### Base de Données
```bash
# Migrations
dotnet ef migrations add InitialCreate
dotnet ef database update

# Python venv
python -m venv ai-assistant
source ai-assistant/bin/activate  # Linux/Mac
ai-assistant\Scripts\activate     # Windows
pip install streamlit openai pandas
```

## 🎨 Composants MudBlazor Essentiels

### Layout Principal
```razor
<MudLayout>
    <MudAppBar>
        <MudIconButton Icon="@Icons.Material.Filled.Menu" OnClick="DrawerToggle" />
        <MudText Typo="Typo.h6">FormBuilder Pro</MudText>
    </MudAppBar>
    <MudDrawer @bind-Open="drawerOpen">
        <NavMenu />
    </MudDrawer>
    <MudMainContent>
        @Body
    </MudMainContent>
</MudLayout>
```

### Formulaires
```razor
<EditForm Model="model" OnValidSubmit="HandleSubmit">
    <MudTextField @bind-Value="model.Name" Label="Nom" Required="true" />
    <MudSelect @bind-Value="model.Type" Label="Type">
        <MudSelectItem Value="TEXT">Texte</MudSelectItem>
        <MudSelectItem Value="SELECT">Liste</MudSelectItem>
    </MudSelect>
    <MudButton ButtonType="ButtonType.Submit">Valider</MudButton>
</EditForm>
```

### Tableaux de Données
```razor
<MudDataGrid Items="@programs" Filterable="true" SortMode="SortMode.Multiple">
    <Columns>
        <PropertyColumn Property="x => x.Label" Title="Nom" />
        <PropertyColumn Property="x => x.CreatedAt" Title="Créé le" />
        <TemplateColumn Title="Actions">
            <CellTemplate>
                <MudIconButton Icon="@Icons.Material.Filled.Edit" 
                               OnClick="@(() => EditItem(context.Item))" />
            </CellTemplate>
        </TemplateColumn>
    </Columns>
</MudDataGrid>
```

## 🗄 Entity Framework Core

### DbContext Configuration
```csharp
public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public DbSet<FormDefinition> FormDefinitions { get; set; }
    public DbSet<Task> Tasks { get; set; }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<FormDefinition>(entity =>
        {
            entity.Property(e => e.FieldsJson).HasColumnType("jsonb");
            entity.HasIndex(e => e.MenuId);
        });
    }
}
```

### Modèles Principaux
```csharp
public class FormDefinition
{
    public int Id { get; set; }
    public string MenuId { get; set; }
    public string Label { get; set; }
    public string FieldsJson { get; set; }
    public string UserId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Role { get; set; } = "User";
}
```

## 🔐 Authentification

### Configuration Program.cs
```csharp
builder.Services.AddDefaultIdentity<ApplicationUser>(options => {
    options.SignIn.RequireConfirmedAccount = false;
    options.Password.RequiredLength = 6;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<ApplicationDbContext>();
```

### Composant Login
```razor
<EditForm Model="loginModel" OnValidSubmit="HandleLogin">
    <MudTextField @bind-Value="loginModel.Email" Label="Email" InputType="InputType.Email" />
    <MudTextField @bind-Value="loginModel.Password" Label="Password" InputType="InputType.Password" />
    <MudButton ButtonType="ButtonType.Submit" FullWidth="true">Se connecter</MudButton>
</EditForm>

@code {
    private async Task HandleLogin()
    {
        var result = await SignInManager.PasswordSignInAsync(
            loginModel.Email, loginModel.Password, false, false);
        if (result.Succeeded) Navigation.NavigateTo("/");
    }
}
```

## 🐍 Assistant IA Python

### Streamlit App
```python
import streamlit as st
import openai

st.set_page_config(page_title="FormBuilder IA", layout="wide")

def main():
    st.title("🤖 Assistant IA FormBuilder")
    
    with st.sidebar:
        program_type = st.selectbox("Type", ["ACCADJ", "BUYTYP", "PRIMNT", "SRCMNT"])
        model = st.selectbox("Modèle", ["gpt-4", "gpt-3.5-turbo"])
    
    # Chat interface
    if "messages" not in st.session_state:
        st.session_state.messages = []
    
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    if prompt := st.chat_input("Décrivez votre programme..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        response = generate_program(prompt, program_type, model)
        st.session_state.messages.append({"role": "assistant", "content": response})

def generate_program(prompt, program_type, model):
    response = openai.ChatCompletion.create(
        model=model,
        messages=[
            {"role": "system", "content": f"Expert en programmes {program_type}"},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content
```

### API FastAPI
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class GenerateRequest(BaseModel):
    prompt: str
    program_type: str
    model: str = "gpt-4"

@app.post("/api/generate")
async def generate_program(request: GenerateRequest):
    # Logique de génération
    return {"success": True, "program": result}

@app.get("/api/health")
async def health():
    return {"status": "healthy"}
```

## 🔗 Intégration .NET ↔ Python

### Service .NET
```csharp
public class AIAssistantService
{
    private readonly HttpClient _httpClient;
    
    public async Task<string> GenerateProgramAsync(string prompt, string type)
    {
        var request = new { prompt, program_type = type };
        var response = await _httpClient.PostAsJsonAsync("/api/generate", request);
        return await response.Content.ReadAsStringAsync();
    }
}
```

### Component Blazor
```razor
@inject AIAssistantService AIService

<MudButton OnClick="GenerateWithAI" Disabled="isGenerating">
    @if (isGenerating) {
        <MudProgressCircular Size="Size.Small" />
    } else {
        <MudIcon Icon="@Icons.Material.Filled.AutoAwesome" />
    }
    Générer avec IA
</MudButton>

@code {
    private bool isGenerating = false;
    
    private async Task GenerateWithAI()
    {
        isGenerating = true;
        try
        {
            var result = await AIService.GenerateProgramAsync(userPrompt, selectedType);
            // Traitement du résultat
        }
        finally
        {
            isGenerating = false;
        }
    }
}
```

## 🐳 Docker Configuration

### docker-compose.yml
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: formbuilder
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
  
  blazor-app:
    build: ./FormBuilder.BlazorApp
    ports:
      - "5000:80"
    depends_on:
      - postgres
  
  ai-assistant:
    build: ./ai-assistant
    ports:
      - "8501:8501"
```

### Dockerfile Blazor
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
COPY . .
RUN dotnet restore && dotnet publish -c Release -o /app/publish

FROM base AS final
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "FormBuilder.BlazorApp.dll"]
```

## 🧪 Tests

### Test Unitaire
```csharp
[Fact]
public void FormBuilder_RendersCorrectly()
{
    var component = RenderComponent<FormBuilderComponent>();
    Assert.NotNull(component.Find(".component-palette"));
}
```

### Test d'Intégration
```csharp
[Fact]
public async Task CreateProgram_ValidData_ReturnsCreated()
{
    var response = await _client.PostAsJsonAsync("/api/programs", program);
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);
}
```

## 🔧 Dépannage Express

### Erreurs Communes
```bash
# Port déjà utilisé
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Migration échouée
dotnet ef database drop
dotnet ef database update

# Python venv problems
deactivate
rm -rf ai-assistant
python -m venv ai-assistant
```

### Logs Utiles
```csharp
// Serilog configuration
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/app-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();
```

## 📊 Performance

### Optimisations Blazor
```razor
@* Lazy loading *@
<MudTabs Position="Position.Left" LazyLoadPanels="true">
    <MudTabPanel Text="Panel 1">...</MudTabPanel>
</MudTabs>

@* Virtualization pour grandes listes *@
<MudVirtualize Items="@largeDataSet" Context="item">
    <div>@item.Name</div>
</MudVirtualize>
```

### Caching EF Core
```csharp
// Dans le service
public async Task<List<FormDefinition>> GetProgramsAsync()
{
    return await _context.FormDefinitions
        .AsNoTracking()  // Read-only
        .Where(f => f.UserId == userId)
        .OrderByDescending(f => f.CreatedAt)
        .ToListAsync();
}
```

---

**Stack Technologies :**
- **.NET 8.0** + Blazor Server/WebAssembly
- **MudBlazor** pour l'UI moderne
- **Entity Framework Core** + PostgreSQL
- **Python** Streamlit + FastAPI
- **Docker** pour déploiement
- **xUnit** pour les tests