using System.Data.Entity;

namespace Calabonga.Account.Data
{
    public class ApplicationDbContext : DataContext, IContext
    {

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        public IDbSet<Appliance> Appliances { get; set; }
    }
}