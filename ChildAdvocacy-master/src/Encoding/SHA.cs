using System;
using System.Security.Cryptography;

namespace ChildAdvocacy.Encoding
{
    public static class SHA
    {
        //This function:
        //  a. hashes a string passed in using SHA256 and returns the hash
        public static string Hashit(string UnHashed)
        {
            string Hashed = SHA.GenerateSHA256String(UnHashed);
            return Hashed;
        }
        
        //add error handling if things don't work out, maybe reporting the error to the sysadmins and returning "error" message through the main bubble stream.
        public static string GenerateSHA256FromByteArr(byte[] byteArr)
        {
            SHA256 sha256 = SHA256Managed.Create();
            byte[] hash = sha256.ComputeHash(byteArr);
            //Console.Write(hash);
            return GetStringFromHash(hash);
        }
        public static string GenerateSHA256String(string inputString)
        {
            //start new thread here?
            SHA256 sha256 = SHA256Managed.Create();
            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(inputString);
            byte[] hash = sha256.ComputeHash(bytes);
            //Console.Write(hash);
            return GetStringFromHash(hash);
        }

        public static string GenerateSHA512String(string inputString)
        {
            SHA512 sha512 = SHA512Managed.Create();
            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(inputString);
            byte[] hash = sha512.ComputeHash(bytes);
            return GetStringFromHash(hash);
        }

        private static string GetStringFromHash(byte[] hash)
        {
            return Convert.ToBase64String(hash);
            //StringBuilder result = new StringBuilder();
            //for (int i = 0; i < hash.Length; i++)
            //{
            //    result.Append(hash[i].ToString("X2"));
            //    /*In more depth, the argument "X2" is a "format string" 
            //     * that tells the ToString() method how it should format 
            //     * the string. byte.ToString() without any arguments returns
            //     * the number in its natural decimal representation, with no padding.*/
            //}
            //return result.ToString();
        }

    }
}
