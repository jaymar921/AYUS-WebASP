namespace AYUS_WebASP.Classes
{
    public static class Utility
    {

        public static Dictionary<string, string> JsonParse(this string dataObjects)
        {
            Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();

            try
            {
                string[] data = dataObjects.Split(new char[] { '\n' });

                for (int i = 0; i < data.Length; i++)
                {
                    string[] substr = data[i].Split(':');

                    if (substr.Length == 2)
                    {
                        string key = substr[0].Replace('"', ' ').Trim();
                        string value = substr[1].Replace('"', ' ').Replace(',', ' ').Trim();

                        keyValuePairs.Add(key, value);
                    }
                }

            }catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

            return keyValuePairs;
        }
    }
}
