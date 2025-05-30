using blazor_form_builder.Client.Models;
using Newtonsoft.Json;
using System.Text;

namespace blazor_form_builder.Client.Services
{
    public class FormService : IFormService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<FormService> _logger;

        public FormService(HttpClient httpClient, ILogger<FormService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<List<FormDefinition>> GetFormsAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("api/forms");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<List<FormDefinition>>(json) ?? new List<FormDefinition>();
                }
                return new List<FormDefinition>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching forms");
                return new List<FormDefinition>();
            }
        }

        public async Task<FormDefinition?> GetFormAsync(int id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"api/forms/{id}");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<FormDefinition>(json);
                }
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching form {FormId}", id);
                return null;
            }
        }

        public async Task<FormDefinition?> GetFormByMenuIdAsync(string menuId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"api/forms/menu/{menuId}");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<FormDefinition>(json);
                }
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching form by menuId {MenuId}", menuId);
                return null;
            }
        }

        public async Task<FormDefinition> CreateFormAsync(FormDefinition form)
        {
            try
            {
                var json = JsonConvert.SerializeObject(form);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync("api/forms", content);
                response.EnsureSuccessStatusCode();
                
                var responseJson = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<FormDefinition>(responseJson) ?? form;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating form");
                throw;
            }
        }

        public async Task<FormDefinition> UpdateFormAsync(int id, FormDefinition form)
        {
            try
            {
                var json = JsonConvert.SerializeObject(form);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PutAsync($"api/forms/{id}", content);
                response.EnsureSuccessStatusCode();
                
                var responseJson = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<FormDefinition>(responseJson) ?? form;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating form {FormId}", id);
                throw;
            }
        }

        public async Task DeleteFormAsync(int id)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"api/forms/{id}");
                response.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting form {FormId}", id);
                throw;
            }
        }

        public async Task<bool> ValidateFormAsync(FormDefinition form)
        {
            try
            {
                var json = JsonConvert.SerializeObject(form);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync("api/forms/validate", content);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating form");
                return false;
            }
        }
    }
}