using System.ComponentModel.DataAnnotations;

namespace Calabonga.Common.Contracts
{
	public class AppSettings {

		/// <summary>
		/// Журнал событий
		/// </summary>
		[Display(Name = "Журнал событий")]
		public bool IsLogging { get;  set; }

		/// <summary>
		/// Количество записей на странице
		/// </summary>
		[Display(Name = "Количество записей на странице")]
		[Required(ErrorMessage = "Количество записей на странице - обязательное поле")]
		[Range(2, 100)]
		public int DefaultPagerSize { get;  set; }

		/// <summary>
		/// Элекронный адрес для безответного письма
		/// </summary>
		[Display(Name = "Адрес для безответного письма")]
		[Required(ErrorMessage = "Элекронный адрес для безответного письма - обязательное поле")]
		[StringLength(50, ErrorMessage = "Элекронный адрес для безответного письма не может быть длиннее 50 символов")]
		[EmailAddress]
		public string RobotEmail { get;  set; }

		/// <summary>
		/// Адрес администратора
		/// </summary>
		[Display(Name = "Адрес администратора")]
		[Required(ErrorMessage = "Адрес администратора - обязательное поле")]
		[StringLength(50, ErrorMessage = "Адрес администратора не может быть длиннее 50 символов")]
		[EmailAddress]
		public string AdminEmail { get;  set; }


		/// <summary>
		/// Оправка почты с HTML-контентом
		/// </summary>
		[Display(Name = "Оправка почты с HTML-контентом")]
		public bool IsHtmlForEmailMessagesEnabled { get;  set; }

		/// <summary>
		/// Почтовый сервер для отправки
		/// </summary>
		[Display(Name = "Почтовый сервер для отправки (localhost)")]
		[Required(ErrorMessage = "Почтовый сервер для отправки - обязательное поле")]
		[StringLength(128, ErrorMessage = "Почтовый сервер для отправки не может быть длиннее 128 символов")]
		public string SmtpClient { get;  set; }

		/// <summary>
		/// Адрес сайта (URL) для подстановки в сообщения
		/// </summary>
		[Display(Name = "Адрес сайта (URL) для подстановки в сообщения")]
		[Required(ErrorMessage = "Адрес сайта (URL) для подстановки в сообщения - обязательное поле")]
		[StringLength(256, ErrorMessage = "Адрес сайта (URL) для подстановки в сообщения не может быть длиннее 256 символов")]
		public string DomainUrl { get;  set; }
	}
}