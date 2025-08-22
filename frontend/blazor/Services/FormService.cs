using Microsoft.EntityFrameworkCore;
using FormBuilderPro.Data;
using FormBuilderPro.Models;
using System.Text.Json;

namespace FormBuilderPro.Services
{
    public class FormService : IFormService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<FormService> _logger;

        public FormService(ApplicationDbContext context, ILogger<FormService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Form>> GetUserFormsAsync(string userId)
        {
            return await _context.Forms
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.UpdatedAt)
                .ToListAsync();
        }

        public async Task<Form?> GetFormByIdAsync(int id, string userId)
        {
            return await _context.Forms
                .FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);
        }

        public async Task<Form> CreateFormAsync(Form form)
        {
            form.CreatedAt = DateTime.UtcNow;
            form.UpdatedAt = DateTime.UtcNow;

            _context.Forms.Add(form);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Form created with ID: {FormId}", form.Id);
            return form;
        }

        public async Task<Form?> UpdateFormAsync(Form form)
        {
            var existingForm = await _context.Forms
                .FirstOrDefaultAsync(f => f.Id == form.Id && f.UserId == form.UserId);

            if (existingForm == null)
                return null;

            existingForm.MenuId = form.MenuId;
            existingForm.Label = form.Label;
            existingForm.FormWidth = form.FormWidth;
            existingForm.Layout = form.Layout;
            existingForm.FieldsJson = form.FieldsJson;
            existingForm.CustomComponentsJson = form.CustomComponentsJson;
            existingForm.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Form updated with ID: {FormId}", form.Id);
            return existingForm;
        }

        public async Task<bool> DeleteFormAsync(int id, string userId)
        {
            var form = await _context.Forms
                .FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);

            if (form == null)
                return false;

            _context.Forms.Remove(form);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Form deleted with ID: {FormId}", id);
            return true;
        }

        public async Task<bool> ValidateFormDataAsync(Form form)
        {
            try
            {
                // Basic validation
                if (string.IsNullOrEmpty(form.MenuId) || string.IsNullOrEmpty(form.Label))
                    return false;

                // Validate JSON fields
                if (!string.IsNullOrEmpty(form.FieldsJson))
                {
                    JsonSerializer.Deserialize<List<FormField>>(form.FieldsJson);
                }

                if (!string.IsNullOrEmpty(form.CustomComponentsJson))
                {
                    JsonSerializer.Deserialize<List<CustomComponent>>(form.CustomComponentsJson);
                }

                // Check for duplicate MenuId for the same user
                var existingForm = await _context.Forms
                    .FirstOrDefaultAsync(f => f.MenuId == form.MenuId && f.UserId == form.UserId && f.Id != form.Id);

                return existingForm == null;
            }
            catch (JsonException)
            {
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating form data");
                return false;
            }
        }

        public async Task<string> ExportFormAsJsonAsync(int formId, string userId)
        {
            var form = await GetFormByIdAsync(formId, userId);
            if (form == null)
                throw new ArgumentException("Form not found");

            var exportData = new
            {
                formMetadata = new
                {
                    menuId = form.MenuId,
                    label = form.Label,
                    formWidth = form.FormWidth,
                    layout = form.Layout,
                    exportedAt = DateTime.UtcNow.ToString("O")
                },
                fields = form.Fields,
                customComponents = form.CustomComponents
            };

            return JsonSerializer.Serialize(exportData, new JsonSerializerOptions 
            { 
                WriteIndented = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
        }

        public async Task<Form?> ImportFormFromJsonAsync(string jsonData, string userId)
        {
            try
            {
                using var document = JsonDocument.Parse(jsonData);
                var root = document.RootElement;

                var form = new Form
                {
                    UserId = userId,
                    MenuId = root.TryGetProperty("formMetadata", out var metadata) && 
                             metadata.TryGetProperty("menuId", out var menuId) ? 
                             menuId.GetString() ?? $"IMPORTED_{DateTime.Now:yyyyMMddHHmmss}" : 
                             $"IMPORTED_{DateTime.Now:yyyyMMddHHmmss}",
                    Label = root.TryGetProperty("formMetadata", out metadata) && 
                           metadata.TryGetProperty("label", out var label) ? 
                           label.GetString() ?? "Imported Form" : 
                           "Imported Form",
                    FormWidth = root.TryGetProperty("formMetadata", out metadata) && 
                               metadata.TryGetProperty("formWidth", out var width) ? 
                               width.GetString() ?? "700px" : 
                               "700px",
                    Layout = root.TryGetProperty("formMetadata", out metadata) && 
                            metadata.TryGetProperty("layout", out var layout) ? 
                            layout.GetString() ?? "PROCESS" : 
                            "PROCESS"
                };

                // Import fields
                if (root.TryGetProperty("fields", out var fieldsElement))
                {
                    form.FieldsJson = fieldsElement.GetRawText();
                }

                // Import custom components
                if (root.TryGetProperty("customComponents", out var componentsElement))
                {
                    form.CustomComponentsJson = componentsElement.GetRawText();
                }

                // Validate before saving
                if (await ValidateFormDataAsync(form))
                {
                    return await CreateFormAsync(form);
                }

                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error importing form from JSON");
                return null;
            }
        }
    }
}