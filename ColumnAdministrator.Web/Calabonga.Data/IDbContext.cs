using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Calabonga.Account.Data
{
    public interface IDbContext
    {
        IDbSet<ApplicationUser> Users { get; set; }
        IDbSet<IdentityRole> Roles { get; set; }
        bool RequireUniqueEmail { get; set; }
        Database Database { get; }
        DbChangeTracker ChangeTracker { get; }
        DbContextConfiguration Configuration { get; }
        DbSet Set(Type entityType);
        DbSet<TEntity> Set<TEntity>() where TEntity : class;
        int SaveChanges();
        Task<int> SaveChangesAsync();
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        IEnumerable<DbEntityValidationResult> GetValidationErrors();
        DbEntityEntry Entry(object entity);
        void Dispose();
        string ToString();
        bool Equals(object obj);
        int GetHashCode();
        Type GetType();
    }
}
