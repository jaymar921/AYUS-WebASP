using AYUS_WebASP.Data;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace AYUS_WebASP
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllersWithViews();
            builder.Services.AddSingleton<DataRepository>();


            // responsible for redirecting admins that have not logged in yet
            builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
                options =>
                {
                    options.LoginPath = new PathString("/Authenticate/login");
                });


            builder.Services.AddSingleton<WEBConfig>(new WEBConfig()
            {
                ApiKey = builder.Configuration["API_KEY"],
                ApiUrl = builder.Configuration["API_URL"],
                EmailSender_Email = builder.Configuration["SMTP_EMAIL"],
                EmailSender_Password = builder.Configuration["SMTP_PASS"]
            });



            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            // responsible for adding authentication
            app.UseAuthentication();

            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }
    }
}