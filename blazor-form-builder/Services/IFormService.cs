using FormBuilderApp.Models;

namespace FormBuilderApp.Services
{
    public interface IFormService
    {
        Task<List<FormDefinition>> GetFormsAsync();
        Task<FormDefinition?> GetFormAsync(int id);
        Task<FormDefinition> CreateFormAsync(FormDefinition form);
        Task<FormDefinition> UpdateFormAsync(FormDefinition form);
        Task DeleteFormAsync(int id);
        Task<string> ExportFormAsync(int id);
        Task<FormDefinition> ImportFormAsync(string jsonData);
    }

    public interface IComponentService
    {
        Task<List<CustomComponent>> GetCustomComponentsAsync();
        Task<CustomComponent> CreateCustomComponentAsync(CustomComponent component);
        Task DeleteCustomComponentAsync(string id);
        FormField CreateDefaultField(string componentType);
    }

    public interface IValidationService
    {
        List<ValidationError> ValidateForm(FormDefinition form, List<CustomComponent> customComponents);
        bool IsValidMenuId(string menuId);
        bool IsValidWidth(string width);
        bool HasDuplicateIds(List<FormField> fields);
        bool HasDuplicateDataFields(List<FormField> fields);
    }
}