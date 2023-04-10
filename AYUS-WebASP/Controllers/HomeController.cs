using AYUS_WebASP.Classes;
using AYUS_WebASP.Data;
using AYUS_WebASP.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Text.Json;

namespace AYUS_WebASP.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly WEBConfig _webConfig;

        public HomeController(ILogger<HomeController> logger, WEBConfig wEBConfig)
        {
            _logger = logger;
            _webConfig = wEBConfig;
        }

        [Authorize]
        public IActionResult Index()
        {
            HomeModel homeModel = new HomeModel()
            {
                APIKEY = _webConfig.ApiKey,
                APIURL = _webConfig.ApiUrl
            };
            return View(homeModel);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [Authorize]
        [HttpPost]
        [Route("SendMail")]
        public JsonResult SendMail([FromBody]EmailModel emailModel)
        {
            JsonSerializerOptions options = new JsonSerializerOptions { WriteIndented = true };

            _logger.LogInformation("Email API was called with info => "+emailModel);
            Console.WriteLine(emailModel.Email);
            Console.WriteLine(emailModel.Body);
            Console.WriteLine(emailModel.Subject);
            Console.WriteLine(_webConfig.EmailSender_Email);
            Console.WriteLine(_webConfig.EmailSender_Password);

            if (MailSender.SendMail(emailModel.Email, emailModel.Subject, emailModel.Body, _webConfig.EmailSender_Email, _webConfig.EmailSender_Password)) 
                return Json(new { Status = 200, Message = "Email was sent" }, options);
            return Json(new { Status = 400, Message = "Error" }, options);
        }
    }
}