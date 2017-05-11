using System.Web.Optimization;

namespace ColumnAdministrator.Web {
    public class BundleConfig {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles) {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/globalize/globalize.js",
                      "~/Scripts/globalize/globalize.culture.ru-RU.js",
                      "~/Scripts/amplify.js",
                      "~/Scripts/knockout-{version}.js",
                      "~/Scripts/knockout.mapping-latest.js",
                      "~/Scripts/knockout.validation.js",
                      "~/Scripts/moment-with-locales.js",
                      "~/Scripts/moment-datepicker.js",
                      "~/Scripts/moment-datepicker-ko.js",
                      "~/Scripts/underscore.js",
                      "~/Scripts/TrafficCop.js",
                      "~/Scripts/underscore.js",
                      "~/Scripts/infuser.js",
                      "~/Scripts/toastr.js",
                      "~/Scripts/koExternalTemplateEngine.js",
                      "~/Scripts/knockout.dirtyFlag.js",
                      "~/Scripts/knockout.command.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/site")
               .Include("~/Scripts/app/site.core.js")
               .Include("~/Scripts/app/site.controls.js")
               .Include("~/Scripts/app/site.bindingHandlers.js")
               .Include("~/Scripts/app/site.m.*")
               .Include("~/Scripts/app/site.services.*"));


            bundles.Add(new StyleBundle("~/Content/css").Include(
                       "~/Content/bootstrap.css",
                       "~/Content/toastr.css",
                       "~/Content/moment-datepicker.css",
                       "~/Content/site.css"));

            // Set EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
            BundleTable.EnableOptimizations = false;
        }
    }
}
