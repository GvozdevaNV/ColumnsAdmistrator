using Calabonga.Common.Contracts;

namespace ColumnAdministrator.Web.Infrastructure
{
    public class AppSettingsManager : ConfigServiceBase<CurrentAppSettings>
    {
        public string[] AvaliableColumns { get; set; }

    }
}