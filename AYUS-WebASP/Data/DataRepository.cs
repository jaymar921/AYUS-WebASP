namespace AYUS_WebASP.Data
{
    public class DataRepository
    {
        private bool allowSignup;
        private string api_key;
        private string api_url;
        public DataRepository() 
        {
            allowSignup = false;
            api_key = "API_SECRET-42e016b219421dc83d180bdee27f81dd";
            api_url = "http://192.168.1.50:5002";
        }

        public bool AllowSignup { get { return allowSignup; } }
        public string ApiKey { get { return api_key;} }
        public string APIUrl { get { return api_url; } }

    }
}
