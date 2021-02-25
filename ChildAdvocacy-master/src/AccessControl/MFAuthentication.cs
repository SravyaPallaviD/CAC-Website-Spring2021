using ChildAdvocacy.DataAccess;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using System.Data;
using System; 
namespace ChildAdvocacy.AccessControl
{
    public static class MFAuthentication
    {
        //This function:
        //  a. Initiates TokenInHeader for TokenAuthenticationMiddleware
        public static HttpContext MFAuthenticationMiddlewareHelper(HttpContext httpContext)
        {
            try
            {
                var request = httpContext.Request;
                string authHeader = request.Headers["Authorization"]; //its going to throw error if null.
                request.EnableBuffering();
                var buffer = new byte[Convert.ToInt32(request.ContentLength)];
                request.Body.ReadAsync(buffer, 0, buffer.Length);

                if (authHeader != null && authHeader.StartsWith("Bearer ") && !string.IsNullOrEmpty(buffer.ToString()))
                {
                    string Code = System.Text.Encoding.Default.GetString(buffer);
                    string Token = authHeader.Substring("Bearer ".Length).Trim();
                    int? Validity = OLTP_Query.IsMFValid(Token,Code);
                    if (Validity != null)
                    {
                        DataTable AccessControlRecord = OLTP_Query.GetIdentity((int)Validity);

                        //Generate Access Token
                        string AccessToken = Encoding.GeneralEncoding.GenerateToken(Token+Code);

                        //Store Access Token
                        OLTP_Commit.UpdateAccessControlToken(AccessControlRecord.Rows[0]["EmailAddress"].ToString(),AccessToken);

                        //Return Access Token
                        httpContext.Response.Headers.Add("Access-Control-Expose-Headers", "Authorization");

                        //Adds token to Authorization Header.
                        httpContext.Response.Headers.Add("Authorization", AccessToken);

                        //byte [] writebuff = BitConverter.GetBytes((int)Validity);
                        //httpContext.Response.Body.Write(writebuff,0,writebuff.Length);

                        httpContext.Response.StatusCode = 200;
                        return httpContext;
                    }
                    else
                    {
                        httpContext.Response.StatusCode = 401;
                        return httpContext;
                    }
                }
                else
                {
                    httpContext.Response.StatusCode = 401;
                    return httpContext;
                }
            }catch(Exception e)
            {
                return httpContext;
            }
        }
    }
}