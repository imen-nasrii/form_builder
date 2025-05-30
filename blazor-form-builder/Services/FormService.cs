using FormBuilderApp.Models;
using FormBuilderApp.Data;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Blazored.LocalStorage;

namespace FormBuilderApp.Services
{
    public class FormService : IFormService
    {
        private readonly FormBuilderContext _context;
        private readonly ILocalStorageService _localStorage;

        public FormService(FormBuilderContext context, ILocalStorageService localStorage)
        {
            _context = context;
            _localStorage = localStorage;
        }

        public async Task<List<FormDefinition>> GetFormsAsync()
        {
            var forms = await _context.Forms.ToListAsync();
            return forms.Select(f => new FormDefinition
            {
                Id = f.Id,
                MenuId = f.MenuId,
                Label = f.Label,
                FormWidth = f.FormWidth,
                Layout = f.Layout,
                Fields = string.IsNullOrEmpty(f.FormDefinition) 
                    ? new List<FormField>() 
                    : JsonConvert.DeserializeObject<List<FormField>>(f.FormDefinition) ?? new List<FormField>()
            }).ToList();
        }

        public async Task<FormDefinition?> GetFormAsync(int id)
        {
            var form = await _context.Forms.FindAsync(id);
            if (form == null) return null;

            return new FormDefinition
            {
                Id = form.Id,
                MenuId = form.MenuId,
                Label = form.Label,
                FormWidth = form.FormWidth,
                Layout = form.Layout,
                Fields = string.IsNullOrEmpty(form.FormDefinition) 
                    ? new List<FormField>() 
                    : JsonConvert.DeserializeObject<List<FormField>>(form.FormDefinition) ?? new List<FormField>()
            };
        }

        public async Task<FormDefinition> CreateFormAsync(FormDefinition form)
        {
            var entity = new Form
            {
                MenuId = form.MenuId,
                Label = form.Label,
                FormWidth = form.FormWidth,
                Layout = form.Layout,
                FormDefinition = JsonConvert.SerializeObject(form.Fields),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Forms.Add(entity);
            await _context.SaveChangesAsync();

            form.Id = entity.Id;
            
            // Also save to localStorage as backup
            await _localStorage.SetItemAsync("formBuilder_backup", new
            {
                id = entity.Id,
                fields = form.Fields
            });

            return form;
        }

        public async Task<FormDefinition> UpdateFormAsync(FormDefinition form)
        {
            var entity = await _context.Forms.FindAsync(form.Id);
            if (entity == null) throw new ArgumentException("Form not found");

            entity.MenuId = form.MenuId;
            entity.Label = form.Label;
            entity.FormWidth = form.FormWidth;
            entity.Layout = form.Layout;
            entity.FormDefinition = JsonConvert.SerializeObject(form.Fields);
            entity.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Update localStorage backup
            await _localStorage.SetItemAsync("formBuilder_backup", new
            {
                id = entity.Id,
                fields = form.Fields
            });

            return form;
        }

        public async Task DeleteFormAsync(int id)
        {
            var form = await _context.Forms.FindAsync(id);
            if (form != null)
            {
                _context.Forms.Remove(form);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<string> ExportFormAsync(int id)
        {
            var form = await GetFormAsync(id);
            if (form == null) throw new ArgumentException("Form not found");

            return JsonConvert.SerializeObject(form, Formatting.Indented);
        }

        public async Task<FormDefinition> ImportFormAsync(string jsonData)
        {
            var form = JsonConvert.DeserializeObject<FormDefinition>(jsonData);
            if (form == null) throw new ArgumentException("Invalid JSON data");

            form.Id = null; // Ensure new form creation
            form.MenuId = $"FORM_{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
            
            return await CreateFormAsync(form);
        }
    }

    public class ComponentService : IComponentService
    {
        private readonly ILocalStorageService _localStorage;

        public ComponentService(ILocalStorageService localStorage)
        {
            _localStorage = localStorage;
        }

        public async Task<List<CustomComponent>> GetCustomComponentsAsync()
        {
            try
            {
                return await _localStorage.GetItemAsync<List<CustomComponent>>("customComponents") ?? new List<CustomComponent>();
            }
            catch
            {
                return new List<CustomComponent>();
            }
        }

        public async Task<CustomComponent> CreateCustomComponentAsync(CustomComponent component)
        {
            var components = await GetCustomComponentsAsync();
            components.Add(component);
            await _localStorage.SetItemAsync("customComponents", components);
            return component;
        }

        public async Task DeleteCustomComponentAsync(string id)
        {
            var components = await GetCustomComponentsAsync();
            components.RemoveAll(c => c.Id == id);
            await _localStorage.SetItemAsync("customComponents", components);
        }

        public FormField CreateDefaultField(string componentType)
        {
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            
            var config = ComponentTypes.Default.ContainsKey(componentType) 
                ? ComponentTypes.Default[componentType] 
                : new ComponentConfig { Label = componentType, Icon = "help", Color = "default" };

            return new FormField
            {
                Id = $"{componentType}_{timestamp}",
                Type = componentType,
                Label = config.Label,
                DataField = $"field_{timestamp}",
                Entity = "TableName",
                Width = "100%",
                Spacing = "md",
                Required = false,
                Inline = false,
                Outlined = false,
                Value = "",
                ChildFields = componentType == "GROUP" ? new List<FormField>() : null
            };
        }
    }

    public class ValidationService : IValidationService
    {
        public List<ValidationError> ValidateForm(FormDefinition form, List<CustomComponent> customComponents)
        {
            var errors = new List<ValidationError>();

            // Validate MenuID
            if (string.IsNullOrWhiteSpace(form.MenuId))
            {
                errors.Add(new ValidationError { Message = "MenuID est requis", Severity = ValidationSeverity.Error });
            }
            else if (!IsValidMenuId(form.MenuId))
            {
                errors.Add(new ValidationError { Message = "MenuID doit contenir uniquement des lettres majuscules, chiffres et underscores", Severity = ValidationSeverity.Error });
            }

            // Validate Label
            if (string.IsNullOrWhiteSpace(form.Label))
            {
                errors.Add(new ValidationError { Message = "Label du formulaire est requis", Severity = ValidationSeverity.Error });
            }

            // Validate Width
            if (!IsValidWidth(form.FormWidth))
            {
                errors.Add(new ValidationError { Message = "FormWidth doit être une valeur CSS valide (ex: 700px, 100%)", Severity = ValidationSeverity.Error });
            }

            // Validate Fields
            if (form.Fields == null || !form.Fields.Any())
            {
                errors.Add(new ValidationError { Message = "Le formulaire doit contenir au moins un champ", Severity = ValidationSeverity.Warning });
            }
            else
            {
                ValidateFields(form.Fields, customComponents, errors);
            }

            return errors;
        }

        private void ValidateFields(List<FormField> fields, List<CustomComponent> customComponents, List<ValidationError> errors)
        {
            var validTypes = ComponentTypes.Default.Keys.Concat(customComponents.Select(c => c.Id)).ToList();

            for (int i = 0; i < fields.Count; i++)
            {
                var field = fields[i];
                var prefix = $"Champ {i + 1}";

                // Required properties
                if (string.IsNullOrWhiteSpace(field.Id))
                    errors.Add(new ValidationError { Message = $"{prefix}: ID est requis", FieldId = field.Id, Severity = ValidationSeverity.Error });

                if (string.IsNullOrWhiteSpace(field.Type))
                    errors.Add(new ValidationError { Message = $"{prefix}: Type est requis", FieldId = field.Id, Severity = ValidationSeverity.Error });

                if (string.IsNullOrWhiteSpace(field.Label))
                    errors.Add(new ValidationError { Message = $"{prefix}: Label est requis", FieldId = field.Id, Severity = ValidationSeverity.Error });

                if (string.IsNullOrWhiteSpace(field.DataField))
                    errors.Add(new ValidationError { Message = $"{prefix}: DataField est requis", FieldId = field.Id, Severity = ValidationSeverity.Error });

                // Type validation
                if (!string.IsNullOrWhiteSpace(field.Type) && !validTypes.Contains(field.Type))
                    errors.Add(new ValidationError { Message = $"{prefix}: Type '{field.Type}' n'est pas valide", FieldId = field.Id, Severity = ValidationSeverity.Error });

                // Width validation
                if (!string.IsNullOrWhiteSpace(field.Width) && !IsValidWidth(field.Width))
                    errors.Add(new ValidationError { Message = $"{prefix}: Width doit être une valeur CSS valide", FieldId = field.Id, Severity = ValidationSeverity.Error });

                // Type-specific validation
                if (field.Type == "GROUP" && field.ChildFields != null && !field.ChildFields.Any())
                    errors.Add(new ValidationError { Message = $"{prefix}: Groupe vide (aucun champ enfant)", FieldId = field.Id, Severity = ValidationSeverity.Warning });

                if (field.Type == "SELECT" && string.IsNullOrWhiteSpace(field.Value))
                    errors.Add(new ValidationError { Message = $"{prefix}: SELECT sans options définies", FieldId = field.Id, Severity = ValidationSeverity.Warning });

                // Validate child fields recursively
                if (field.ChildFields != null && field.ChildFields.Any())
                {
                    ValidateFields(field.ChildFields, customComponents, errors);
                }
            }

            // Check for duplicate IDs
            if (HasDuplicateIds(fields))
                errors.Add(new ValidationError { Message = "Des IDs de champs sont dupliqués", Severity = ValidationSeverity.Error });

            // Check for duplicate DataFields
            if (HasDuplicateDataFields(fields))
                errors.Add(new ValidationError { Message = "Des DataFields sont dupliqués", Severity = ValidationSeverity.Warning });
        }

        public bool IsValidMenuId(string menuId)
        {
            return !string.IsNullOrWhiteSpace(menuId) && System.Text.RegularExpressions.Regex.IsMatch(menuId, @"^[A-Z0-9_]+$");
        }

        public bool IsValidWidth(string width)
        {
            return !string.IsNullOrWhiteSpace(width) && System.Text.RegularExpressions.Regex.IsMatch(width, @"^\d+(px|%|em|rem)$");
        }

        public bool HasDuplicateIds(List<FormField> fields)
        {
            var allIds = GetAllFieldIds(fields);
            return allIds.Count != allIds.Distinct().Count();
        }

        public bool HasDuplicateDataFields(List<FormField> fields)
        {
            var allDataFields = GetAllDataFields(fields);
            return allDataFields.Count != allDataFields.Distinct().Count();
        }

        private List<string> GetAllFieldIds(List<FormField> fields)
        {
            var ids = new List<string>();
            foreach (var field in fields)
            {
                if (!string.IsNullOrWhiteSpace(field.Id))
                    ids.Add(field.Id);
                
                if (field.ChildFields != null)
                    ids.AddRange(GetAllFieldIds(field.ChildFields));
            }
            return ids;
        }

        private List<string> GetAllDataFields(List<FormField> fields)
        {
            var dataFields = new List<string>();
            foreach (var field in fields)
            {
                if (!string.IsNullOrWhiteSpace(field.DataField))
                    dataFields.Add(field.DataField);
                
                if (field.ChildFields != null)
                    dataFields.AddRange(GetAllDataFields(field.ChildFields));
            }
            return dataFields;
        }
    }
}