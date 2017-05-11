using System;
using AutoMapper;
using Calabonga.Account.Data;
using Calabonga.AutoMapper.Extensions;
using Calabonga.Mvc.PagedListExt;

namespace ColumnAdministrator.Web.Models
{
    public class ApplianceViewModel : IAutoMapper {

        public int Id { get; set; }

        public DateTime CreateDate { get; set; }

        public string Price { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public bool InStock { get; set; }

        public object Attachment { get; set; }

        public void CreateMappings(IConfiguration configuration) {
            configuration.CreateMap<Appliance, ApplianceViewModel>().ReverseMap();
            configuration.CreateMap<PagedList<Appliance>, PagedList<ApplianceViewModel>>()
                .ConvertUsing<PagedListConverter<Appliance, ApplianceViewModel>>();
        }
    }
}