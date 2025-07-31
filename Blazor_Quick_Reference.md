# FormBuilder Pro - Référence Rapide Blazor

## Commandes Essentielles

### Création et Configuration Projet

```bash
# Création solution complète
dotnet new sln -n FormBuilderPro

# Projet Blazor Server
dotnet new blazorserver -n FormBuilder.Blazor -o src/FormBuilder.Blazor

# Projet API (optionnel)
dotnet new webapi -n FormBuilder.Api -o src/FormBuilder.Api

# Projet Shared
dotnet new classlib -n FormBuilder.Shared -o src/FormBuilder.Shared

# Ajout à la solution
dotnet sln add src/FormBuilder.Blazor/FormBuilder.Blazor.csproj
dotnet sln add src/FormBuilder.Api/FormBuilder.Api.csproj
dotnet sln add src/FormBuilder.Shared/FormBuilder.Shared.csproj

# Références entre projets
cd src/FormBuilder.Blazor
dotnet add reference ../FormBuilder.Shared/FormBuilder.Shared.csproj

# Installation packages NuGet
dotnet add package MudBlazor
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
```

### Configuration Environment Python

```bash
# Création environnement virtuel
python -m venv formbuilder_venv

# Activation
# Windows
formbuilder_venv\Scripts\activate
# Linux/Mac
source formbuilder_venv/bin/activate

# Installation packages
pip install streamlit==1.28.0
pip install openai==1.3.0
pip install pandas==2.1.0
pip install python-dotenv==1.0.0
pip install requests==2.31.0

# Sauvegarde requirements
pip freeze > requirements.txt

# Désactivation
deactivate
```

### Configuration Base de Données

```bash
# Installation CLI Entity Framework
dotnet tool install --global dotnet-ef

# Création migration initiale
dotnet ef migrations add InitialCreate

# Application migration
dotnet ef database update

# Migration avec string de connexion spécifique
dotnet ef database update --connection "Host=localhost;Database=formbuilder;Username=postgres;Password=password"

# Suppression dernière migration
dotnet ef migrations remove

# Génération script SQL
dotnet ef migrations script
```

## Templates de Code Rapides

### 1. Composant Blazor Basique

```razor
@* Components/FormBuilder/ComponentTemplate.razor *@
@using MudBlazor
@inject ILogger<ComponentTemplate> Logger
@inject ISnackbar Snackbar

<MudPaper Class="pa-4" Elevation="2">
    <MudText Typo="Typo.h6">@Title</MudText>
    
    @if (IsLoading)
    {
        <MudProgressCircular Indeterminate="true" />
    }
    else
    {
        @ChildContent
    }
</MudPaper>

@code {
    [Parameter] public string Title { get; set; } = "";
    [Parameter] public bool IsLoading { get; set; }
    [Parameter] public RenderFragment ChildContent { get; set; }

    protected override async Task OnInitializedAsync()
    {
        Logger.LogInformation("Component {ComponentName} initialized", nameof(ComponentTemplate));
        await base.OnInitializedAsync();
    }

    private void ShowSuccess(string message)
    {
        Snackbar.Add(message, Severity.Success);
    }

    private void ShowError(string message)
    {
        Snackbar.Add(message, Severity.Error);
    }
}
```

### 2. Service avec DI

```csharp
// Services/IExampleService.cs
public interface IExampleService
{
    Task<List<T>> GetAllAsync<T>() where T : class;
    Task<T> GetByIdAsync<T>(int id) where T : class;
    Task<T> CreateAsync<T>(T entity) where T : class;
    Task<T> UpdateAsync<T>(T entity) where T : class;
    Task DeleteAsync<T>(int id) where T : class;
}

// Services/ExampleService.cs
public class ExampleService : IExampleService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ExampleService> _logger;

    public ExampleService(ApplicationDbContext context, ILogger<ExampleService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<T>> GetAllAsync<T>() where T : class
    {
        try
        {
            return await _context.Set<T>().ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all {EntityType}", typeof(T).Name);
            throw;
        }
    }

    public async Task<T> GetByIdAsync<T>(int id) where T : class
    {
        var entity = await _context.Set<T>().FindAsync(id);
        if (entity == null)
        {
            throw new NotFoundException($"{typeof(T).Name} with id {id} not found");
        }
        return entity;
    }

    public async Task<T> CreateAsync<T>(T entity) where T : class
    {
        _context.Set<T>().Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<T> UpdateAsync<T>(T entity) where T : class
    {
        _context.Set<T>().Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task DeleteAsync<T>(int id) where T : class
    {
        var entity = await GetByIdAsync<T>(id);
        _context.Set<T>().Remove(entity);
        await _context.SaveChangesAsync();
    }
}
```

### 3. Modèle Entity Framework

```csharp
// Models/BaseEntity.cs
public abstract class BaseEntity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string CreatedById { get; set; }
    public ApplicationUser CreatedBy { get; set; }
}

// Models/FormModel.cs
public class FormModel : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string MenuId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Label { get; set; }

    [MaxLength(20)]
    public string FormWidth { get; set; } = "700px";

    [MaxLength(50)]
    public string Layout { get; set; } = "PROCESS";

    public List<FormFieldDto> Fields { get; set; } = new();
    
    public Dictionary<string, object> CustomProperties { get; set; } = new();

    // Relations
    public List<FormField> FormFields { get; set; } = new();
    public List<FormAssignment> Assignments { get; set; } = new();
}
```

### 4. Configuration MudBlazor

```csharp
// Program.cs - Configuration MudBlazor
builder.Services.AddMudServices(config =>
{
    // Configuration Snackbar
    config.SnackbarConfiguration.PositionClass = Defaults.Classes.Position.BottomLeft;
    config.SnackbarConfiguration.PreventDuplicates = false;
    config.SnackbarConfiguration.NewestOnTop = false;
    config.SnackbarConfiguration.ShowCloseIcon = true;
    config.SnackbarConfiguration.VisibleStateDuration = 10000;
    config.SnackbarConfiguration.HideTransitionDuration = 500;
    config.SnackbarConfiguration.ShowTransitionDuration = 500;
    config.SnackbarConfiguration.SnackbarVariant = Variant.Filled;
    
    // Configuration Dialog
    config.DialogConfiguration.CloseButton = true;
    config.DialogConfiguration.BackdropClick = false;
    config.DialogConfiguration.NoHeader = false;
    config.DialogConfiguration.Position = DialogPosition.Center;
    config.DialogConfiguration.MaxWidth = MaxWidth.Medium;
    
    // Configuration Theme
    config.ThemeConfiguration.DefaultTheme = new MudTheme()
    {
        Palette = new PaletteLight()
        {
            Primary = "#1976d2",
            Secondary = "#dc004e",
            AppbarBackground = "#1976d2",
            Success = "#4caf50",
            Error = "#f44336",
            Warning = "#ff9800",
            Info = "#2196f3"
        },
        PaletteDark = new PaletteDark()
        {
            Primary = "#90caf9",
            Secondary = "#f48fb1",
            AppbarBackground = "#424242",
            Success = "#66bb6a",
            Error = "#ef5350",
            Warning = "#ffb74d",
            Info = "#42a5f5"
        }
    };
});
```

### 5. Layout Principal

```razor
@* Shared/MainLayout.razor *@
@using MudBlazor
@inherits LayoutView

<MudThemeProvider />
<MudDialogProvider />
<MudSnackbarProvider />

<MudLayout>
    <MudAppBar Elevation="1">
        <MudIconButton Icon="Icons.Material.Filled.Menu" 
                       Color="Color.Inherit" 
                       Edge="Edge.Start" 
                       OnClick="@((e) => DrawerToggle())" />
        <MudSpacer />
        <MudText Typo="Typo.h5" Class="ml-3">FormBuilder Pro</MudText>
        <MudSpacer />
        <MudIconButton Icon="Icons.Material.Filled.Brightness4" 
                       Color="Color.Inherit" 
                       OnClick="@((e) => DarkModeToggle())" />
        <AuthorizeView>
            <Authorized>
                <MudMenu Icon="Icons.Material.Filled.AccountCircle" Color="Color.Inherit">
                    <MudMenuItem>Profile</MudMenuItem>
                    <MudMenuItem>Settings</MudMenuItem>
                    <MudDivider />
                    <MudMenuItem>Logout</MudMenuItem>
                </MudMenu>
            </Authorized>
            <NotAuthorized>
                <MudButton Href="/Account/Login" Color="Color.Inherit">Login</MudButton>
            </NotAuthorized>
        </AuthorizeView>
    </MudAppBar>
    
    <MudDrawer @bind-Open="_drawerOpen" ClipMode="DrawerClipMode.Always" Elevation="2">
        <NavMenu />
    </MudDrawer>
    
    <MudMainContent>
        <MudContainer MaxWidth="MaxWidth.ExtraExtraLarge" Class="my-4">
            @Body
        </MudContainer>
    </MudMainContent>
</MudLayout>

@code {
    private bool _drawerOpen = true;
    private bool _darkMode = false;

    private void DrawerToggle()
    {
        _drawerOpen = !_drawerOpen;
    }

    private void DarkModeToggle()
    {
        _darkMode = !_darkMode;
    }
}
```

### 6. Composant Formulaire avec Validation

```razor
@* Components/Forms/FormBuilder.razor *@
@using FluentValidation
@inject IFormBuilderService FormService
@inject ISnackbar Snackbar

<EditForm Model="@FormModel" OnValidSubmit="@HandleValidSubmit">
    <FluentValidationValidator />
    
    <MudGrid>
        <MudItem xs="12" md="6">
            <MudTextField @bind-Value="FormModel.Label" 
                          Label="Form Label" 
                          Required="true"
                          For="@(() => FormModel.Label)" />
        </MudItem>
        
        <MudItem xs="12" md="6">
            <MudTextField @bind-Value="FormModel.MenuId" 
                          Label="Menu ID" 
                          Required="true"
                          For="@(() => FormModel.MenuId)" />
        </MudItem>
        
        <MudItem xs="12" md="6">
            <MudSelect @bind-Value="FormModel.Layout" 
                       Label="Layout" 
                       Required="true"
                       For="@(() => FormModel.Layout)">
                <MudSelectItem Value="PROCESS">Process</MudSelectItem>
                <MudSelectItem Value="MASTERMENU">Master Menu</MudSelectItem>
                <MudSelectItem Value="DIALOG">Dialog</MudSelectItem>
            </MudSelect>
        </MudItem>
        
        <MudItem xs="12" md="6">
            <MudTextField @bind-Value="FormModel.FormWidth" 
                          Label="Form Width" 
                          For="@(() => FormModel.FormWidth)" />
        </MudItem>
        
        <MudItem xs="12">
            <MudButton ButtonType="ButtonType.Submit" 
                       Variant="Variant.Filled" 
                       Color="Color.Primary"
                       Disabled="@IsProcessing">
                @if (IsProcessing)
                {
                    <MudProgressCircular Class="ms-n1" Size="Size.Small" Indeterminate="true" />
                    <MudText Class="ms-2">Saving...</MudText>
                }
                else
                {
                    <MudText>Save Form</MudText>
                }
            </MudButton>
        </MudItem>
    </MudGrid>
</EditForm>

@code {
    [Parameter] public CreateFormDto FormModel { get; set; } = new();
    [Parameter] public EventCallback<FormModel> OnFormSaved { get; set; }
    
    private bool IsProcessing = false;

    private async Task HandleValidSubmit()
    {
        IsProcessing = true;
        
        try
        {
            var savedForm = await FormService.CreateFormAsync(FormModel);
            Snackbar.Add("Form saved successfully!", Severity.Success);
            await OnFormSaved.InvokeAsync(savedForm);
        }
        catch (Exception ex)
        {
            Snackbar.Add($"Error saving form: {ex.Message}", Severity.Error);
        }
        finally
        {
            IsProcessing = false;
        }
    }
}
```

### 7. Streamlit App Basique

```python
# streamlit_app.py
import streamlit as st
import requests
import json
from datetime import datetime

# Configuration page
st.set_page_config(
    page_title="FormBuilder AI Assistant",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

class FormBuilderAI:
    def __init__(self):
        self.api_base = st.secrets.get("API_BASE_URL", "http://localhost:5000/api")
    
    def generate_form(self, form_type: str) -> dict:
        """Génère un formulaire basé sur le type"""
        templates = {
            "BUYTYP": {
                "menuId": f"BUYTYP_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "label": "Buy Type Management",
                "formWidth": "600px",
                "layout": "PROCESS",
                "fields": [
                    {
                        "Type": "TEXT",
                        "Label": "Buy Type Code",
                        "DataField": "Code",
                        "Required": True,
                        "MaxLength": 10
                    },
                    {
                        "Type": "TEXT", 
                        "Label": "Description",
                        "DataField": "Description",
                        "Required": True,
                        "MaxLength": 100
                    },
                    {
                        "Type": "CHECKBOX",
                        "Label": "Is Active",
                        "DataField": "IsActive",
                        "Value": True
                    }
                ]
            }
        }
        return templates.get(form_type, {})
    
    def send_to_blazor(self, form_data: dict) -> bool:
        """Envoi vers API Blazor"""
        try:
            response = requests.post(
                f"{self.api_base}/forms",
                json=form_data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            return response.status_code == 201
        except Exception as e:
            st.error(f"Erreur envoi API: {str(e)}")
            return False

def main():
    st.title("🤖 FormBuilder AI Assistant")
    st.markdown("---")
    
    # Initialiser l'assistant
    if 'ai_assistant' not in st.session_state:
        st.session_state.ai_assistant = FormBuilderAI()
    
    # Sidebar pour actions rapides
    with st.sidebar:
        st.header("🛠️ Actions Rapides")
        
        form_type = st.selectbox(
            "Type de formulaire",
            ["BUYTYP", "ACCADJ", "PRIMNT", "SRCMNT"]
        )
        
        if st.button("🚀 Générer", type="primary"):
            with st.spinner("Génération..."):
                form_config = st.session_state.ai_assistant.generate_form(form_type)
                
                if form_config:
                    st.success("✅ Formulaire généré!")
                    st.json(form_config)
                    
                    if st.button("📤 Envoyer vers Blazor"):
                        if st.session_state.ai_assistant.send_to_blazor(form_config):
                            st.success("✅ Envoyé vers FormBuilder!")
                        else:
                            st.error("❌ Erreur d'envoi")
    
    # Zone principale
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.header("💬 Chat Assistant")
        
        if "messages" not in st.session_state:
            st.session_state.messages = []
        
        for message in st.session_state.messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])
        
        if prompt := st.chat_input("Que voulez-vous créer ?"):
            st.session_state.messages.append({"role": "user", "content": prompt})
            
            with st.chat_message("user"):
                st.markdown(prompt)
            
            with st.chat_message("assistant"):
                response = f"Vous avez demandé: {prompt}. Je génère le formulaire..."
                st.markdown(response)
                st.session_state.messages.append({"role": "assistant", "content": response})
    
    with col2:
        st.header("📊 Statistiques")
        st.metric("Formulaires générés", len(st.session_state.get('generated_forms', [])))
        st.metric("Messages échangés", len(st.session_state.get('messages', [])))

if __name__ == "__main__":
    main()
```

### 8. Scripts Utilitaires

```bash
#!/bin/bash
# scripts/start-dev.sh

echo "🚀 Démarrage FormBuilder Pro - Environnement de développement"

# Vérifications prérequis
command -v dotnet >/dev/null 2>&1 || { echo "❌ .NET Core requis"; exit 1; }
command -v python >/dev/null 2>&1 || { echo "❌ Python requis"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js requis"; exit 1; }

# Démarrage services
echo "📡 Démarrage API..."
cd src/FormBuilder.Api && dotnet run --urls "http://localhost:5000" &
API_PID=$!

echo "🔥 Démarrage Blazor..."
cd ../FormBuilder.Blazor && dotnet run --urls "http://localhost:5001" &
BLAZOR_PID=$!

echo "🤖 Démarrage IA Assistant..."
cd ../../ai && source formbuilder_venv/bin/activate && streamlit run streamlit_app.py --server.port 8501 &
AI_PID=$!

echo "⚡ Démarrage Vite.js..."
cd ../frontend-assets && npm run dev &
VITE_PID=$!

echo "✅ Services démarrés:"
echo "   - Blazor Server : http://localhost:5001"
echo "   - API .NET Core : http://localhost:5000"
echo "   - IA Assistant  : http://localhost:8501"
echo "   - Vite.js       : http://localhost:3000"

# Fonction d'arrêt
cleanup() {
    echo "🛑 Arrêt des services..."
    kill $API_PID $BLAZOR_PID $AI_PID $VITE_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT
wait
```

## Configuration appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=formbuilder;Username=postgres;Password=password"
  },
  "AiService": {
    "BaseUrl": "http://localhost:8501",
    "ApiKey": "your-openai-key",
    "Timeout": "00:05:00"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Warning"
    }
  },
  "AllowedHosts": "*",
  "MudBlazor": {
    "DefaultTheme": "Light",
    "EnableRipple": true,
    "EnableTouchSupport": true
  }
}
```

Cette référence rapide couvre les éléments essentiels pour développer efficacement avec la stack Blazor pure.