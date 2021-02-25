using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System;
using ChildAdvocacy.RequestModels;
using ChildAdvocacy.DataAccess;
using ChildAdvocacy.Encoding;

namespace ChildAdvocacy.Controllers
{
    

    [ApiController]
    [Route("public/api/request_account")]
    public class RequestAccount : ControllerBase
    {
        [HttpPost]
        public IActionResult Post([FromBody] RequestAccountModel data)
        {
            //TODO: Add request check to ensure that all data is not null.

            //Decode and hash
            data.Password = GeneralEncoding.FromBase64(data.Password);
            data.Password = SHA.Hashit(data.Password);
            
            if(OLTP_Query.IsUserExisting(data.EmailAddress))
                return BadRequest("User already exists.");
            
            if(OLTP_Query.IsPhoneExisting(data.PhoneNumber))
                return BadRequest("Phone number already exists.");

            if(OLTP_Commit.AddAccount(data))
                return Ok("Success");

            return BadRequest();
        }
    }

    [ApiController]
    [Route("public/api/forgotpw")]
    public class ForgotPw : ControllerBase
    {
        [HttpPost]
        public IActionResult Post([FromBody] string EmailAddress)
        {
            //Check if email address exists.
            if(OLTP_Query.IsUserExisting(EmailAddress))
            {
                //if email address exists, generate authentication token, set it in db,
                //and set ForgotPWRequested flag true.
                string token = ChildAdvocacy.AccessControl.BasicAuthentication.GenerateToken(EmailAddress + DateTime.Now.ToString());
                if(OLTP_Commit.UpdateAccessControlToken(EmailAddress,token)
                && OLTP_Commit.SetForgotPWRequested(EmailAddress))
                {
                    //send user an email at that email address with a link to reset password...
                    //Something like: https://cacrutherford.org/gateway#/openresetpassword/email=sa.variable@gmail.com signature=longauthtoken
                    string message = "This is an official email from the Child Advocacy Center of Canon and Rutherford counties.\n"+
                    "You have requested to reset your password.\nPlease follow the link below to reset your password.\n\n"+
                    $"https://localhost:5001/gateway#/openresetpassword?email={EmailAddress}&signature={token}";

                    
                    if(Tooling.Tooling.SmtpInvoker(EmailAddress,message,"CAC Password Reset!"))
                    {
                        return Ok("Success!");
                    }
                }
                
            }

            return BadRequest("Something went wrong");
        }
    }
}