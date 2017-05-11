using System;

namespace Calabonga.Common.Contracts {

	/// <summary>
	/// Cache service
	/// </summary>
	public interface ICacheService {

		/// <summary>
		/// Сохранение в кэш
		/// </summary>
		/// <param name="key">название параметра (ключ)</param>
		/// <param name="value"></param>
		/// <param name="absoluteExparation"></param>
		/// <param name="slidingExpiration"></param>
		void Insert(string key, object value, DateTime absoluteExparation, TimeSpan slidingExpiration);

		/// <summary>
		/// Чтение объекта из кэша
		/// </summary>
		/// <typeparam name="T">тип</typeparam>
		/// <param name="key">название параметра (ключ)</param>
		/// <returns></returns>
		T Read<T>(string key) where T : class;

		/// <summary>
		/// Чтение объекта из кэша
		/// </summary>
		/// <typeparam name="T">тип</typeparam>
		/// <param name="key">название параметра (ключ)</param>
		/// <param name="defaultValue">значение по умолчанию</param>
		/// <returns></returns>
		T Read<T>(string key, T defaultValue) where T : class;

		/// <summary>
		/// Чтение объекта из кэша
		/// </summary>
		/// <typeparam name="T">тип</typeparam>
		/// <param name="key">название параметра (ключ)</param>
		/// <param name="value">значение по умолчанию</param>
		/// <param name="absoluteExpiration">Искает</param>
		/// <param name="slidingExpiration"></param>
		/// <returns></returns>
		T Read<T>(string key, T value, DateTime absoluteExpiration, TimeSpan slidingExpiration) where T : class;

		/// <summary>
		/// Проверка наличия ключа в кэше
		/// </summary>
		/// <param name="key"></param>
		/// <returns></returns>
		bool HasKey(string key);

		/// <summary>
		/// Сброс кэша
		/// </summary>
		void Reset(string key);

	}
}