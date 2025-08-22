using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FormBuilderPro.Models
{
    public class Form
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string MenuId { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Label { get; set; } = string.Empty;

        [StringLength(50)]
        public string FormWidth { get; set; } = "700px";

        [StringLength(50)]
        public string Layout { get; set; } = "PROCESS";

        [Column(TypeName = "text")]
        public string FieldsJson { get; set; } = "[]";

        [Column(TypeName = "text")]
        public string CustomComponentsJson { get; set; } = "[]";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public string UserId { get; set; } = string.Empty;

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; } = null!;

        // Helper properties for JSON serialization
        [NotMapped]
        public List<FormField> Fields
        {
            get => string.IsNullOrEmpty(FieldsJson) ? new List<FormField>() : 
                   System.Text.Json.JsonSerializer.Deserialize<List<FormField>>(FieldsJson) ?? new List<FormField>();
            set => FieldsJson = System.Text.Json.JsonSerializer.Serialize(value);
        }

        [NotMapped]
        public List<CustomComponent> CustomComponents
        {
            get => string.IsNullOrEmpty(CustomComponentsJson) ? new List<CustomComponent>() : 
                   System.Text.Json.JsonSerializer.Deserialize<List<CustomComponent>>(CustomComponentsJson) ?? new List<CustomComponent>();
            set => CustomComponentsJson = System.Text.Json.JsonSerializer.Serialize(value);
        }
    }

    public class FormField
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string DataField { get; set; } = string.Empty;
        public string Entity { get; set; } = string.Empty;
        public string Width { get; set; } = "100%";
        public string Spacing { get; set; } = "4";
        public bool Required { get; set; } = false;
        public bool Inline { get; set; } = false;
        public bool Outlined { get; set; } = true;
        public string Value { get; set; } = string.Empty;
        public List<FormField> ChildFields { get; set; } = new List<FormField>();
        public Dictionary<string, object> Properties { get; set; } = new Dictionary<string, object>();
    }

    public class CustomComponent
    {
        public string Id { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string Color { get; set; } = "blue";
        public string Icon { get; set; } = "Package";
        public List<ComponentProperty> Properties { get; set; } = new List<ComponentProperty>();
    }

    public class ComponentProperty
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public bool Required { get; set; } = false;
        public string DefaultValue { get; set; } = string.Empty;
        public string Category { get; set; } = "General";
        public Dictionary<string, object> Configuration { get; set; } = new Dictionary<string, object>();
    }
}