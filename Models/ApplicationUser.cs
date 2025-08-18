using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace FormBuilderPro.Models
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        [StringLength(100)]
        public string? FirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string? LastName { get; set; }

        public bool IsAdmin { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastLoginAt { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual ICollection<Form> Forms { get; set; } = new List<Form>();
        public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }
}