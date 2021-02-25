using System;

namespace ChildAdvocacy.Encoding
{
    public static class GeneralEncoding
    {
        public static string FromBase64(string Encoded)
        {
            //Had to access from system namespace since there is a conflict in microsoft vs atmosphere naming.
            //Maybe we should just extend the .net encoding namespace?
            //Exists in SHA as well.
            string Decoded = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(Encoded));
            return Decoded;
        }

        //This function:
        //  a. Generates a token by hashing whatever is passed in.
        public static string GenerateToken(string unHashedToken)
        {
            string rnd = RandomGenerators.RandomString();
            unHashedToken.Insert(0,rnd);
            return SHA.Hashit(unHashedToken);  
        }
    }
}
