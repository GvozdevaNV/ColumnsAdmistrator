namespace Calabonga.Dreamhome.Contracts
{

	public interface IConfigService {

		/// <summary>
		/// ��������� �� ������� ������� �������
		/// </summary>
		bool IsLogging { get; }

		/// <summary>
		/// ������������ �������
		/// </summary>
		int DefaultPageSize { get; }

		/// <summary>
		/// ����� ����������� ����� ��� ����������� ��� �������� ��� ����� �������������
		/// </summary>
		string RobotEmail { get; }

		/// <summary>
		/// ����� ����������� ����� �������������� �����
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