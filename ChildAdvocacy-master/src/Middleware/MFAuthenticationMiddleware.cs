using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using ChildAdvocacy.AccessControl;
using System;


namespace ChildAdvocacy.Middleware
{
    public class MFAuthenticationMiddleware
    {
        private readonly RequestDelegate _next;

        public MFAuthenticationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public Task Invoke(HttpContext httpContext)
        {
            
            string contype = httpContext.Request.ContentType;
            if (contype != null)
            {
                httpContext = AccessControl.MFAuthentication.MFAuthenticationMiddlewareHelper(httpContext);
            }
        

            return Task.CompletedTask;
            
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class MFAuthenticationMiddlewareExtensions
    {
        public static IApplicationBuilder UseMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<MFAuthenticationMiddleware>();
        }
    }
}