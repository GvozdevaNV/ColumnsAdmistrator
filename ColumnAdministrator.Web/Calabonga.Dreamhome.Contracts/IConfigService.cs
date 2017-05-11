namespace Calabonga.Dreamhome.Contracts
{

	public interface IConfigService {

		/// <summary>
		/// Требуется ли ведение журнала событий
		/// </summary>
		bool IsLogging { get; }

		/// <summary>
		/// Конфигурация системы
		/// </summary>
		int DefaultPageSize { get; }

		/// <summary>
		/// Адрес электронной почты для подстановки как обратный для писем пользователям
		/// </summary>
		string RobotEmail { get; }

		/// <summary>
		/// Адрес электронной почты администратора сайта
		/// </summary>
		string AdminEmail { get; }

		/// <summary>
		/// Enable to send messages HTML body
		/// </summary>
		bool IsHtmlForEmailMessagesEnabled { get; }

		/// <summary>
		/// SMTP client/ Server Name. Ex. "localhost"
		/// </summary>
		string SmtpClient { get; }
	}
}