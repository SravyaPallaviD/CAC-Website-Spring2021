using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using ChildAdvocacy.DataAccess;
using ChildAdvocacy.RequestModels;
using System.Text.Json;
using System.Text;
using System.Data;

namespace ChildAdvocacy.Controllers
{
    [ApiController]
    [Route("secure/api/get_userinfo")]
    public class Get_UserInfo : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            string cookie = HttpContext.Request.Cookies["cnfrm_cookie"];
            return Ok(OLTP_Query.DataTableToJSON(OLTP_Query.GetIdentityByToken(cookie)));
        }
    }

    [ApiController]
    [Route("secure/api/update_userinfo")]
    public class Update_UserInfo : ControllerBase
    {
        [HttpPost]
        public IActionResult Post([FromBody] UpdateAccountModel data)
        {
            //TODO: Add request check to ensure that all data is not null.
            //TODO: Call the UpdateAccount /*PROTO*/ bool OLTP_Commit.UpdateAccount(UpdateAccount data);
            //TODO: Return status codes appropriately
            string cookie = HttpContext.Request.Cookies["cnfrm_cookie"];
            if(OLTP_Commit.UpdateAccount(data,cookie))
                return Ok();
            else
                return BadRequest();
        }
    }

    [ApiController]
    [Route("secure/api/purge_usersession")]
    public class Purge_UserSession : ControllerBase
    {
        [HttpPost]
        public IActionResult Post()
        {
            string cookie = HttpContext.Request.Cookies["cnfrm_cookie"];
            if(OLTP_Commit.PurgeSession(cookie))
                return Ok();
            else
                return BadRequest();
        }
    }


    [ApiController]
    [Route("secure/api/get_eventsbyrange")]
    public class GetAllEvents : ControllerBase
    {
        [HttpPost]
        public IActionResult Post([FromBody] EventRange ER)
        {
            DataTable dt = OLTP_Query.GetEventsByRange(ER.EventStartDateTm, ER.EventEndDateTm);
            
            
            if(dt != null)
            {
                dt.Columns.Add("title", typeof(System.String));
                //dt.Columns["EventStartDateTm"].ColumnName = "start";
                //dt.Columns["EventEndDateTm"].ColumnName = "end";
                foreach(DataRow row in dt.Rows)
                {
                    row["title"] = row["EventType"] + " CN:" + row["CaseKey"].ToString();
                }
                
                return Ok(OLTP_Query.DataTableToJSON(dt));
            }
            return Ok();
        }
    }

    [ApiController]
    [Route("secure/api/addevent")]
    public class AddEvent : ControllerBase
    {
        [HttpPost]
        public IActionResult Post([FromBody] AddEventModel em)
        {
            return Ok(OLTP_Commit.AddEvent(em));
        }
    }

    [ApiController]
    [Route("secure/api/editevent")]
    public class EditEvent : ControllerBase
    {
        [HttpPost]
        public IActionResult Post([FromBody] AddEventModel em)
        {
            return Ok(OLTP_Commit.EditEvent(em));
        }
    }

    [ApiController]
    [Route("secure/api/deleteevent")]
    public class DeleteEvent : ControllerBase
    {
        [HttpPost]
        public IActionResult Post(int EventKey)
        {
            return Ok(OLTP_Commit.DeleteEvent(EventKey));
        }
    }

    [ApiController]
    [Route("secure/api/get_eventtypes")]
    public class GetEventTypes : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            DataTable dt = OLTP_Query.GetEventTypes();

            if(dt != null)
            {
                return Ok(OLTP_Query.DataTableToJSON(dt));
            }
            
            return Ok();
        }
    }


    [ApiController]
    [Route("secure/api/admin/getall_approvedusers")]
    public class GetAll_ApprovedUsers : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(OLTP_Query.DataTableToJSON(OLTP_Query.GetAllApprovedUsers()));
        }
    }

    [ApiController]
    [Route("secure/api/admin/getall_nonapprovedusers")]
    public class GetAll_NonApprovedUsers : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            DataTable dt = new DataTable();
            dt = OLTP_Query.GetAllNonApprovedUsers();
            if(dt == null)
            {
                return Ok();
            }
            else
            {
                return Ok(OLTP_Query.DataTableToJSON(dt));
            }   
        }
    }

   

    [ApiController]
    [Route("secure/api/admin/activateuser")]
    public class ActivateUser : ControllerBase
    {
        [HttpPost]
        public IActionResult Post([FromBody] int key)
        {
            return Ok(OLTP_Commit.ActivateUser(key));
        }
    }

    [ApiController]
    [Route("secure/api/admin/deactivateuser")]
    public class DeactivateUser : ControllerBase
    {
        [HttpPost]
        public IActionResult Post([FromBody] int key)
        {
        
            return Ok(OLTP_Commit.DeactivateUser(key));
        }
    }

    [ApiController]
    [Route("secure/api/admin/makeuser_admin")]
    public class MakeUserAdmin : ControllerBase
    {
        [HttpPost]
        public IActionResult Post([FromBody] int key)
        {
           return Ok(OLTP_Commit.MakeUserAdmin(key));
        }
    }

    [ApiController]
    [Route("secure/api/admin/makeuser_nonadmin")]
    public class MakeUserNonAdmin : ControllerBase
    {
        [HttpPost]
        public IActionResult Post([FromBody] int key)
        {
           return Ok(OLTP_Commit.MakeUserNonAdmin(key));
        }
    }

    [ApiController]
    [Route("secure/api/admin/approveuser")]
    public class ApproveUser : ControllerBase
    {
        [HttpPost]
        public IActionResult Post([FromBody] int key)
        {
            return Ok(OLTP_Commit.ApproveUser(key));
        }
    }

    [ApiController]
    [Route("secure/api/admin/rejectuser")]
    public class RejectUser : ControllerBase
    {
        [HttpPost]
        public IActionResult Post([FromBody] int key)
        {
            return Ok(OLTP_Commit.RejectUser(key));
        }
    }

    /*
    [ApiController]
    [Route("secure/api/update_staffchildpic")]
    public class Update_StaffChildPic : ControllerBase
    {
        [HttpPost]
        public IActionResult Post(IFormFile img UpdateAccountModel data)
        {

        }
    }

    // secure/api/update_staffadultpic
    [ApiController]
    [Route("secure/api/update_staffadultpic")]
    public class Update_StaffAdultPic : ControllerBase
    {
        [HttpPost]
        public IActionResult Post([FromBody] UpdateAccountModel data)
        {

        }
    }
    */
    

}