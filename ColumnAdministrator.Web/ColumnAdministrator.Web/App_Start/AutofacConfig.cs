using System.Data.Entity;
using System.Reflection;
using System.Web.Http;
using System.Web.Mvc;
using Autofac;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;
using Calabonga.Account.Data;
using Calabonga.Common.Contracts;
using ColumnAdministrator.Web.Infrastructure;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace ColumnAdministrator.Web {

    public static class AutofacConfig {

        public static void Initialize() {
            var builder = new ContainerBuilder();
            builder.RegisterControllers(Assembly.GetExecutingAssembly());
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
            builder.RegisterModelBinders(Assembly.GetExecutingAssembly());

            builder.RegisterType<AppSettingsManager>().As<IConfigService<CurrentAppSettings>>();
            builder.RegisterType<ApplianceRepository>().As<IApplianceRepository>();
            builder.RegisterType<ApplicationDbContext>().As<IContext>().InstancePerRequest();
            builder.Register(c => new UserManager<ApplicationUser>(new UserStore<ApplicationUser>((DbContext)c.Resolve<IContext>())))
                .As<UserManager<ApplicationUser>>().InstancePerRequest();
            builder.Register(c => new RoleManager<IdentityRole>(new RoleStore<IdentityRole>((DbContext)c.Resolve<IContext>())))
                .As<RoleManager<IdentityRole>>().InstancePerRequest();

            builder.RegisterAssemblyTypes(Assembly.GetExecutingAssembly())
               .Where(x => x.Name.EndsWith("Service"))
               .AsImplementedInterfaces()
               .InstancePerRequest();

            builder.RegisterFilterProvider();

            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
            GlobalConfiguration.Configuration.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }
    }
}
