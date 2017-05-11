using System.Data.Entity.Migrations;
using System.Linq;
using AutoMapper;
using Calabonga.Account.Data;
using Calabonga.Common.Contracts;
using Calabonga.Mvc.PagedListExt;
using ColumnAdministrator.Web.Models;

namespace ColumnAdministrator.Web.Infrastructure {
    public interface IApplianceRepository {
        IPagedList<Appliance> GetList(int? page);
        Appliance Update(ApplianceViewModel model);
    }

    public class ApplianceRepository : IApplianceRepository {
        private readonly IContext _context;
        private readonly IConfigService<CurrentAppSettings> _appSettings;

        public ApplianceRepository(IContext context, IConfigService<CurrentAppSettings> appSettings)
        {
            _context = context;
            _appSettings = appSettings;
        }

        public IPagedList<Appliance> GetList(int? page)
        {
            return _context.Appliances.ToPagedList(page ?? 1, _appSettings.Config.DefaultPagerSize);
        }

        public Appliance Update(ApplianceViewModel model)
        {
            var item = _context.Appliances.SingleOrDefault(x => x.Id == model.Id);
            if (item!=null)
            {
                Mapper.Map(model, item);
                _context.Appliances.AddOrUpdate(item);
                _context.SaveChanges();
                return item;
            }
            return null;
        }
    }
}