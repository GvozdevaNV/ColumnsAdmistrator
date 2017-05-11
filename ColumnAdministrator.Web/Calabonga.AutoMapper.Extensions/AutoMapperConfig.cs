using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;

namespace Calabonga.AutoMapper.Extensions {

	public static class AutoMapperConfig {

		/// <summary>
		/// Initialize all IAutoMapper class an create mapping
		/// </summary>
		/// <param name="exportedTypes">Application executing assemply types</param>
		public static void Initialize(IEnumerable<Type> exportedTypes) {
			LoadMappings(exportedTypes);
		}

		private static void LoadMappings(IEnumerable<Type> types) {
			var maps = from t in types
					   where typeof(IAutoMapper).IsAssignableFrom(t) &&
							   !t.IsAbstract &&
							   !t.IsInterface
					   select (IAutoMapper)Activator.CreateInstance(t);

			foreach (var map in maps) {
				map.CreateMappings(Mapper.Configuration);
			}
		}


	}
}