using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using Calabonga.Mvc.ApiExtensions;
using Calabonga.Mvc.PagedListExt;
using ColumnAdministrator.Web.Infrastructure;
using ColumnAdministrator.Web.Models;

namespace ColumnAdministrator.Web.Controllers {
    public class AppliancesController : ApiController {
        private readonly IApplianceRepository _applianceRepository;

        public AppliancesController(IApplianceRepository applianceRepository) {
            _applianceRepository = applianceRepository;
        }

        public HttpResponseMessage Get(ApplianceQueryParams query) {
            if (query == null) return Request.CreateResponse(HttpStatusCode.BadRequest);
            var result = _applianceRepository.GetList(query.CurrentIndex);
            var models = Mapper.Map<PagedList<ApplianceViewModel>>(result);
            return Request.CreateResponse(HttpStatusCode.OK, new ApiResultsSuccessPagesList<ApplianceViewModel>(models));
        }

        public HttpResponseMessage Put(ApplianceViewModel model) {
            if (ModelState.IsValid) {
                var updated = _applianceRepository.Update(model);
                if (updated != null) {
                    var result = Mapper.Map<ApplianceViewModel>(updated);
                    return Request.CreateResponse(HttpStatusCode.OK, new ApiResultSuccess<ApplianceViewModel>(result));
                }
            }
            return Request.CreateResponse(HttpStatusCode.OK, new ApiResultWarning("Проверьте правильность заполнения формы. Данные не прошли проверку."));
        }
    }
}
