using ChildAdvocacy.DataAccess;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace ChildAdvocacy.AccessControl
{
    public static class TokenAuthentication
    {

        //This function:
        //  a. Initiates TokenInFormAuthentication for TokenAuthenticationMiddleware
        public static HttpContext TokenInFormAuthenticationMiddlewareHelper(HttpContext httpContext)
        {

            if (httpContext.Request.Form.TryGetValue("Token", out StringValues Token)) //!= null was here //Good Request
            {
                if(Token != httpContext.Request.Cookies["cnfrm_cookie"])
                {
                    httpContext.Response.StatusCode = 401;
                    return httpContext;
                }

                return TokenValidity(Token,httpContext);

            }
            else //Bad Request
            {
                httpContext.Response.StatusCode = 401;
                return httpContext;
            }
        }

        public static HttpContext TokenValidity(string Token, HttpContext httpContext)
        {
            if (OLTP_Query.IsTokenValid(Token))
            {
                httpContext.Response.StatusCode = 200;
                return httpContext;
            }
            else
            {
                httpContext.Response.StatusCode = 401;
                return httpContext;
            }
        }

        //This function:
        //  a. Initiates TokenInHeader for TokenAuthenticationMiddleware
        public static HttpContext TokenInHeaderAuthenticationMiddlewareHelper(HttpContext httpContext)
        {
            string authHeader = httpContext.Request.Headers["Authorization"]; //its going to throw error if null.

            if (authHeader != null && authHeader.StartsWith("Bearer "))
            {
                string Token = authHeader.Substring("Bearer ".Length).Trim();

                if(Token != httpContext.Request.Cookies["cnfrm_cookie"])
                {
                    httpContext.Response.StatusCode = 401;
                    return httpContext;
                }

                return TokenValidity(Token,httpContext);
            }
            else
            {
                httpContext.Response.StatusCode = 401;
                return httpContext;
            }
        }
    }
}
