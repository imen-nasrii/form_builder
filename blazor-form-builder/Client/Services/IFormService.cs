using blazor_form_builder.Client.Models;

namespace blazor_form_builder.Client.Services
{
    public interface IFormService
    {
        Task<List<FormDefinition>> GetFormsAsync();
        Task<FormDefinition?> GetFormAsync(int id);
        Task<FormDefinition?> GetFormByMenuIdAsync(string menuId);
        Task<FormDefinition> CreateFormAsync(FormDefinition form);
        Task<FormDefinition> UpdateFormAsync(int id, FormDefinition form);
        Task DeleteFormAsync(int id);
        Task<bool> ValidateFormAsync(FormDefinition form);
    }
}