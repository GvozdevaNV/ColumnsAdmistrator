using System;

namespace Calabonga.Common.Contracts
{
	public interface ILogNotifyService
	{
		void Log(string message, params object[] args);

		void Log(Exception exception, params object[] args);

		void LogAndNotify(string message, params object[] args);

		void LogAndNotify(Exception exception, params object[] args);

		void Notify(string subject, string body);

		void Notify(string mailTo, string subject, string body);

		void Notify(IEmailMessage message);

		/// <summary>
		/// Сохранение в БД (unit.Commit)
		/// </summary>
		void Save();
	}
}