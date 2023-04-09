using AYUS_WebASP.Classes;
using AYUS_WebASP.Data;
using AYUS_WebASP.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Security.Cryptography.Xml;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Security.Claims;

namespace AYUS_WebASP.Controllers
{
    [AllowAnonymous]
    public class AuthenticateController : Controller
    {
        private readonly DataRepository _dataRepository;
        public AuthenticateController(DataRepository data) 
        {
            _dataRepository = data;
        }
        [AllowAnonymous]
        public IActionResult Login()
        {
            AuthenticateModel authenticateModel = new AuthenticateModel();
            authenticateModel.allowSignUp = _dataRepository.AllowSignup;
            authenticateModel.apikey = _dataRepository.ApiKey;
            authenticateModel.apiUrl = _dataRepository.APIUrl;
            TempData["Message"] = "";
            return View(authenticateModel);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login(AuthenticateModel account)
        {
            account.allowSignUp = _dataRepository.AllowSignup;
            account.apikey = _dataRepository.ApiKey;
            account.apiUrl = _dataRepository.APIUrl;
            if (account == null)
            {
                return View(account);
            }

            string loginUrl = account.apiUrl + "/api/Account";
            
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(loginUrl);

            // add an accept header for JSON format
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.Add("AYUS-API-KEY", _dataRepository.ApiKey);
            client.DefaultRequestHeaders.Add("username", account.Username);
            client.DefaultRequestHeaders.Add("password", account.Password);

            HttpResponseMessage response = client.GetAsync("").Result;

            Dictionary<string, string> data = new Dictionary<string, string>();


            if (response == null)
            {
                TempData["Message"] = "Failed to call API";
                return View(account);
            }

            if (response.IsSuccessStatusCode)
            {
                string dataObjects = response.Content.ReadAsStringAsync().Result;
                data = dataObjects.JsonParse();
            }

            client.Dispose();

            if (!data.TryGetValue("Status", out string? status))
            {
                TempData["Message"] = "Error calling API";
                return View(account);
            }

            data.TryGetValue("Role", out string? role);
            data.TryGetValue("Lastname", out string? name);

            if (status.Equals("404") || role == null)
            {
                TempData["Message"] = "Account not found";
                return View(account);
            }

            if (!role.ToLower().Equals("admin"))
            {
                TempData["Message"] = "User is not an admin";
                return View(account);
            }


            // creating the user claim
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, name ?? account.Username),
                new Claim(ClaimTypes.Name, account.Username),
                new Claim(ClaimTypes.Role, "ADMIN")
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties { IsPersistent = account.remember });
 
            return Redirect("/");
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Redirect("/Authenticate/Login");
        }
    }
}
