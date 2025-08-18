using FormBuilderPro.Models;

namespace FormBuilderPro.Services
{
    public class ComponentService : IComponentService
    {
        private readonly ILogger<ComponentService> _logger;

        // In-memory storage for custom components (would typically use database)
        private static readonly Dictionary<string, List<CustomComponent>> _userComponents = new();

        public ComponentService(ILogger<ComponentService> logger)
        {
            _logger = logger;
        }

        public Task<IEnumerable<CustomComponent>> GetUserComponentsAsync(string userId)
        {
            if (_userComponents.ContainsKey(userId))
            {
                return Task.FromResult<IEnumerable<CustomComponent>>(_userComponents[userId]);
            }
            return Task.FromResult<IEnumerable<CustomComponent>>(new List<CustomComponent>());
        }

        public Task<CustomComponent?> GetComponentByIdAsync(string id, string userId)
        {
            if (_userComponents.ContainsKey(userId))
            {
                var component = _userComponents[userId].FirstOrDefault(c => c.Id == id);
                return Task.FromResult(component);
            }
            return Task.FromResult<CustomComponent?>(null);
        }

        public Task<CustomComponent> CreateComponentAsync(CustomComponent component, string userId)
        {
            if (!_userComponents.ContainsKey(userId))
            {
                _userComponents[userId] = new List<CustomComponent>();
            }

            component.Id = $"CUSTOM_{DateTime.Now:yyyyMMddHHmmss}_{Guid.NewGuid().ToString("N")[..8].ToUpper()}";
            _userComponents[userId].Add(component);

            _logger.LogInformation("Custom component created: {ComponentId} for user {UserId}", component.Id, userId);
            return Task.FromResult(component);
        }

        public Task<CustomComponent?> UpdateComponentAsync(CustomComponent component, string userId)
        {
            if (_userComponents.ContainsKey(userId))
            {
                var existingComponent = _userComponents[userId].FirstOrDefault(c => c.Id == component.Id);
                if (existingComponent != null)
                {
                    existingComponent.Label = component.Label;
                    existingComponent.Color = component.Color;
                    existingComponent.Icon = component.Icon;
                    existingComponent.Properties = component.Properties;

                    _logger.LogInformation("Custom component updated: {ComponentId}", component.Id);
                    return Task.FromResult<CustomComponent?>(existingComponent);
                }
            }
            return Task.FromResult<CustomComponent?>(null);
        }

        public Task<bool> DeleteComponentAsync(string id, string userId)
        {
            if (_userComponents.ContainsKey(userId))
            {
                var component = _userComponents[userId].FirstOrDefault(c => c.Id == id);
                if (component != null)
                {
                    _userComponents[userId].Remove(component);
                    _logger.LogInformation("Custom component deleted: {ComponentId}", id);
                    return Task.FromResult(true);
                }
            }
            return Task.FromResult(false);
        }

        public Task<bool> ValidateComponentAsync(CustomComponent component)
        {
            return Task.FromResult(!string.IsNullOrEmpty(component.Label) && !string.IsNullOrEmpty(component.Color));
        }

        public Dictionary<string, object> GetDefaultComponentTypes()
        {
            return new Dictionary<string, object>
            {
                ["TEXT"] = new { label = "Text Input", icon = "Type", category = "Input" },
                ["TEXTAREA"] = new { label = "Text Area", icon = "FileText", category = "Input" },
                ["NUMBER"] = new { label = "Number Input", icon = "Hash", category = "Input" },
                ["EMAIL"] = new { label = "Email Input", icon = "Mail", category = "Input" },
                ["PASSWORD"] = new { label = "Password Input", icon = "Lock", category = "Input" },
                ["SELECT"] = new { label = "Select Dropdown", icon = "ChevronDown", category = "Input" },
                ["RADIO"] = new { label = "Radio Button", icon = "Radio", category = "Input" },
                ["CHECKBOX"] = new { label = "Checkbox", icon = "Square", category = "Input" },
                ["DATE"] = new { label = "Date Picker", icon = "Calendar", category = "Input" },
                ["FILE"] = new { label = "File Upload", icon = "Upload", category = "Input" },
                ["BUTTON"] = new { label = "Button", icon = "MousePointer", category = "Action" },
                ["LINK"] = new { label = "Link", icon = "ExternalLink", category = "Action" },
                ["LABEL"] = new { label = "Label", icon = "Tag", category = "Display" },
                ["HEADING"] = new { label = "Heading", icon = "Heading", category = "Display" },
                ["DIVIDER"] = new { label = "Divider", icon = "Minus", category = "Layout" },
                ["GROUP"] = new { label = "Group Container", icon = "Folder", category = "Layout" },
                ["GRID"] = new { label = "Grid Layout", icon = "Grid3X3", category = "Layout" },
                ["ACCORDION"] = new { label = "Accordion", icon = "ChevronRight", category = "Layout" }
            };
        }

        public Dictionary<string, List<string>> GetComponentCategories()
        {
            return new Dictionary<string, List<string>>
            {
                ["Input"] = new List<string> { "TEXT", "TEXTAREA", "NUMBER", "EMAIL", "PASSWORD", "SELECT", "RADIO", "CHECKBOX", "DATE", "FILE" },
                ["Action"] = new List<string> { "BUTTON", "LINK" },
                ["Display"] = new List<string> { "LABEL", "HEADING" },
                ["Layout"] = new List<string> { "DIVIDER", "GROUP", "GRID", "ACCORDION" }
            };
        }
    }
}