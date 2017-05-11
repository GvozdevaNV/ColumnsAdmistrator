using Microsoft.AspNet.Identity.EntityFramework;

namespace Calabonga.Account.Data
{
    public class DataContext : IdentityDbContext<ApplicationUser>, IDbContext
    {
        public DataContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
            Configuration.AutoDetectChangesEnabled = true;
            Configuration.ProxyCreationEnabled = false;
        }
    }
}
