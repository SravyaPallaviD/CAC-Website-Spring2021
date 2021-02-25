using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;
using System;
namespace ChildAdvocacy.Tooling
{
    public class Tooling
    {
        public static string DetermineCarrierAddress(string carrier)
        {
            switch(carrier)
            {
                case "Verizon":
                    return "@vtext.com";
                case "Sprint":
                    return "@messaging.sprintpcs.com";
                case "AT@T":
                    return "@txt.att.net";
                case "T-Mobile":
                    return "@tmomail.net";
                case "Cricket":
                    return "@sms.cricketwireless.net";
                default:
                    return null;
            }
        }
        public static int GenerateMFACode()
        {
            //Generate Authentication Code
            Random rnd = new Random();
            return rnd.Next(10000, 99999);

        }
         //smtp invoker for cacrutherfordsoftware@gmail.com
        public static bool SmtpInvoker(string To, string body, string Subject = "")
        {
            try
            {

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("cacrutherfordsoftware@gmail.com"));
                message.To.Add(new MailboxAddress(To));
                message.Subject = Subject;

                message.Body = new TextPart("plain")
                {
                    Text = body
                };

                using (var client = new SmtpClient())
                {
                    // For demo-purposes, accept all SSL certificates (in case the server supports STARTTLS)
                    client.ServerCertificateValidationCallback = (s, c, h, pe) => true;

                    client.Connect("smtp.gmail.com", 587, false);

                    // Note: only needed if the SMTP server requires authentication
                    client.Authenticate("cacrutherfordsoftware@gmail.com", "zdoasixemwavbhvn");

                    client.Send(message);

                    client.Disconnect(true);
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}