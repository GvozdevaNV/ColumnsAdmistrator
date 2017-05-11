namespace Calabonga.Account.Data.Migrations {
    using System.Data.Entity.Migrations;

    internal sealed class Configuration : DbMigrationsConfiguration<ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(ApplicationDbContext context)
        {
            InitializeHelper.SeedMembership(context);
            InitializeHelper.SeedItems((ApplicationDbContext)context);
        }
    }
}
