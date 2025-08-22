using FormBuilderPro.Models;

namespace FormBuilderPro.Services
{
    public interface IComponentService
    {
        Task<IEnumerable<CustomComponent>> GetUserComponentsAsync(string userId);
        Task<CustomComponent?> GetComponentByIdAsync(string id, string userId);
        Task<CustomComponent> CreateComponentAsync(CustomComponent component, string userId);
        Task<CustomComponent?> UpdateComponentAsync(CustomComponent component, string userId);
        Task<bool> DeleteComponentAsync(string id, string userId);
        Task<bool> ValidateComponentAsync(CustomComponent component);
        Dictionary<string, object> GetDefaultComponentTypes();
        Dictionary<string, List<string>> GetComponentCategories();
    }
}