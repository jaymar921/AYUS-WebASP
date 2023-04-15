using AYUS_WebASP.Classes;
using AYUS_WebASP.Data;
using AYUS_WebASP.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Net;
using System;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text.Json;
using System.Reflection.Metadata;
using System.Text;

namespace AYUS_WebASP.Controllers
{
    [AllowAnonymous]
    public class GcashController : Controller
    {
        JsonSerializerOptions options = new JsonSerializerOptions { WriteIndented = true };
        private readonly ILogger<GcashController> _logger;
        private readonly WEBConfig _wEBConfig;

        public GcashController(ILogger<GcashController> logger, WEBConfig wEBConfig)
        {
            _logger = logger;
            _wEBConfig = wEBConfig;
        }

        public IActionResult Index(GCashModel model)
        {
            
            return View(model);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("gcashpayment")]
        public async Task<JsonResult> Post([FromBody] ReturnModel model)
        {
            String[] arr = model.AYUS.Split('_');
            try
            {
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(_wEBConfig.ApiUrl + "/api/Wallet?uuid=" + arr[2]);

                // add an accept header for JSON format
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.DefaultRequestHeaders.Add("AYUS-API-KEY", _wEBConfig.ApiKey);

                HttpResponseMessage response = client.GetAsync("").Result;

                Dictionary<string, string> data = new Dictionary<string, string>();



                if (response.IsSuccessStatusCode)
                {
                    string dataObjects = response.Content.ReadAsStringAsync().Result;
                    data = dataObjects.JsonParse();
                }

                client.Dispose();
                data.TryGetValue("Balance", out string? bal);
                Int32.TryParse(bal, out int balance);

                string newbal = (Int32.Parse(arr[4]) + balance).ToString();

                // POST
                HttpClient clientTest = new HttpClient();
                clientTest.DefaultRequestHeaders.Add("AYUS-API-KEY", _wEBConfig.ApiKey);
                clientTest.DefaultRequestHeaders.Add("newbalance", newbal);
                HttpRequestMessage httpRequest = new HttpRequestMessage(HttpMethod.Post, _wEBConfig.ApiUrl + "/api/Wallet?uuid=" + arr[2]);

                httpRequest.Content = new StringContent("", Encoding.UTF8, "application/json");
                
                var r = await clientTest.PutAsync(httpRequest.RequestUri, httpRequest.Content);

                return Json(new { Status = 200, Message = "Success" }, options);
            }
            catch (Exception ex)
            {
                return Json(new { Status = 400, Message = ex.Message }, options);
            }
            
        }
    }
}
