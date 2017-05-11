using System.Collections.Generic;
using System.Web;

namespace Calabonga.Common.Contracts {

	public interface IEmailService {

		/// <summary>
		/// Отправка электронной почты
		/// </summary>
		/// <param name="mailFrom"></param>
		/// <param name="mailto"></param>
		/// <param name="mailSubject"></param>
		/// <param name="mailBody"></param>
		/// <param name="files"></param>
		/// <returns></returns>
		bool SendMail(string mailFrom, string mailto, string mailSubject, string mailBody, IEnumerable<HttpPostedFileBase> files);

		/// <summary>
		/// Отправка сообщение электронной почты
		/// </summary>
		/// <param name="mailFrom"></param>
		/// <param name="mailto"></param>
		/// <param name="mailSubject"></param>
		/// <param name="mailBody"></param>
		/// <returns></returns>
		bool SendMail(string mailFrom, string mailto, string mailSubject, string mailBody);

		/// <summary>
		/// Отправка сообщение электронной почты
		/// </summary>
		/// <param name="mailto"></param>
		/// <param name="mailSubject"></param>
		/// <param name="mailBody"></param>
		/// <returns></returns>
		bool SendMail(string mailto, string mailSubject, string mailBody);

		/// <summary>
		/// Уведомление администратору
		/// </summary>
		/// <param name="mailSubject"></param>
		/// <param name="mailBody"></param>
		/// <returns></returns>
		bool NotifyAdmin(string mailSubject, string mailBody);

		/// <summary>
		/// Send email
		/// </summary>
		/// <param name="message"></param>
		/// <returns></returns>
		void SendMail(IEmailMessage message);
	}
}