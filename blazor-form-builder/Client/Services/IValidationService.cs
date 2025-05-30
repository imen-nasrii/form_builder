using blazor_form_builder.Client.Models;

namespace blazor_form_builder.Client.Services
{
    public interface IValidationService
    {
        List<ValidationError> ValidateForm(FormDefinition form, List<CustomComponent> customComponents);
        List<ValidationError> ValidateField(FormField field);
        bool IsValidJson(string json);
        string FormatJson(string json);
    }
}