using System.Linq;
using AutoMapper;
using Calabonga.Mvc.PagedListExt;

namespace Calabonga.AutoMapper.Extensions
{

    public class PagedListConverter<TSource, TDestination> : ITypeConverter<PagedList<TSource>, PagedList<TDestination>>
    {

        public PagedList<TDestination> Convert(ResolutionContext context)
        {
            var models = (PagedList<TSource>)context.SourceValue;
            if (models != null && models.Any())
            {
                var viewModels = models.Select(Mapper.Map<TSource, TDestination>);
                return new PagedList<TDestination>(viewModels.AsQueryable(), models.PageIndex, models.PageSize, models.TotalCount);
            }
            return null;
        }
    }
}
