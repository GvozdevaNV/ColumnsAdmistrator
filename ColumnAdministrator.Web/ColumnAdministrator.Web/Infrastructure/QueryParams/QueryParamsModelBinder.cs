using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.ModelBinding;
using Newtonsoft.Json;

namespace ColumnAdministrator.Web.Infrastructure.QueryParams
{
    public class QueryParamsModelBinder<T> : IModelBinder {

        #region Implementation of IModelBinder

        /// <summary>
        /// Binds the model to a value by using the specified controller context and binding context.
        /// </summary>
        /// <returns>
        /// The bound value.
        /// </returns>
        /// <param name="actionContext">The action context.</param><param name="bindingContext">The binding context.</param>
        public bool BindModel(HttpActionContext actionContext, ModelBindingContext bindingContext) {
            var qp = HttpContext.Current.Request.QueryString["qp"];
            if (string.IsNullOrEmpty(qp)) return false;
            try {
                var serialize = JsonConvert.DeserializeObject<T>(qp);
                bindingContext.Model = serialize;
                return true;
            }
            catch (JsonSerializationException exception) {
                bindingContext.Model = exception;
            }
            return false;
        }

        #endregion
    }
}