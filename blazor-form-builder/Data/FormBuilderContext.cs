using Microsoft.EntityFrameworkCore;

namespace FormBuilderApp.Data
{
    public class FormBuilderContext : DbContext
    {
        public FormBuilderContext(DbContextOptions<FormBuilderContext> options) : base(options)
        {
        }

        public DbSet<Form> Forms { get; set; }
        public DbSet<FormTemplate> FormTemplates { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Form>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.MenuId).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Label).IsRequired().HasMaxLength(200);
                entity.Property(e => e.FormWidth).HasMaxLength(50);
                entity.Property(e => e.Layout).HasMaxLength(50);
                entity.Property(e => e.FormDefinition).HasColumnType("text");
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UpdatedAt).IsRequired();
                
                entity.HasIndex(e => e.MenuId).IsUnique();
            });

            modelBuilder.Entity<FormTemplate>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.TemplateData).HasColumnType("text");
                entity.Property(e => e.CreatedAt).IsRequired();
            });
        }
    }

    public class Form
    {
        public int Id { get; set; }
        public string MenuId { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string FormWidth { get; set; } = "700px";
        public string Layout { get; set; } = "PROCESS";
        public string FormDefinition { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class FormTemplate
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string TemplateData { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}