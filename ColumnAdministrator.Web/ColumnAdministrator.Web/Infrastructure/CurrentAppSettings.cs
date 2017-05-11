using System.ComponentModel.DataAnnotations;
using Calabonga.Common.Contracts;

namespace ColumnAdministrator.Web.Infrastructure
{
    public class CurrentAppSettings : AppSettings
    {
        public ColumnSetting[] EntityColumns { get; set; }
    }

    public class ColumnSetting
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public bool IsEnabled { get; set; }
        [Required]
        public string Label { get; set; }
        [Required]
        public string TemplateName { get; set; }
        [Required]
        public bool IsRequired { get; set; }
    }
}