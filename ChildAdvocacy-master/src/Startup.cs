using System;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ChildAdvocacy.Middleware;
using Microsoft.Extensions.FileProviders;
using System.IO;
using Microsoft.Extensions.Configuration;

namespace ChildAdvocacy
{
    public class Startup
    {
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                  builder =>
                                  {
                                      builder
                                      .AllowAnyOrigin()
                                      .AllowAnyHeader()
                                      .AllowAnyMethod();
                                  });
            });

            services.AddControllers();
            services.AddRazorPages()
            .AddRazorPagesOptions(options =>
            {
                //Use the below line to change the default directory
                //for your Razor Pages.
                //options.RootDirectory = "/Pages/";
               
                //Use the below line to change the default
                //"landing page" of the application.
                options.Conventions.AddPageRoute("/Pages/index", "");
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseCors(MyAllowSpecificOrigins);
            }
            else
            {
                app.UseExceptionHandler("/Error");
                /* On HttpsRedirection and UseHsts...
                * https://security.stackexchange.com/questions/129273/whats-the-difference-between-using-hsts-and-doing-a-301-redirection
                * https://stackoverflow.com/questions/52556364/what-is-the-difference-between-usehttpsredirection-and-usehsts
                * Note that the default HSTS value is 30 days.
                * You may want to change this for production scenarios, 
                * see https://aka.ms/aspnetcore-hsts.
                */
                app.UseHttpsRedirection();
                app.UseHsts();
            }
            app.UseDefaultFiles();
            app.UseStaticFiles();

            /*https://stackoverflow.com/questions/57846127/what-are-the-differences-between-app-userouting-and-app-useendpoints*/
            app.UseRouting();

            
            //If the root url is requested, return the landing single page application.
            //this spa contains a landing page, login page, and registration page.
            app.Map("/gateway", cacgateway =>
            {
                StaticFileOptions cacgatewaybuild = new StaticFileOptions()
                {
                    FileProvider = new PhysicalFileProvider(
                        Path.Combine(
                            Directory.GetCurrentDirectory(),
                            "cacgateway/build"
                        )
                    )
                };

                cacgateway.UseStaticFiles(cacgatewaybuild);

                cacgateway.UseSpa(spa =>
                {
                    spa.Options.SourcePath = "cacgateway";
                    spa.Options.DefaultPageStaticFileOptions = cacgatewaybuild;      
                });

            });

            //This branch uses a custom Basic Authentication Middleware which takes in
            //credentials in accordance with https://tools.ietf.org/html/rfc7617.
            //If the credentials are valid, an access token is generated and returned via the response.
            //We are using Token based authentication, so XSRF is not an immediate threat vector 
            //app.UseGlobalXSRF(false); // isRequestValidAsync
            app.MapWhen(context => context.Request.Path.StartsWithSegments("/BasicAuthentication"), appBuilder =>
            {
                //short circuits in all conditions
                appBuilder.UseMiddleware<BasicAuthenticationMiddleware>();
            });

            app.MapWhen(context => context.Request.Path.StartsWithSegments("/mfauthentication"), appBuilder =>
            {
                //short circuits in all conditions
                appBuilder.UseMiddleware<MFAuthenticationMiddleware>();
            });

            app.Map("/app", appBuilder =>
            {
                appBuilder.UseMiddleware<TokenAuthenticationMiddleware>();

                StaticFileOptions cacportalbuild = new StaticFileOptions()
                {
                    FileProvider = new PhysicalFileProvider(
                        Path.Combine(
                            Directory.GetCurrentDirectory(),
                            "cacportal/build"
                        )
                    )
                };


                appBuilder.UseStaticFiles(cacportalbuild);

                appBuilder.UseSpa(spa =>
                {                  
                    spa.Options.SourcePath = "cacportal";
                    spa.Options.DefaultPageStaticFileOptions = cacportalbuild;
                });
             
            });


            app.UseWhen(context => context.Request.Path.StartsWithSegments("/secure/api"), appBuilder =>
            {
                //request auth passthrough
                appBuilder.UseMiddleware<TokenAuthenticationMiddleware>();
            });
           

            //map to api controllers here.
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                //endpoints.MapRazorPages();
            });

            app.Run(async (context) =>
            {
                context.Response.Redirect("/home");
                await context.Response.WriteAsync("cacrutherford.");
            });

        }
    }
}
