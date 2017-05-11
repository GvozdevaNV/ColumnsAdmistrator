using System.Linq;
using System.Web.Mvc;
using Calabonga.Common.Contracts;
using ColumnAdministrator.Web.Infrastructure;

namespace ColumnAdministrator.Web.Controllers {


    [Authorize(Roles = "Administrator")]
    public class AdminController : Controller {
        private readonly IConfigService<CurrentAppSettings> _configService;

        public AdminController(IConfigService<CurrentAppSettings> configService) {
            _configService = configService;
        }

        // GET: Admin
        public ActionResult Index() {
            return View();
        }
        public ActionResult Settings() {
            if (TempData["Reloaded"] != null) {
                ViewBag.Reloaded = TempData["Reloaded"];
            }
            var model = new CurrentAppSettings {
                IsLogging = _configService.Config.IsLogging,
                AdminEmail = _configService.Config.AdminEmail,
                DefaultPagerSize = _configService.Config.DefaultPagerSize,
                DomainUrl = _configService.Config.DomainUrl,
                IsHtmlForEmailMessagesEnabled = _configService.Config.IsHtmlForEmailMessagesEnabled,
                RobotEmail = _configService.Config.RobotEmail,
                SmtpClient = _configService.Config.SmtpClient,
                EntityColumns = _configService.Config.EntityColumns
            };

            return View(model);
        }

        [HttpPost]
        public ActionResult Settings(CurrentAppSettings model) {
            if (ModelState.IsValid) {
                _configService.SaveChanges(model);
                TempData["Reloaded"] = "Настройки успешно сохранены. Некоторые параметры начнут использоваться через несколько минут. Это связано с кэшировнием на страницах сайта и особенностями некоторых браузеров.";
                return RedirectToAction("settings");

            }
            return View(model);
        }

        [AllowAnonymous]
        public JsonResult GetMetadata() {
            var requiredFields = _configService.Config.EntityColumns.Where(x => x.IsRequired).Select(x => new {
                template = x.TemplateName,
                fieldName = x.Name,
                label = x.Label
            });
            var avaliableFields =
                _configService.Config.EntityColumns.Where(x => x.IsEnabled && !x.IsRequired).Select(x => new {
                    template = x.TemplateName,
                    fieldName = x.Name,
                    label = x.Label
                });

            return Json(requiredFields.Union(avaliableFields), JsonRequestBehavior.AllowGet);
        }
    }
}
