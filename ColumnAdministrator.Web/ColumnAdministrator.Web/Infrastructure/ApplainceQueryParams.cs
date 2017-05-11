using System.Text;
using System.Web.Http.ModelBinding;
using ColumnAdministrator.Web.Infrastructure.QueryParams;

namespace ColumnAdministrator.Web.Infrastructure {
    
    [ModelBinder(typeof(QueryParamsModelBinder<ApplianceQueryParams>))]
    public class ApplianceQueryParams : QueryParamsBase {

        /// <summary>
        /// Код объявления
        /// </summary>
        public string Category { get; set; }

        /// <summary>
        /// Метка (tag)
        /// </summary>
        public string Tag { get; set; }

        public override string ToString() {
            var sb = new StringBuilder("");
            sb.Append(string.Format("Id: {0} | ", PageIndex ?? 0));
            sb.Append(string.Format("Size: {0} | ", Size ?? 0));
            sb.Append(string.Format("Category: {0} | ", string.IsNullOrWhiteSpace(Category) ? "-" : Category));
            sb.Append(string.Format("Tag: {0} | ", string.IsNullOrWhiteSpace(Tag) ? "-" : Tag));
            sb.Append(string.Format("Search: {0}", string.IsNullOrWhiteSpace(Search) ? "-" : Search));
            return sb.ToString();
        }
    }
}