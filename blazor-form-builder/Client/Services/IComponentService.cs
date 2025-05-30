using blazor_form_builder.Client.Models;

namespace blazor_form_builder.Client.Services
{
    public interface IComponentService
    {
        List<ComponentCategory> GetComponentCategories();
        List<CustomComponent> GetCustomComponents();
        void AddCustomComponent(CustomComponent component);
        void RemoveCustomComponent(string componentId);
        FormField CreateDefaultField(string componentType);
        bool CanDropIntoGroup(string componentType);
    }
}