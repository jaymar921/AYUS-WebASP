namespace AYUS_WebASP.Models
{
    public class AuthenticateModel
    {
        public bool allowSignUp {  get; set; }
        public string apikey { get; set; } = string.Empty;
        public string apiUrl { get;set; } = string.Empty;

        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        public bool remember { get; set;} = false;

    }
}
