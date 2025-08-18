using FormBuilderPro.Models;

namespace FormBuilderPro.Services
{
    public interface IFormService
    {
        Task<IEnumerable<Form>> GetUserFormsAsync(string userId);
        Task<Form?> GetFormByIdAsync(int id, string userId);
        Task<Form> CreateFormAsync(Form form);
        Task<Form?> UpdateFormAsync(Form form);
        Task<bool> DeleteFormAsync(int id, string userId);
        Task<bool> ValidateFormDataAsync(Form form);
        Task<string> ExportFormAsJsonAsync(int formId, string userId);
        Task<Form?> ImportFormFromJsonAsync(string jsonData, string userId);
    }
}