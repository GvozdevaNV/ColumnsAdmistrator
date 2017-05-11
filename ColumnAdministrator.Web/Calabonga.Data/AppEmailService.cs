using System.Net;
using System.Net.Mail;
using System.Text;
using Calabonga.Common.Contracts;
using Microsoft.AspNet.Identity;
using System.Threading.Tasks;

namespace Calabonga.Account.Data {

	public class AppEmailService : IIdentityMessageService {
		private readonly IConfigService<AppSettings> _configService;

		public AppEmailService(IConfigService<AppSettings> configService) {
			_configService = configService;
		}

		public Task SendAsync(IdentityMessage message) {

			using (var mailMessage = new MailMessage(_configService.Config.RobotEmail, message.Destination, message.Subject, message.Body)) {
				mailMessage.BodyEncoding = Encoding.UTF8;
				mailMessage.SubjectEncoding = Encoding.UTF8;
				mailMessage.IsBodyHtml = _configService.Config.IsHtmlForEmailMessagesEnabled;

				using (var client = new SmtpClient(_configService.Config.SmtpClient)) {
					client.Credentials = CredentialCache.DefaultNetworkCredentials;
					return client.SendMailAsync(mailMessage);
				}
			}
		}
	}
}
