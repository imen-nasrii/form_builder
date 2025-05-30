using System.ComponentModel.DataAnnotations;

namespace blazor_form_builder.Client.Models
{
    public class FormField
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string DataField { get; set; } = string.Empty;
        public string Entity { get; set; } = string.Empty;
        public string Width { get; set; } = "100%";
        public string Spacing { get; set; } = "md";
        public bool Required { get; set; }
        public bool Inline { get; set; }
        public bool Outlined { get; set; } = true;
        public string Value { get; set; } = string.Empty;
        public List<FormField>? ChildFields { get; set; }
    }

    public class FormDefinition
    {
        public string MenuId { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string FormWidth { get; set; } = "700px";
        public string Layout { get; set; } = "PROCESS";
        public List<FormField> Fields { get; set; } = new();
    }

    public class CustomComponent
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Color { get; set; } = "primary";
        public Dictionary<string, object> Properties { get; set; } = new();
        public bool IsCustom { get; set; } = true;
    }

    public class ValidationError
    {
        public string Path { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public ValidationSeverity Severity { get; set; }
    }

    public enum ValidationSeverity
    {
        Info,
        Warning,
        Error
    }

    public class ComponentCategory
    {
        public string Name { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public List<ComponentDefinition> Components { get; set; } = new();
    }

    public class ComponentDefinition
    {
        public string Type { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class TutorialStep
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string Target { get; set; } = string.Empty;
    }
}