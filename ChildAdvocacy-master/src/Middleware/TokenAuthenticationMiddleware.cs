using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using ChildAdvocacy.AccessControl;
using ChildAdvocacy.DataAccess;
using System;

namespace ChildAdvocacy.Middleware
{
    public class TokenAuthenticationMiddleware
    {
        private readonly RequestDelegate _next;

        public TokenAuthenticationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public Task Invoke(HttpContext httpContext)
        {
         
        
            string method = httpContext.Request.Method;

            

            if(method == "GET")
            {
                //If request type is GET, then they are trying to access secured static content.
                //Given the nature of an index.html being retreived from the server and static content 
                //being fetched (automatically by the browser), which are linked in that index.html,
                //the only way to secure this is with a Cookie. This opens the attack surface to a csrf
                //attack for retrieving default static files associated with the app portal. 
                //If such an attack is successful, they would only have access to the initial static content
                //renders the app portal, but since all requests (except for builk static content) are secured by
                //an access token in the authorization header of every valid request, that particular attack surface closes.

                //Check cookie only.
                httpContext = TokenAuthentication.TokenValidity(httpContext.Request.Cookies["cnfrm_cookie"], httpContext);

            }
            else
            {
                
                //Request type is POST (or other), meaning we inspect the Token and we inspect the Cookie.
                //The token can be sent in two basic formats. Either a hidden input in an html form
                //OR the authorization header of the request.

                string contype = httpContext.Request.ContentType;

                if(string.IsNullOrEmpty(httpContext.Request.Cookies["cnfrm_cookie"]))
                {
                    httpContext.Response.StatusCode = 401;
                    return Task.CompletedTask;
                }

                if(contype == null)
                {
                    httpContext.Response.StatusCode = 400;
                    return Task.CompletedTask;
                }

                if (contype.Equals("application/x-www-form-urlencoded")) //check null and if it is an html form.
                {
                    //Token in html form, very specific case (right after login).
                    httpContext = AccessControl.TokenAuthentication.TokenInFormAuthenticationMiddlewareHelper(httpContext);
                }
                else
                {
                    //Token in header
                    httpContext = AccessControl.TokenAuthentication.TokenInHeaderAuthenticationMiddlewareHelper(httpContext);
                }
            }
   
            //Final task check and action.
            if (httpContext.Response.StatusCode.Equals(200))
            {
                //if(httpContext.Request.PathBase == "/app")
                httpContext.Request.Method = "GET";

                return _next(httpContext);
                //Continue. User is authenticated
            }
            else //error 
            {
                return Task.CompletedTask;
            }
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class MiddlewareExtensions
    {
        public static IApplicationBuilder UseMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<TokenAuthenticationMiddleware>();
        }
    }
}
