namespace AYUS_WebASP.Data
{
    public class DataRepository
    {
        private bool allowSignup;
        public DataRepository() 
        {
            allowSignup = false;
        }

        public bool AllowSignup { get { return allowSignup; } set { allowSignup = value; } }

    }
}
