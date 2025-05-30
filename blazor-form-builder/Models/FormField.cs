using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace FormBuilderApp.Models
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
        public bool Required { get; set; } = false;
        public bool Inline { get; set; } = false;
        public bool Outlined { get; set; } = false;
        public string Value { get; set; } = string.Empty;
        public List<FormField>? ChildFields { get; set; }
    }

    public class FormDefinition
    {
        public int? Id { get; set; }
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
        public string Color { get; set; } = string.Empty;
        public Dictionary<string, object> Properties { get; set; } = new();
        public bool IsCustom { get; set; } = true;
    }

    public class ValidationError
    {
        public string Message { get; set; } = string.Empty;
        public string FieldId { get; set; } = string.Empty;
        public ValidationSeverity Severity { get; set; }
    }

    public enum ValidationSeverity
    {
        Error,
        Warning,
        Info
    }

    public static class ComponentTypes
    {
        public static readonly Dictionary<string, ComponentConfig> Default = new()
        {
            { "TEXT", new ComponentConfig { Icon = "text_fields", Label = "Saisie de texte", Color = "primary" } },
            { "TEXTAREA", new ComponentConfig { Icon = "notes", Label = "Zone de texte", Color = "secondary" } },
            { "SELECT", new ComponentConfig { Icon = "arrow_drop_down", Label = "Sélectionner", Color = "warning" } },
            { "CHECKBOX", new ComponentConfig { Icon = "check_box", Label = "Case à cocher", Color = "info" } },
            { "RADIOGRP", new ComponentConfig { Icon = "radio_button_checked", Label = "Groupe radio", Color = "success" } },
            { "DATEPICKER", new ComponentConfig { Icon = "date_range", Label = "Sélecteur de date", Color = "secondary" } },
            { "FILEUPLOAD", new ComponentConfig { Icon = "cloud_upload", Label = "Téléchargement de fichiers", Color = "error" } },
            { "GRIDLKP", new ComponentConfig { Icon = "grid_view", Label = "Recherche de grille", Color = "primary" } },
            { "LSTLKP", new ComponentConfig { Icon = "search", Label = "Recherche de liste", Color = "info" } },
            { "GROUP", new ComponentConfig { Icon = "folder", Label = "Groupe", Color = "dark" } },
            { "ACTION", new ComponentConfig { Icon = "play_arrow", Label = "Bouton d'action", Color = "error" } }
        };
    }

    public class ComponentConfig
    {
        public string Icon { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
    }
}