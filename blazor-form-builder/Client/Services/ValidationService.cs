using blazor_form_builder.Client.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace blazor_form_builder.Client.Services
{
    public class ValidationService : IValidationService
    {
        private readonly HashSet<string> ValidFieldTypes = new()
        {
            "TEXT", "TEXTAREA", "SELECT", "CHECKBOX", "RADIOGRP", 
            "DATEPICKER", "FILEUPLOAD", "GRIDLKP", "LSTLKP", 
            "GROUP", "ACTION", "LABEL", "SEPARATOR"
        };

        public List<ValidationError> ValidateForm(FormDefinition form, List<CustomComponent> customComponents)
        {
            var errors = new List<ValidationError>();

            // Validate form structure
            if (string.IsNullOrWhiteSpace(form.MenuId))
            {
                errors.Add(new ValidationError
                {
                    Path = "MenuId",
                    Message = "MenuId est requis",
                    Severity = ValidationSeverity.Error
                });
            }

            if (string.IsNullOrWhiteSpace(form.Label))
            {
                errors.Add(new ValidationError
                {
                    Path = "Label",
                    Message = "Le label du formulaire est requis",
                    Severity = ValidationSeverity.Error
                });
            }

            // Validate fields
            var fieldIds = new HashSet<string>();
            ValidateFields(form.Fields, errors, fieldIds, customComponents);

            return errors;
        }

        private void ValidateFields(List<FormField> fields, List<ValidationError> errors, HashSet<string> fieldIds, List<CustomComponent> customComponents)
        {
            foreach (var field in fields)
            {
                var fieldErrors = ValidateField(field);
                errors.AddRange(fieldErrors);

                // Check for duplicate IDs
                if (!string.IsNullOrWhiteSpace(field.Id))
                {
                    if (fieldIds.Contains(field.Id))
                    {
                        errors.Add(new ValidationError
                        {
                            Path = $"Fields[{field.Id}].Id",
                            Message = $"ID de champ dupliqué: {field.Id}",
                            Severity = ValidationSeverity.Error
                        });
                    }
                    else
                    {
                        fieldIds.Add(field.Id);
                    }
                }

                // Validate custom components
                if (!ValidFieldTypes.Contains(field.Type))
                {
                    var customComponent = customComponents.FirstOrDefault(c => c.Id == field.Type);
                    if (customComponent == null)
                    {
                        errors.Add(new ValidationError
                        {
                            Path = $"Fields[{field.Id}].Type",
                            Message = $"Type de composant inconnu: {field.Type}",
                            Severity = ValidationSeverity.Error
                        });
                    }
                }

                // Recursively validate child fields
                if (field.ChildFields != null && field.ChildFields.Any())
                {
                    ValidateFields(field.ChildFields, errors, fieldIds, customComponents);
                }
            }
        }

        public List<ValidationError> ValidateField(FormField field)
        {
            var errors = new List<ValidationError>();

            if (string.IsNullOrWhiteSpace(field.Id))
            {
                errors.Add(new ValidationError
                {
                    Path = $"Field.Id",
                    Message = "L'ID du champ est requis",
                    Severity = ValidationSeverity.Error
                });
            }

            if (string.IsNullOrWhiteSpace(field.Type))
            {
                errors.Add(new ValidationError
                {
                    Path = $"Field[{field.Id}].Type",
                    Message = "Le type du champ est requis",
                    Severity = ValidationSeverity.Error
                });
            }

            if (string.IsNullOrWhiteSpace(field.Label))
            {
                errors.Add(new ValidationError
                {
                    Path = $"Field[{field.Id}].Label",
                    Message = "Le label du champ est requis",
                    Severity = ValidationSeverity.Error
                });
            }

            if (string.IsNullOrWhiteSpace(field.DataField))
            {
                errors.Add(new ValidationError
                {
                    Path = $"Field[{field.Id}].DataField",
                    Message = "Le DataField est requis",
                    Severity = ValidationSeverity.Warning
                });
            }

            // Validate JSON content for specific field types
            if ((field.Type == "SELECT" || field.Type == "RADIOGRP" || field.Type == "GRIDLKP" || field.Type == "LSTLKP") 
                && !string.IsNullOrWhiteSpace(field.Value))
            {
                if (!IsValidJson(field.Value))
                {
                    errors.Add(new ValidationError
                    {
                        Path = $"Field[{field.Id}].Value",
                        Message = "Configuration JSON invalide",
                        Severity = ValidationSeverity.Error
                    });
                }
            }

            return errors;
        }

        public bool IsValidJson(string json)
        {
            if (string.IsNullOrWhiteSpace(json))
                return true;

            try
            {
                JToken.Parse(json);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public string FormatJson(string json)
        {
            try
            {
                var parsedJson = JToken.Parse(json);
                return parsedJson.ToString(Formatting.Indented);
            }
            catch
            {
                return json;
            }
        }
    }
}