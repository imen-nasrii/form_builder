using blazor_form_builder.Client.Models;
using MudBlazor;

namespace blazor_form_builder.Client.Services
{
    public class ComponentService : IComponentService
    {
        private readonly List<CustomComponent> _customComponents = new();

        public List<ComponentCategory> GetComponentCategories()
        {
            return new List<ComponentCategory>
            {
                new ComponentCategory
                {
                    Name = "Saisie et texte",
                    Icon = Icons.Material.Filled.TextFields,
                    Components = new List<ComponentDefinition>
                    {
                        new ComponentDefinition { Type = "TEXT", Label = "Champ texte", Icon = Icons.Material.Filled.TextFields, Color = "primary", Description = "Saisie de texte simple" },
                        new ComponentDefinition { Type = "TEXTAREA", Label = "Zone de texte", Icon = Icons.Material.Filled.Notes, Color = "secondary", Description = "Saisie de texte multi-lignes" },
                        new ComponentDefinition { Type = "LABEL", Label = "Étiquette", Icon = Icons.Material.Filled.Label, Color = "info", Description = "Texte d'information" }
                    }
                },
                new ComponentCategory
                {
                    Name = "Sélection",
                    Icon = Icons.Material.Filled.List,
                    Components = new List<ComponentDefinition>
                    {
                        new ComponentDefinition { Type = "SELECT", Label = "Liste déroulante", Icon = Icons.Material.Filled.ArrowDropDown, Color = "warning", Description = "Sélection dans une liste" },
                        new ComponentDefinition { Type = "CHECKBOX", Label = "Case à cocher", Icon = Icons.Material.Filled.CheckBox, Color = "info", Description = "Sélection multiple" },
                        new ComponentDefinition { Type = "RADIOGRP", Label = "Boutons radio", Icon = Icons.Material.Filled.RadioButtonChecked, Color = "success", Description = "Sélection unique" }
                    }
                },
                new ComponentCategory
                {
                    Name = "Date et temps",
                    Icon = Icons.Material.Filled.DateRange,
                    Components = new List<ComponentDefinition>
                    {
                        new ComponentDefinition { Type = "DATEPICKER", Label = "Sélecteur de date", Icon = Icons.Material.Filled.DateRange, Color = "secondary", Description = "Sélection de date" }
                    }
                },
                new ComponentCategory
                {
                    Name = "Fichiers",
                    Icon = Icons.Material.Filled.CloudUpload,
                    Components = new List<ComponentDefinition>
                    {
                        new ComponentDefinition { Type = "FILEUPLOAD", Label = "Upload fichier", Icon = Icons.Material.Filled.CloudUpload, Color = "error", Description = "Téléchargement de fichiers" }
                    }
                },
                new ComponentCategory
                {
                    Name = "Recherche",
                    Icon = Icons.Material.Filled.Search,
                    Components = new List<ComponentDefinition>
                    {
                        new ComponentDefinition { Type = "GRIDLKP", Label = "Recherche grille", Icon = Icons.Material.Filled.GridView, Color = "primary", Description = "Recherche avec affichage en grille" },
                        new ComponentDefinition { Type = "LSTLKP", Label = "Recherche liste", Icon = Icons.Material.Filled.Search, Color = "info", Description = "Recherche avec affichage en liste" }
                    }
                },
                new ComponentCategory
                {
                    Name = "Mise en page",
                    Icon = Icons.Material.Filled.ViewModule,
                    Components = new List<ComponentDefinition>
                    {
                        new ComponentDefinition { Type = "GROUP", Label = "Groupe", Icon = Icons.Material.Filled.Folder, Color = "dark", Description = "Conteneur pour grouper des champs" },
                        new ComponentDefinition { Type = "SEPARATOR", Label = "Séparateur", Icon = Icons.Material.Filled.HorizontalRule, Color = "default", Description = "Ligne de séparation" }
                    }
                },
                new ComponentCategory
                {
                    Name = "Actions",
                    Icon = Icons.Material.Filled.PlayArrow,
                    Components = new List<ComponentDefinition>
                    {
                        new ComponentDefinition { Type = "ACTION", Label = "Bouton d'action", Icon = Icons.Material.Filled.PlayArrow, Color = "error", Description = "Bouton pour déclencher une action" }
                    }
                }
            };
        }

        public List<CustomComponent> GetCustomComponents()
        {
            return _customComponents.ToList();
        }

        public void AddCustomComponent(CustomComponent component)
        {
            var existing = _customComponents.FirstOrDefault(c => c.Id == component.Id);
            if (existing != null)
            {
                _customComponents.Remove(existing);
            }
            _customComponents.Add(component);
        }

        public void RemoveCustomComponent(string componentId)
        {
            var component = _customComponents.FirstOrDefault(c => c.Id == componentId);
            if (component != null)
            {
                _customComponents.Remove(component);
            }
        }

        public FormField CreateDefaultField(string componentType)
        {
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            var baseField = new FormField
            {
                Id = $"{componentType}_{timestamp}",
                Type = componentType,
                Label = GetDefaultLabel(componentType),
                DataField = $"{componentType.ToLower()}_{timestamp}",
                Entity = "defaultEntity",
                Width = "100%",
                Spacing = "md",
                Required = false,
                Inline = false,
                Outlined = true,
                Value = GetDefaultValue(componentType)
            };

            if (componentType == "GROUP")
            {
                baseField.ChildFields = new List<FormField>();
            }

            return baseField;
        }

        public bool CanDropIntoGroup(string componentType)
        {
            // Tous les composants peuvent être déposés dans un groupe sauf les groupes eux-mêmes
            return componentType != "GROUP";
        }

        private string GetDefaultLabel(string componentType)
        {
            return componentType switch
            {
                "TEXT" => "Champ texte",
                "TEXTAREA" => "Zone de texte",
                "SELECT" => "Liste déroulante",
                "CHECKBOX" => "Case à cocher",
                "RADIOGRP" => "Boutons radio",
                "DATEPICKER" => "Date",
                "FILEUPLOAD" => "Fichier",
                "GRIDLKP" => "Recherche grille",
                "LSTLKP" => "Recherche liste",
                "GROUP" => "Groupe",
                "ACTION" => "Action",
                "LABEL" => "Étiquette",
                "SEPARATOR" => "Séparateur",
                _ => componentType
            };
        }

        private string GetDefaultValue(string componentType)
        {
            return componentType switch
            {
                "SELECT" => "[{\"value\":\"1\",\"text\":\"Option 1\"},{\"value\":\"2\",\"text\":\"Option 2\"}]",
                "RADIOGRP" => "[{\"value\":\"1\",\"text\":\"Choix 1\"},{\"value\":\"2\",\"text\":\"Choix 2\"}]",
                "GRIDLKP" => "{\"columns\":[{\"field\":\"id\",\"title\":\"ID\"},{\"field\":\"name\",\"title\":\"Nom\"}],\"searchUrl\":\"/api/search\"}",
                "LSTLKP" => "{\"displayField\":\"name\",\"valueField\":\"id\",\"searchUrl\":\"/api/search\"}",
                "ACTION" => "/action/submit",
                _ => string.Empty
            };
        }
    }
}