namespace Calabonga.Common.Contracts
{
	public interface IEmailMessage
	{
		string MailTo { get; set; }

		string Subject { get; set; }
		
		string Body { get; set; }
	}
}