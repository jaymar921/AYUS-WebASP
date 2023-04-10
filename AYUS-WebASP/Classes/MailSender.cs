using System.Net.Mail;

namespace AYUS_WebASP.Classes
{
    public class MailSender
    {
        public static bool SendMail(string recipient, string subject, string body, string cred_email, string cred_pass)
        {
            try
            {
                MailMessage mm = new MailMessage();
                SmtpClient smtp = new SmtpClient();

                mm.From = new MailAddress(cred_email, "AYUS@no-reply", System.Text.Encoding.UTF8);
                mm.To.Add(new MailAddress(recipient));
                mm.Subject = subject;
                mm.Body = @$"
                <html>
                <body style='background-color: #074873;padding: 25px;'>
                    <div style='position: absolute;width: 250px;left: 50%;top: 50%;transform: translate(-50%,-50%);text-align: center;border: 1px solid white;background-color: white;padding: 20px;border-radius: 15px;'>
                        <div style='width: 100%;'>
                            <img style='width: auto;height: 96px;' src='https://raw.githubusercontent.com/jaymar921/AYUS-WebASP/master/AYUS-WebASP/wwwroot/img/logo.png'>
                        </div>
                        <h3>{subject}</h3>
                        <p style='position: relative;left: 50%; transform: translateX(-50%);white-space: pre-line; width: 80%; text-align: justify; padding: 20px; background-color: rgba(0,0,0,0.1); font-size: 13px; border-radius: 8px;'>{body}</p>
                        <p style='font-size: 10px; font-weight: 800; color: gray'>ICTEAM © AYUS - All rights are reserved</p>
        
        
                    </div>
                </body>
                </html>
             ";

                mm.IsBodyHtml = true;
                smtp.Host = "smtp.gmail.com";
                /*
                if (ccAdd != "")
                {
                    mm.CC.Add(ccAdd);
                }
                */
                smtp.EnableSsl = true;
                System.Net.NetworkCredential NetworkCred = new System.Net.NetworkCredential();
                NetworkCred.UserName = cred_email;//gmail user name
                NetworkCred.Password = cred_pass;// password
                smtp.Credentials = NetworkCred;
                smtp.Port = 587; //Gmail port for e-mail 465 or 587
                smtp.Send(mm);

            }
            catch(Exception ex) 
            {
                Console.WriteLine(ex.Message);
                return false; 
            }
            return true;
        }
    }
}
