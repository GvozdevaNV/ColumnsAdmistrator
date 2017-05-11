using System.Threading.Tasks;

namespace Calabonga.Common.Contracts {

    public class ConfigServiceBase<TConfig> : AppConfigrReader<TConfig> where TConfig : class {

        public void ReloadConfig() {
            Reload();
        }

        public async Task SaveChanges(TConfig model) {
            await Serialize(model);
        }
    }
}