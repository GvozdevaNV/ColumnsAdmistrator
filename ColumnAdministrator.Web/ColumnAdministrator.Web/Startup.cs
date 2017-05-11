using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ColumnAdministrator.Web.Startup))]
namespace ColumnAdministrator.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
