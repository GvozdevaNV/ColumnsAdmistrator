using System.Threading.Tasks;

namespace Calabonga.Common.Contracts
{
    public interface IConfigService<T> where T: class {

        T Config { get; }

        Task SaveChanges(T config);
    }
}