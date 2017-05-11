using System.IO;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;

namespace Calabonga.Common.Contracts {

    public class AppConfigrReader<T> : IConfigService<T> where T : class {

        private T _appSettings;
        private readonly string _fileNameSettings = "AppConfig.cfg";

        public AppConfigrReader() { }

        public AppConfigrReader(string configFileName) {
            _fileNameSettings = configFileName;
        }

        protected async Task Serialize(T config) {
            try {
                var data = JsonConvert.SerializeObject(config);
                if (data != null) {
                    var file = HttpContext.Current.Server.MapPath("~/App_Config");
                    using (var sw = File.CreateText(Path.Combine(file, _fileNameSettings))) {
                        await sw.WriteAsync(data);
                    }
                }
            }
            catch { }
        }

        private void DeserealizeSettings() {
            var data = LoadSettings();
            _appSettings = Import(data);
        }

        private string LoadSettings() {
            try {
                var file = HttpContext.Current.Server.MapPath("~/App_Config");
                string data;
                using (var fs = File.OpenText(Path.Combine(file, _fileNameSettings))) {
                    data = fs.ReadToEnd();
                }
                return data;
            }
            catch {
                return null;
            }
        }

        private static T Import(string data) {
            var o = JsonConvert.DeserializeObject<T>(data);
            return string.IsNullOrEmpty(data) ? null : o;
        }

        /// <summary>
        /// Reload data from config-file
        /// </summary>
        protected void Reload() {
            DeserealizeSettings();
        }

        public T Config
        {
            get {
                if (_appSettings == null) {
                    DeserealizeSettings();
                }
                return _appSettings;
            }
        }
        public async Task SaveChanges(T config)
        {
            await Serialize(config);
        }
    }
}