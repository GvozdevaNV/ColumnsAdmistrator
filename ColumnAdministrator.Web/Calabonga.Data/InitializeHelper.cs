using System;
using System.Collections.Generic;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Calabonga.Account.Data
{
    internal static class InitializeHelper
    {
        internal static void SeedMembership(ApplicationDbContext context)
        {
            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));

            const string password = "123123";
            const string role = "Administrator";

            //Create Role Admin if it does not exist
            if (!roleManager.RoleExists(role))
            {
                roleManager.Create(new IdentityRole(role));
            }

            //Create User=Admin with password=123123
            var admin = new ApplicationUser
            {
                AccessFailedCount = 0,
                Id = Guid.NewGuid().ToString(),
                Email = "calabonga@gmail.com",
                EmailConfirmed = true,
                UserName = "calabonga@gmail.com",
                TwoFactorEnabled = false,
                PhoneNumberConfirmed = false
            };
            var adminresult = userManager.Create(admin, password);

            //Add User Admin to Role Admin
            if (adminresult.Succeeded)
            {
                userManager.AddToRole(admin.Id, role);
            }
            //Create User=Admin with password=123123
            var user = new ApplicationUser
            {
                AccessFailedCount = 0,
                Id = Guid.NewGuid().ToString(),
                Email = "administrator@gmail.com",
                EmailConfirmed = true,
                UserName = "administrator@gmail.com",
                TwoFactorEnabled = false,
                PhoneNumberConfirmed = false
            };
            var userresult = userManager.Create(user, password);

            //Add User Admin to Role Admin
            if (userresult.Succeeded)
            {
                userManager.AddToRole(user.Id, role);
            }
        }

        internal static void SeedItems(ApplicationDbContext context)
        {
            var appliances = new List<Appliance>
            {
                new Appliance()
                {
                    Id = 1,
                    CreateDate = new DateTime(2014, 2, 2),
                    Description = "Description of item 1",
                    InStock = false,
                    Name = "Appliance",
                    Price = "435",
                    Attachment = null
                },
                new Appliance()
                {
                    Id = 2,
                    CreateDate = new DateTime(2014, 2, 12),
                    Description = "Description of item 2",
                    InStock = false,
                    Name = "Appliance",
                    Price = "4335",
                    Attachment = null
                },new Appliance()
                {
                    Id = 3,
                    CreateDate = new DateTime(2014, 1, 2),
                    Description = "Description of item 3",
                    InStock = false,
                    Name = "Appliance",
                    Price = "4325",
                    Attachment = null
                },new Appliance()
                {
                    Id = 4,
                    CreateDate = new DateTime(2014, 5, 4),
                    Description = "Description of item 4",
                    InStock = false,
                    Name = "Appliance",
                    Price = "1435",
                    Attachment = null
                },
            };
            appliances.ForEach(x=>context.Appliances.Add(x));
        }

    }
}
