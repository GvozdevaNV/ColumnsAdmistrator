using System.Data.Entity;

namespace Calabonga.Account.Data
{
	public interface IContext : IDbContext
	{
	    IDbSet<Appliance> Appliances { get; set; }
	}
}
