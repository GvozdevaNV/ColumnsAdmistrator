using AutoMapper;

namespace Calabonga.AutoMapper.Extensions
{
	/// <summary>
	/// AutoMapper interface for collect classes to map by reflection.
	/// </summary>
	public interface IAutoMapper
	{
		void CreateMappings(IConfiguration configuration);
	}
}