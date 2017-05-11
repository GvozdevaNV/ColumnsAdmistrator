using System.Web.Mvc;
using ColumnAdministrator.Web.Infrastructure;

namespace ColumnAdministrator.Web.Controllers {
    public class HomeController : Controller {
        private readonly IApplianceRepository _applianceRepository;

        public HomeController(IApplianceRepository applianceRepository) {
            _applianceRepository = applianceRepository;
        }

        public ActionResult Index(int? id) {
            return View();
        }

        public ActionResult About() {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact() {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}