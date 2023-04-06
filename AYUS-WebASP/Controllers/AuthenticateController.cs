using Microsoft.AspNetCore.Mvc;

namespace AYUS_WebASP.Controllers
{
    public class AuthenticateController : Controller
    {
        public IActionResult Login()
        {
            return View();
        }
    }
}
