# FormBuilder Pro - Développement avec Stack Technologique Pure

## Architecture Recommandée : Technologies Spécifiques Uniquement

Cette documentation explique comment développer FormBuilder Pro en utilisant exclusivement :
- **Blazor Server/WebAssembly** pour l'interface utilisateur
- **MudBlazor** pour les composants UI
- **Python (venv)** pour l'intelligence artificielle
- **.NET Core** pour le backend API
- **PostgreSQL** pour la base de données
- **Streamlit** pour l'interface IA
- **Vite.js** pour le build et le développement

## 1. Structure du Projet Pure

```
FormBuilderPro/
├── FormBuilder.Blazor/           # Application Blazor Server
│   ├── Components/
│   │   ├── FormBuilder/          # Composants form builder
│   │   ├── MfactComponents/      # Composants MFact
│   │   └── Shared/              # Layout et navigation
│   ├── Pages/                   # Pages Blazor
│   ├── Services/                # Services Blazor
│   └── Program.cs              # Configuration Blazor
├── FormBuilder.Api/             # API .NET Core 8
│   ├── Controllers/            # Contrôleurs REST API
│   ├── Models/                 # Modèles de données
│   ├── Services/               # Services métier
│   └── Data/                   # Context Entity Framework
├── FormBuilder.AI/             # Assistant IA Python
│   ├── venv/                   # Environnement virtuel Python
│   ├── streamlit_app.py        # Interface Streamlit
│   ├── ai_services.py          # Services IA
│   └── requirements.txt        # Dépendances Python
├── FormBuilder.Shared/         # Modèles partagés .NET
│   ├── Models/                 # DTOs et entités
│   └── Enums/                  # Énumérations
└── vite.config.js             # Configuration Vite.js pour assets
```

## 2. Blazor Server avec MudBlazor - Frontend Principal

### Configuration Blazor Server

```csharp
// Program.cs - Configuration Blazor Server
using MudBlazor.Services;
using FormBuilder.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Services Blazor
builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();

// MudBlazor
builder.Services.AddMudServices();

// Entity Framework + PostgreSQL
builder.Services.AddDbContext<FormBuilderContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Services métier
builder.Services.AddScoped<IFormService, FormService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddHttpClient<AiAssistantService>();

var app = builder.Build();

// Pipeline
app.UseStaticFiles();
app.UseRouting();

app.MapBlazorHub();
app.MapFallbackToPage("/_Host");
app.MapControllers();

app.Run();
```

### Composant Form Builder Principal (Blazor)

```razor
@page "/form-builder"
@using MudBlazor
@using FormBuilder.Shared.Models
@inject IFormService FormService
@inject IJSRuntime JS

<MudContainer MaxWidth="MaxWidth.ExtraExtraLarge" Class="pa-4">
    <MudGrid>
        <!-- Palette de Composants -->
        <MudItem xs="3">
            <MudPaper Class="pa-4" Style="height: 100vh; overflow-y: auto;">
                <MudText Typo="Typo.h6" Class="mb-4">Composants</MudText>
                
                <MudExpansionPanels Elevation="0">
                    <MudExpansionPanel Text="Lookup Components">
                        @foreach (var component in GetLookupComponents())
                        {
                            <MudChip Draggable="true" 
                                     Color="Color.Primary" 
                                     Variant="Variant.Outlined"
                                     Class="ma-1"
                                     @ondragstart="@(() => OnDragStart(component))">
                                @component.Icon @component.Label
                            </MudChip>
                        }
                    </MudExpansionPanel>
                    
                    <MudExpansionPanel Text="Selection Controls">
                        @foreach (var component in GetSelectionComponents())
                        {
                            <MudChip Draggable="true" 
                                     Color="Color.Secondary" 
                                     Variant="Variant.Outlined"
                                     Class="ma-1"
                                     @ondragstart="@(() => OnDragStart(component))">
                                @component.Icon @component.Label
                            </MudChip>
                        }
                    </MudExpansionPanel>
                    
                    <MudExpansionPanel Text="Date & Time">
                        @foreach (var component in GetDateTimeComponents())
                        {
                            <MudChip Draggable="true" 
                                     Color="Color.Tertiary" 
                                     Variant="Variant.Outlined"
                                     Class="ma-1"
                                     @ondragstart="@(() => OnDragStart(component))">
                                @component.Icon @component.Label
                            </MudChip>
                        }
                    </MudExpansionPanel>
                </MudExpansionPanels>
            </MudPaper>
        </MudItem>

        <!-- Zone de Construction -->
        <MudItem xs="6">
            <MudPaper Class="pa-4" Style="height: 100vh; overflow-y: auto;">
                <MudText Typo="Typo.h6" Class="mb-4">Construction Zone</MudText>
                
                <div @ondrop="OnDrop" @ondragover="OnDragOver" @ondragover:preventDefault="true"
                     style="min-height: 80vh; border: 2px dashed #ccc; border-radius: 8px; padding: 16px;">
                    
                    @if (FormFields.Any())
                    {
                        @foreach (var field in FormFields)
                        {
                            <MudCard Class="ma-2" Style="position: relative;">
                                <MudCardContent>
                                    @RenderFormField(field)
                                </MudCardContent>
                                <MudCardActions>
                                    <MudIconButton Icon="Icons.Material.Filled.Edit" 
                                                   Color="Color.Primary" 
                                                   OnClick="@(() => EditField(field))" />
                                    <MudIconButton Icon="Icons.Material.Filled.Delete" 
                                                   Color="Color.Error" 
                                                   OnClick="@(() => DeleteField(field))" />
                                </MudCardActions>
                            </MudCard>
                        }
                    }
                    else
                    {
                        <MudText Typo="Typo.body1" Align="Align.Center" Class="mt-16">
                            Glissez des composants ici pour construire votre formulaire
                        </MudText>
                    }
                </div>
            </MudPaper>
        </MudItem>

        <!-- Panneau Propriétés -->
        <MudItem xs="3">
            <MudPaper Class="pa-4" Style="height: 100vh; overflow-y: auto;">
                <MudText Typo="Typo.h6" Class="mb-4">Propriétés</MudText>
                
                @if (SelectedField != null)
                {
                    <MudForm @ref="propertyForm">
                        <MudTextField @bind-Value="SelectedField.Label" 
                                      Label="Label" 
                                      Required="true" />
                        
                        <MudTextField @bind-Value="SelectedField.DataField" 
                                      Label="Data Field" 
                                      Required="true" />
                        
                        <MudTextField @bind-Value="SelectedField.Entity" 
                                      Label="Entity" />
                        
                        <MudSlider @bind-Value="SelectedField.Width" 
                                   Min="10" Max="100" 
                                   Step="5"
                                   Label="Width (%)" />
                        
                        <MudSwitch @bind-Checked="SelectedField.Required" 
                                   Label="Required" 
                                   Color="Color.Primary" />
                        
                        <MudSwitch @bind-Checked="SelectedField.Inline" 
                                   Label="Inline" 
                                   Color="Color.Secondary" />

                        @* Propriétés spécifiques selon le type *@
                        @if (SelectedField.Type == "GRIDLKP")
                        {
                            <MudDivider Class="my-4" />
                            <MudText Typo="Typo.subtitle1">GRIDLKP Properties</MudText>
                            
                            <MudSelect @bind-Value="SelectedField.LoadDataInfo_DataModel" 
                                       Label="Data Model" 
                                       T="string">
                                <MudSelectItem Value="ACCADJ">ACCADJ - Account Adjustments</MudSelectItem>
                                <MudSelectItem Value="BUYTYP">BUYTYP - Buy Types</MudSelectItem>
                                <MudSelectItem Value="PRIMNT">PRIMNT - Prime Interest</MudSelectItem>
                                <MudSelectItem Value="SRCMNT">SRCMNT - Source Management</MudSelectItem>
                            </MudSelect>
                            
                            <MudTextField @bind-Value="SelectedField.KeyColumn" 
                                          Label="Key Column" />
                        }

                        <MudButton Variant="Variant.Filled" 
                                   Color="Color.Primary" 
                                   FullWidth="true"
                                   Class="mt-4"
                                   OnClick="UpdateFieldProperties">
                            Mettre à jour
                        </MudButton>
                    </MudForm>
                }
                else
                {
                    <MudText Typo="Typo.body2" Align="Align.Center">
                        Sélectionnez un composant pour voir ses propriétés
                    </MudText>
                }
            </MudPaper>
        </MudItem>
    </MudGrid>
</MudContainer>

@code {
    private List<FormFieldModel> FormFields = new();
    private FormFieldModel? SelectedField;
    private MudForm propertyForm;
    private ComponentModel draggedComponent;

    protected override async Task OnInitializedAsync()
    {
        // Charger les formulaires existants si nécessaire
        await LoadExistingForm();
    }

    private void OnDragStart(ComponentModel component)
    {
        draggedComponent = component;
    }

    private void OnDragOver(DragEventArgs e)
    {
        e.DataTransfer.DropEffect = "copy";
    }

    private async Task OnDrop(DragEventArgs e)
    {
        if (draggedComponent != null)
        {
            var newField = new FormFieldModel
            {
                Id = Guid.NewGuid().ToString(),
                Type = draggedComponent.Type,
                Label = draggedComponent.Label,
                DataField = $"field_{DateTime.Now.Ticks}",
                Entity = "TableName",
                Width = 100,
                Required = false,
                Inline = false
            };

            FormFields.Add(newField);
            StateHasChanged();
        }
    }

    private RenderFragment RenderFormField(FormFieldModel field) => builder =>
    {
        switch (field.Type)
        {
            case "GRIDLKP":
                builder.OpenComponent<MudDataGrid<object>>(0);
                builder.AddAttribute(1, "Items", new List<object>());
                builder.AddAttribute(2, "Dense", true);
                builder.AddAttribute(3, "Hover", true);
                builder.CloseComponent();
                break;

            case "SELECT":
                builder.OpenComponent<MudSelect<string>>(0);
                builder.AddAttribute(1, "Label", field.Label);
                builder.AddAttribute(2, "Variant", Variant.Outlined);
                builder.CloseComponent();
                break;

            case "TEXT":
                builder.OpenComponent<MudTextField<string>>(0);
                builder.AddAttribute(1, "Label", field.Label);
                builder.AddAttribute(2, "Variant", Variant.Outlined);
                builder.AddAttribute(3, "Required", field.Required);
                builder.CloseComponent();
                break;

            case "CHECKBOX":
                builder.OpenComponent<MudCheckBox<bool>>(0);
                builder.AddAttribute(1, "Label", field.Label);
                builder.AddAttribute(2, "Color", Color.Primary);
                builder.CloseComponent();
                break;

            case "DATEPKR":
                builder.OpenComponent<MudDatePicker>(0);
                builder.AddAttribute(1, "Label", field.Label);
                builder.AddAttribute(2, "Variant", Variant.Outlined);
                builder.CloseComponent();
                break;
        }
    };

    private List<ComponentModel> GetLookupComponents()
    {
        return new List<ComponentModel>
        {
            new ComponentModel { Type = "GRIDLKP", Label = "Grid Lookup", Icon = "🗂️" },
            new ComponentModel { Type = "LSTLKP", Label = "List Lookup", Icon = "📋" }
        };
    }

    private List<ComponentModel> GetSelectionComponents()
    {
        return new List<ComponentModel>
        {
            new ComponentModel { Type = "SELECT", Label = "Select", Icon = "🔽" },
            new ComponentModel { Type = "RADIOGRP", Label = "Radio Group", Icon = "🔘" },
            new ComponentModel { Type = "CHECKBOX", Label = "Checkbox", Icon = "☑️" }
        };
    }

    private List<ComponentModel> GetDateTimeComponents()
    {
        return new List<ComponentModel>
        {
            new ComponentModel { Type = "DATEPKR", Label = "Date Picker", Icon = "📅" },
            new ComponentModel { Type = "DATEPICKER", Label = "Date Picker Enhanced", Icon = "📆" }
        };
    }

    private void EditField(FormFieldModel field)
    {
        SelectedField = field;
    }

    private void DeleteField(FormFieldModel field)
    {
        FormFields.Remove(field);
        if (SelectedField == field)
            SelectedField = null;
        StateHasChanged();
    }

    private async Task UpdateFieldProperties()
    {
        if (SelectedField != null)
        {
            // Validation du formulaire
            await propertyForm.Validate();
            
            if (propertyForm.IsValid)
            {
                // Sauvegarder les changements
                await SaveForm();
                StateHasChanged();
            }
        }
    }

    private async Task LoadExistingForm()
    {
        // Logique pour charger un formulaire existant
    }

    private async Task SaveForm()
    {
        var formDto = new FormDto
        {
            MenuId = $"FORM_{DateTime.Now.Ticks}",
            Label = "My Form",
            FormWidth = "700px",
            Layout = "PROCESS",
            Fields = FormFields
        };

        await FormService.SaveFormAsync(formDto);
    }

    public class ComponentModel
    {
        public string Type { get; set; }
        public string Label { get; set; }
        public string Icon { get; set; }
    }
}
```

## 3. API .NET Core - Backend

### Configuration Entity Framework avec PostgreSQL

```csharp
// Data/FormBuilderContext.cs
using Microsoft.EntityFrameworkCore;
using FormBuilder.Shared.Models;

public class FormBuilderContext : DbContext
{
    public FormBuilderContext(DbContextOptions<FormBuilderContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Form> Forms { get; set; }
    public DbSet<FormField> FormFields { get; set; }
    public DbSet<Notification> Notifications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuration User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Role).HasDefaultValue("user");
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Configuration Form
        modelBuilder.Entity<Form>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.MenuId).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Label).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Fields).HasColumnType("jsonb");
            
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Forms)
                  .HasForeignKey(e => e.UserId);
        });

        // Configuration FormField
        modelBuilder.Entity<FormField>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Properties).HasColumnType("jsonb");
            
            entity.HasOne(e => e.Form)
                  .WithMany(f => f.FormFields)
                  .HasForeignKey(e => e.FormId);
        });

        base.OnModelCreating(modelBuilder);
    }
}
```

### Contrôleur API Forms

```csharp
// Controllers/FormsController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FormBuilder.Api.Data;
using FormBuilder.Shared.Models;

[ApiController]
[Route("api/[controller]")]
public class FormsController : ControllerBase
{
    private readonly FormBuilderContext _context;
    private readonly ILogger<FormsController> _logger;

    public FormsController(FormBuilderContext context, ILogger<FormsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FormDto>>> GetForms()
    {
        var forms = await _context.Forms
            .Include(f => f.User)
            .Include(f => f.FormFields)
            .Select(f => new FormDto
            {
                Id = f.Id,
                MenuId = f.MenuId,
                Label = f.Label,
                FormWidth = f.FormWidth,
                Layout = f.Layout,
                Fields = f.FormFields.Select(ff => new FormFieldModel
                {
                    Id = ff.Id,
                    Type = ff.Type,
                    Label = ff.Label,
                    DataField = ff.DataField,
                    Entity = ff.Entity,
                    Width = ff.Width,
                    Required = ff.Required,
                    Inline = ff.Inline,
                    Properties = ff.Properties
                }).ToList(),
                CreatedAt = f.CreatedAt,
                UpdatedAt = f.UpdatedAt,
                UserEmail = f.User.Email
            })
            .ToListAsync();

        return Ok(forms);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FormDto>> GetForm(int id)
    {
        var form = await _context.Forms
            .Include(f => f.User)
            .Include(f => f.FormFields)
            .FirstOrDefaultAsync(f => f.Id == id);

        if (form == null)
            return NotFound();

        var formDto = new FormDto
        {
            Id = form.Id,
            MenuId = form.MenuId,
            Label = form.Label,
            FormWidth = form.FormWidth,
            Layout = form.Layout,
            Fields = form.FormFields.Select(ff => new FormFieldModel
            {
                Id = ff.Id,
                Type = ff.Type,
                Label = ff.Label,
                DataField = ff.DataField,
                Entity = ff.Entity,
                Width = ff.Width,
                Required = ff.Required,
                Inline = ff.Inline,
                Properties = ff.Properties
            }).ToList(),
            CreatedAt = form.CreatedAt,
            UpdatedAt = form.UpdatedAt,
            UserEmail = form.User?.Email
        };

        return Ok(formDto);
    }

    [HttpPost]
    public async Task<ActionResult<FormDto>> CreateForm(CreateFormDto createFormDto)
    {
        var form = new Form
        {
            MenuId = createFormDto.MenuId,
            Label = createFormDto.Label,
            FormWidth = createFormDto.FormWidth ?? "700px",
            Layout = createFormDto.Layout ?? "PROCESS",
            UserId = createFormDto.UserId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Forms.Add(form);
        await _context.SaveChangesAsync();

        // Ajouter les champs
        if (createFormDto.Fields?.Any() == true)
        {
            var formFields = createFormDto.Fields.Select(f => new FormField
            {
                FormId = form.Id,
                Type = f.Type,
                Label = f.Label,
                DataField = f.DataField,
                Entity = f.Entity,
                Width = f.Width,
                Required = f.Required,
                Inline = f.Inline,
                Properties = f.Properties
            });

            _context.FormFields.AddRange(formFields);
            await _context.SaveChangesAsync();
        }

        return CreatedAtAction(nameof(GetForm), new { id = form.Id }, 
            await GetForm(form.Id));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateForm(int id, UpdateFormDto updateFormDto)
    {
        var form = await _context.Forms
            .Include(f => f.FormFields)
            .FirstOrDefaultAsync(f => f.Id == id);

        if (form == null)
            return NotFound();

        // Mettre à jour les propriétés du formulaire
        form.Label = updateFormDto.Label;
        form.FormWidth = updateFormDto.FormWidth;
        form.Layout = updateFormDto.Layout;
        form.UpdatedAt = DateTime.UtcNow;

        // Supprimer les anciens champs
        _context.FormFields.RemoveRange(form.FormFields);

        // Ajouter les nouveaux champs
        if (updateFormDto.Fields?.Any() == true)
        {
            var formFields = updateFormDto.Fields.Select(f => new FormField
            {
                FormId = form.Id,
                Type = f.Type,
                Label = f.Label,
                DataField = f.DataField,
                Entity = f.Entity,
                Width = f.Width,
                Required = f.Required,
                Inline = f.Inline,
                Properties = f.Properties
            });

            _context.FormFields.AddRange(formFields);
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteForm(int id)
    {
        var form = await _context.Forms.FindAsync(id);
        if (form == null)
            return NotFound();

        _context.Forms.Remove(form);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
```

## 4. Assistant IA Python avec Streamlit

### Configuration Environment Virtuel

```bash
# Création de l'environnement virtuel
python -m venv formbuilder_venv

# Activation (Windows)
formbuilder_venv\Scripts\activate

# Activation (Linux/Mac)
source formbuilder_venv/bin/activate

# Installation des dépendances
pip install streamlit openai pandas python-dotenv requests
pip freeze > requirements.txt
```

### Interface Streamlit IA

```python
# streamlit_app.py
import streamlit as st
import openai
import json
import requests
from pathlib import Path
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Configuration OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

# Configuration de la page
st.set_page_config(
    page_title="Alex - FormBuilder AI Assistant",
    page_icon="🤖",
    layout="wide"
)

class FormBuilderAI:
    def __init__(self):
        self.api_base_url = os.getenv("API_BASE_URL", "http://localhost:5000/api")
        
    def analyze_dfm_file(self, dfm_content: str) -> dict:
        """Analyse un fichier DFM et génère une configuration de formulaire"""
        
        system_prompt = """
        Vous êtes un expert en conversion de fichiers DFM (Delphi Form Files) vers des configurations JSON de formulaires modernes.
        
        Analysez le contenu DFM fourni et générez une configuration JSON avec :
        - menuId : identifiant unique du formulaire
        - label : nom descriptif du formulaire
        - formWidth : largeur recommandée
        - layout : type de layout (PROCESS, MASTERMENU, etc.)
        - fields : tableau des champs avec leurs propriétés complètes
        
        Types de composants supportés :
        - GRIDLKP : Grid avec lookup
        - LSTLKP : Liste avec lookup
        - SELECT : Sélection simple
        - TEXT : Champ texte
        - CHECKBOX : Case à cocher
        - DATEPKR : Sélecteur de date
        - RADIOGRP : Groupe de radio boutons
        - GROUP : Groupe de champs
        """
        
        try:
            response = openai.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Analysez ce fichier DFM et générez la configuration JSON correspondante :\n\n{dfm_content}"}
                ],
                temperature=0.1
            )
            
            # Parser la réponse JSON
            json_response = response.choices[0].message.content
            
            # Extraire le JSON de la réponse
            start_idx = json_response.find('{')
            end_idx = json_response.rfind('}') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = json_response[start_idx:end_idx]
                return json.loads(json_str)
            else:
                return {"error": "Impossible d'extraire le JSON de la réponse"}
                
        except Exception as e:
            return {"error": f"Erreur lors de l'analyse : {str(e)}"}
    
    def generate_form_by_type(self, form_type: str) -> dict:
        """Génère un formulaire basé sur un type MFact spécifique"""
        
        templates = {
            "BUYTYP": {
                "menuId": "BUYTYP_GENERATED",
                "label": "Buy Type Management",
                "formWidth": "600px",
                "layout": "PROCESS",
                "fields": [
                    {
                        "Id": "BUYTYP_CODE",
                        "Type": "TEXT",
                        "Label": "Buy Type Code",
                        "DataField": "Code",
                        "Entity": "BUYTYP",
                        "Width": 50,
                        "Required": True,
                        "MaxLength": 10
                    },
                    {
                        "Id": "BUYTYP_DESC",
                        "Type": "TEXT",
                        "Label": "Description",
                        "DataField": "Description",
                        "Entity": "BUYTYP",
                        "Width": 100,
                        "Required": True,
                        "MaxLength": 100
                    },
                    {
                        "Id": "BUYTYP_ACTIVE",
                        "Type": "CHECKBOX",
                        "Label": "Is Active",
                        "DataField": "IsActive",
                        "Entity": "BUYTYP",
                        "Width": 30,
                        "Value": True
                    }
                ]
            },
            "ACCADJ": {
                "menuId": "ACCADJ_GENERATED",
                "label": "Account Adjustments",
                "formWidth": "800px",
                "layout": "PROCESS",
                "fields": [
                    {
                        "Id": "ACCADJ_GRID",
                        "Type": "GRIDLKP",
                        "Label": "Account Adjustments Grid",
                        "DataField": "AdjustmentData",
                        "Entity": "ACCADJ",
                        "Width": 100,
                        "LoadDataInfo_DataModel": "ACCADJ",
                        "KeyColumn": "Id",
                        "ColumnsDefinition": [
                            {"DataField": "Id", "Caption": "ID", "DataType": "Integer", "Visible": True},
                            {"DataField": "AccountCode", "Caption": "Account", "DataType": "String", "Visible": True},
                            {"DataField": "Amount", "Caption": "Amount", "DataType": "Decimal", "Visible": True},
                            {"DataField": "Description", "Caption": "Description", "DataType": "String", "Visible": True}
                        ]
                    }
                ]
            },
            "PRIMNT": {
                "menuId": "PRIMNT_GENERATED", 
                "label": "Prime Interest Management",
                "formWidth": "700px",
                "layout": "MASTERMENU",
                "fields": [
                    {
                        "Id": "PRIMNT_LIST",
                        "Type": "LSTLKP",
                        "Label": "Prime Interest List",
                        "DataField": "PrimeData",
                        "Entity": "PRIMNT",
                        "Width": 60,
                        "LoadDataInfo": {"DataModel": "PRIMNT", "Filter": "IsActive = true"},
                        "ItemInfo": {"ValueField": "Id", "DisplayField": "Description"}
                    },
                    {
                        "Id": "PRIMNT_RATE",
                        "Type": "TEXT",
                        "Label": "Interest Rate (%)",
                        "DataField": "Rate",
                        "Entity": "PRIMNT",
                        "Width": 40,
                        "Required": True,
                        "DataType": "Decimal"
                    }
                ]
            }
        }
        
        return templates.get(form_type, {"error": f"Type de formulaire {form_type} non supporté"})
    
    def send_to_blazor_api(self, form_data: dict) -> bool:
        """Envoie la configuration du formulaire à l'API .NET Core"""
        try:
            response = requests.post(
                f"{self.api_base_url}/forms",
                json=form_data,
                headers={"Content-Type": "application/json"}
            )
            return response.status_code == 201
        except Exception as e:
            st.error(f"Erreur lors de l'envoi à l'API : {str(e)}")
            return False

def main():
    st.title("🤖 Alex - FormBuilder AI Assistant")
    st.markdown("Assistant IA intelligent pour la génération de formulaires MFact")
    
    # Initialiser l'assistant IA
    if 'ai_assistant' not in st.session_state:
        st.session_state.ai_assistant = FormBuilderAI()
    
    # Interface en colonnes
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.header("💬 Chat Assistant")
        
        # Historique des messages
        if "messages" not in st.session_state:
            st.session_state.messages = [
                {"role": "assistant", "content": "Bonjour ! Je suis Alex, votre assistant IA pour la création de formulaires. Comment puis-je vous aider aujourd'hui ?"}
            ]
        
        # Afficher les messages
        for message in st.session_state.messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])
        
        # Input utilisateur
        if prompt := st.chat_input("Tapez votre message..."):
            st.session_state.messages.append({"role": "user", "content": prompt})
            
            with st.chat_message("user"):
                st.markdown(prompt)
            
            # Traitement de la demande
            with st.chat_message("assistant"):
                with st.spinner("Génération en cours..."):
                    response = process_user_request(prompt, st.session_state.ai_assistant)
                    st.markdown(response)
                    st.session_state.messages.append({"role": "assistant", "content": response})
    
    with col2:
        st.header("🛠️ Outils Rapides")
        
        # Génération rapide de formulaires
        st.subheader("Génération Rapide")
        
        form_type = st.selectbox(
            "Type de formulaire",
            ["BUYTYP", "ACCADJ", "PRIMNT", "SRCMNT"],
            help="Sélectionnez un type de formulaire MFact"
        )
        
        if st.button("🚀 Générer Formulaire", type="primary"):
            with st.spinner("Génération..."):
                form_config = st.session_state.ai_assistant.generate_form_by_type(form_type)
                
                if "error" not in form_config:
                    st.success(f"Formulaire {form_type} généré avec succès !")
                    
                    # Afficher le JSON généré
                    with st.expander("Voir la configuration JSON"):
                        st.json(form_config)
                    
                    # Option pour envoyer à l'API Blazor
                    if st.button("📤 Envoyer vers FormBuilder"):
                        if st.session_state.ai_assistant.send_to_blazor_api(form_config):
                            st.success("Formulaire envoyé avec succès vers FormBuilder !")
                        else:
                            st.error("Erreur lors de l'envoi vers FormBuilder")
                else:
                    st.error(form_config["error"])
        
        # Upload de fichier DFM
        st.subheader("Analyse DFM")
        
        uploaded_file = st.file_uploader(
            "Charger un fichier DFM",
            type=['dfm', 'txt'],
            help="Chargez un fichier DFM Delphi pour analyse automatique"
        )
        
        if uploaded_file is not None:
            dfm_content = str(uploaded_file.read(), "utf-8")
            
            if st.button("🔍 Analyser DFM"):
                with st.spinner("Analyse en cours..."):
                    analysis_result = st.session_state.ai_assistant.analyze_dfm_file(dfm_content)
                    
                    if "error" not in analysis_result:
                        st.success("Analyse DFM terminée !")
                        
                        with st.expander("Résultat de l'analyse"):
                            st.json(analysis_result)
                    else:
                        st.error(analysis_result["error"])

def process_user_request(prompt: str, ai_assistant: FormBuilderAI) -> str:
    """Traite une demande utilisateur et retourne une réponse"""
    
    prompt_lower = prompt.lower()
    
    # Détection de type de formulaire
    if any(form_type in prompt_lower for form_type in ["buytyp", "accadj", "primnt", "srcmnt"]):
        if "buytyp" in prompt_lower:
            form_config = ai_assistant.generate_form_by_type("BUYTYP")
        elif "accadj" in prompt_lower:
            form_config = ai_assistant.generate_form_by_type("ACCADJ")
        elif "primnt" in prompt_lower:
            form_config = ai_assistant.generate_form_by_type("PRIMNT")
        else:
            form_config = ai_assistant.generate_form_by_type("SRCMNT")
        
        if "error" not in form_config:
            return f"J'ai généré un formulaire {form_config['menuId']} pour vous ! Voici la configuration :\n\n```json\n{json.dumps(form_config, indent=2)}\n```\n\nVous pouvez copier cette configuration et l'utiliser dans FormBuilder Blazor."
        else:
            return f"Désolé, j'ai rencontré une erreur : {form_config['error']}"
    
    # Réponse générale
    elif any(word in prompt_lower for word in ["aide", "help", "comment", "que"]):
        return """
Je peux vous aider avec :

🔹 **Génération de formulaires** : Tapez "Crée un BUYTYP" ou "Génère ACCADJ"
🔹 **Analyse de fichiers DFM** : Chargez votre fichier DFM pour conversion automatique
🔹 **Configuration de composants** : Questions sur GRIDLKP, LSTLKP, SELECT, etc.
🔹 **Modèles MFact** : Information sur les modèles disponibles (BUYTYP, ACCADJ, PRIMNT, SRCMNT)

Que souhaitez-vous faire ?
"""
    
    else:
        return "Je ne suis pas sûr de comprendre votre demande. Pouvez-vous être plus spécifique ? Par exemple, demandez-moi de créer un formulaire BUYTYP ou d'analyser un fichier DFM."

if __name__ == "__main__":
    main()
```

## 5. Configuration Vite.js pour Assets

```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'wwwroot/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './src/main.js',
        styles: './src/styles.css'
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/ai': {
        target: 'http://localhost:8501',
        changeOrigin: true
      }
    }
  }
})
```

## 6. Workflow de Développement

### Scripts de Démarrage

```bash
# start-dev.bat (Windows) ou start-dev.sh (Linux/Mac)

# Démarrer API .NET Core
start dotnet run --project FormBuilder.Api

# Démarrer Blazor Server
start dotnet run --project FormBuilder.Blazor

# Activer environnement Python et démarrer Streamlit
call formbuilder_venv\Scripts\activate
start streamlit run streamlit_app.py --server.port 8501

# Démarrer Vite.js pour assets
start npm run dev

echo "Tous les services sont démarrés :"
echo "- API .NET Core : http://localhost:5000"
echo "- Blazor Server : http://localhost:5001" 
echo "- Streamlit IA : http://localhost:8501"
echo "- Vite.js Assets : http://localhost:3000"
```

Cette architecture pure utilise exclusivement les technologies demandées pour créer une solution complète et intégrée.