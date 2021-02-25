using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

using System.Text;
using MySql.Data.MySqlClient;
using ChildAdvocacy.RequestModels;


namespace ChildAdvocacy.DataAccess
{
    public static class OLTP_Commit
    {

        public static bool UpdateMultiFactorToken(string UserId, string Token, Int64 Code)
        {
            string command = "Update AccessControl set mfToken = @tok, mfCode = @mfcode, mfCodeExpirationTm = @mfexpr where EmailAddress = @UsrId;";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@tok",
                MySqlDbType = MySqlDbType.VarChar,
                Value=Token
            });

            parms.Add(new MySqlParameter
            {
                ParameterName = "@UsrId",
                MySqlDbType = MySqlDbType.VarChar,
                Value=UserId
            });

            parms.Add(new MySqlParameter
            {
                ParameterName = "@mfcode",
                MySqlDbType = MySqlDbType.Int64,
                Value=Code
            });

            parms.Add(new MySqlParameter
            {
                ParameterName = "@mfexpr",
                MySqlDbType = MySqlDbType.DateTime,
                Value= DateTime.UtcNow.AddMinutes(5)
            });

            DataTable dt = OLTP_Query.StandardQuery(true,command,parms);

            if (dt == null)
                return false;
                    
            return true;
        }

        //Takes newly generated token and updates it by the UserId
        public static bool UpdateAccessControlToken(string UserId, string Token)
        {
            string command = "Update AccessControl set Token = @tok, TokenExpirationTm = @tokexpr where EmailAddress = @UsrId;";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@tok",
                MySqlDbType = MySqlDbType.VarChar,
                Value=Token
            });

            parms.Add(new MySqlParameter
            {
                ParameterName = "@UsrId",
                MySqlDbType = MySqlDbType.VarChar,
                Value=UserId
            });

            parms.Add(new MySqlParameter
            {
                ParameterName = "@tokexpr",
                MySqlDbType = MySqlDbType.DateTime,
                Value=DateTime.UtcNow.AddHours(24)
            });

            DataTable dt = OLTP_Query.StandardQuery(true,command,parms);

            if (dt == null)
                return false;
                    
            return true;
        }

        public static bool AddAccount(RequestAccountModel data)
        {
            string command = "Insert into AccessControl set"+
                            " FirstName = @frst,"+
                            "LastName = @lst,"+ 
                            "EmailAddress = @eml,"+
                            "Secret = @scrt,"+
                            "SecretExpirationTm = @scrtexp,"+
                            "IsApproved =@actve,"+
                            "IsAdmin =@isadmn,"+
                            "Carrier = @carr,"+
                            "PhoneNumber = @phne;";

            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@frst",
                MySqlDbType = MySqlDbType.VarChar,
                Value=data.FirstName
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@lst",
                MySqlDbType = MySqlDbType.VarChar,
                Value=data.LastName
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@eml",
                MySqlDbType = MySqlDbType.VarChar,
                Value=data.EmailAddress
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@scrt",
                MySqlDbType = MySqlDbType.VarChar,
                Value=data.Password
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@phne",
                MySqlDbType = MySqlDbType.VarChar,
                Value=data.PhoneNumber
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@actve",
                MySqlDbType = MySqlDbType.Int16,
                Value=0
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@isadmn",
                MySqlDbType = MySqlDbType.Int16,
                Value=0
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@scrtexp",
                MySqlDbType = MySqlDbType.DateTime,
                Value=DateTime.UtcNow.AddMonths(6)
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@carr",
                MySqlDbType = MySqlDbType.VarChar,
                Value=data.Carrier
            });

            DataTable dt = OLTP_Query.StandardQuery(true,command,parms);

            if (dt == null)
                return false;
                    
            return true;
        }
    
        public static bool UpdateAccount(UpdateAccountModel data, string token) 
        {
            string command = "Update AccessControl set "+
                            "FirstName = @frst,"+
                            "LastName = @lst,"+ 
                            "EmailAddress = @eml,"+
                            "Carrier = @carr,"+
                            "PhoneNumber = @phne where Token = @tok ;";

            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@frst",
                MySqlDbType = MySqlDbType.VarChar,
                Value=data.FirstName
            });

            parms.Add(new MySqlParameter
            {
                ParameterName = "@lst",
                MySqlDbType = MySqlDbType.VarChar,
                Value=data.LastName
            });

            parms.Add(new MySqlParameter
            {
                ParameterName = "@eml",
                MySqlDbType = MySqlDbType.VarChar,
                Value=data.EmailAddress
            });
   
            parms.Add(new MySqlParameter
            {
                ParameterName = "@phne",
                MySqlDbType = MySqlDbType.VarChar,
                Value=data.PhoneNumber
            });

            parms.Add(new MySqlParameter
            {
                ParameterName = "@carr",
                MySqlDbType = MySqlDbType.VarChar,
                Value=data.Carrier
            });

            parms.Add(new MySqlParameter
            {
                ParameterName = "@tok",
                MySqlDbType = MySqlDbType.VarChar,
                Value=token
            });

            DataTable dt = OLTP_Query.StandardQuery(true,command,parms);

            if (dt == null)
                return false;
                    
            return true;
        }

        public static bool PurgeSession(string token) {
            string command = "Update AccessControl set "+
                            "Token = null,"+
                            "TokenExpirationTm = null,"+ 
                            "mfCodeExpirationTm = null,"+
                            "mfCode = null where Token = @tok ;";

            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@tok",
                MySqlDbType = MySqlDbType.VarChar,
                Value=token
            });

            DataTable dt = OLTP_Query.StandardQuery(true,command,parms);

            if (dt == null)
                return false;
                    
            return true;

        }

        public static bool ActivateUser(int AccessControlKey)
        {
            string query = "update AccessControl set EffectiveThru = null where AccessControlKey = @ack;";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@ack",
                MySqlDbType = MySqlDbType.Int32,
                Value=AccessControlKey
            });
            DataTable dt = OLTP_Query.StandardQuery(true,query,parms);

            if (dt == null || dt.Rows.Count == 0)
                return false;

            return true;  
        }

        public static bool DeactivateUser(int AccessControlKey)
        {
            string query = "update AccessControl set EffectiveThru = @eft where AccessControlKey = @ack;";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@eft",
                MySqlDbType = MySqlDbType.DateTime,
                Value=DateTime.Now
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@ack",
                MySqlDbType = MySqlDbType.Int32,
                Value=AccessControlKey
            });

            DataTable dt = OLTP_Query.StandardQuery(true,query,parms);

            if (dt == null || dt.Rows.Count == 0)
                return false;

            return true;  
        }

        public static bool MakeUserAdmin(int AccessControlKey)
        {
            string query = "update AccessControl set IsAdmin = 1 where AccessControlKey = @ack;";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@ack",
                MySqlDbType = MySqlDbType.Int16,
                Value=AccessControlKey
            });
            
            DataTable dt = OLTP_Query.StandardQuery(true,query,parms);

            if (dt == null || dt.Rows.Count == 0)
                return false;

            return true;  
        }

        public static bool MakeUserNonAdmin(int AccessControlKey)
        {
            string query = "update AccessControl set IsAdmin = 0 where AccessControlKey = @ack;";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@ack",
                MySqlDbType = MySqlDbType.Int16,
                Value=AccessControlKey
            });
            
            DataTable dt = OLTP_Query.StandardQuery(true,query,parms);

            if (dt == null || dt.Rows.Count == 0)
                return false;

            return true;  
        }

        public static bool ApproveUser(int AccessControlKey)
        {
            string query = "update AccessControl set IsApproved = 1 where AccessControlKey = @ack;";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@ack",
                MySqlDbType = MySqlDbType.Int16,
                Value=AccessControlKey
            });
            DataTable dt = OLTP_Query.StandardQuery(true,query,parms);

            if (dt == null || dt.Rows.Count == 0)
                return false;

            return true;  

        }

        public static bool RejectUser(int AccessControlKey) 
        {
            string query = "Delete from AccessControl where AccessControlKey = @ack;";  
             List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@ack",
                MySqlDbType = MySqlDbType.Int16,
                Value=AccessControlKey
            });
            DataTable dt = OLTP_Query.StandardQuery(true,query,parms); 
            if (dt == null || dt.Rows.Count == 0)
                return false;

            return true;  
        }        
    
        public static bool AddEvent(AddEventModel Event)
        {
              string query = "Insert into ChildEvent set "+
              "ChildEventKey = @cek, "+
              "CaseKey = @ck, "+
              "accKeyInterviewer = @aci, "+
              "EventType = @et, "+
              "Location = @loc, "+
              "EventStartDateTm = @esd, "+
              "EventEndDateTm = @eed;";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@cek",
                MySqlDbType = MySqlDbType.Int64,
                Value=Event.ChildEventKey
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@ck",
                MySqlDbType = MySqlDbType.Int64,
                Value=Event.CaseKey
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@aci",
                MySqlDbType = MySqlDbType.Int64,
                Value=Event.accKeyInterviewer
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@et",
                MySqlDbType = MySqlDbType.VarChar,
                Value=Event.EventType
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@loc",
                MySqlDbType = MySqlDbType.VarChar,
                Value=Event.Location
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@esd",
                MySqlDbType = MySqlDbType.DateTime,
                Value=Event.EventStartDateTm
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@eed",
                MySqlDbType = MySqlDbType.DateTime,
                Value=Event.EventEndDateTm
            });



            DataTable dt = OLTP_Query.StandardQuery(true,query,parms);

            if (dt == null || dt.Rows.Count == 0)
                return false;

            return true;  
        }

        public static bool EditEvent(AddEventModel Event)
        {
            string query = "Update ChildEvent set "+
              "CaseKey = @ck, "+
              "accKeyInterviewer = @aci, "+
              "EventType = @et, "+
              "Location = @loc, "+
              "EventStartDateTm = @esd, "+
              "EventEndDateTm = @eed where ChildEventKey = @cek;";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@cek",
                MySqlDbType = MySqlDbType.Int64,
                Value=Event.ChildEventKey
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@ck",
                MySqlDbType = MySqlDbType.Int64,
                Value=Event.CaseKey
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@aci",
                MySqlDbType = MySqlDbType.Int64,
                Value=Event.accKeyInterviewer
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@et",
                MySqlDbType = MySqlDbType.VarChar,
                Value=Event.EventType
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@loc",
                MySqlDbType = MySqlDbType.VarChar,
                Value=Event.Location
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@esd",
                MySqlDbType = MySqlDbType.DateTime,
                Value=Event.EventStartDateTm
            });
            parms.Add(new MySqlParameter
            {
                ParameterName = "@eed",
                MySqlDbType = MySqlDbType.DateTime,
                Value=Event.EventEndDateTm
            });

            DataTable dt = OLTP_Query.StandardQuery(true,query,parms);

            if (dt == null || dt.Rows.Count == 0)
                return false;

            return true;  
        }

        public static bool DeleteEvent(int EventKey)
        {
            string query = "Delete from ChildEvent where ChildEventKey = @cek;";  
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@cek",
                MySqlDbType = MySqlDbType.Int64,
                Value=EventKey
            });
            DataTable dt = OLTP_Query.StandardQuery(true,query,parms); 
            if (dt == null || dt.Rows.Count == 0)
                return false;

            return true;  
        }

        public static bool SetForgotPWRequested(string UserId)
        {
            string command = "Update AccessControl set ForgotPWRequested = 1, where EmailAddress = @usrid;";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@usrid",
                MySqlDbType = MySqlDbType.VarChar,
                Value=UserId
            });

            DataTable dt = OLTP_Query.StandardQuery(true,command,parms);

            if (dt == null)
                return false;
                    
            return true;
        }
    }

}
