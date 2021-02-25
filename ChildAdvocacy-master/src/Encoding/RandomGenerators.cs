using System.Security.Cryptography;

namespace ChildAdvocacy.Encoding
{
    public static class RandomGenerators
    {
        private static RNGCryptoServiceProvider rngCsp = new RNGCryptoServiceProvider();
        public static string RandomString()
        {
            byte[] randomByteArr = new byte[2048];
            rngCsp.GetBytes(randomByteArr);
            return SHA.GenerateSHA256FromByteArr(randomByteArr);
        }

    }
}
