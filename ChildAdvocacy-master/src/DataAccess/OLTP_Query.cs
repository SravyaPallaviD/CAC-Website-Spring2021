using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Xml;
using MySql.Data;
using MySql.Data.MySqlClient;

namespace ChildAdvocacy.DataAccess
{
    
    public static class OLTP_Query
    {
 
        public static DataTable GetIdentityByToken(string Token)
        {
            if(string.IsNullOrEmpty(Token))
                return null;

            string query = "SELECT * FROM AccessControl where Token = @tok";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@tok",
                MySqlDbType = MySqlDbType.VarChar,
                Value=Token
            });

            DataTable dt = StandardQuery(false,query,parms);

            if (dt == null || dt.Rows.Count == 0)
                return null;

            return dt;
        }

        public static DataTable GetIdentity(int UserId)
        {

            string query = "SELECT * FROM AccessControl where AccessControlKey = @usrid";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@usrid",
                MySqlDbType = MySqlDbType.Int64,
                Value=UserId
            });

            DataTable dt = StandardQuery(false,query,parms);

            if (dt == null || dt.Rows.Count == 0)
                return null;

            return dt;
        }

        public static DataTable GetIdentity(string UserId)
        {
            if(string.IsNullOrEmpty(UserId))
                return null;

            string query = "SELECT * FROM AccessControl where EmailAddress = @usrid";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@usrid",
                MySqlDbType = MySqlDbType.VarChar,
                Value=UserId
            });

            DataTable dt = StandardQuery(false,query,parms);

            if (dt == null || dt.Rows.Count == 0)
                return null;

            return dt;
        }

        //This function:
        //  a. Takes in a QueryString and a Dictionary<string,object> QueryParams.
        //  b. Creates a new MySql command and iterates through QueryParams, adding them as parameters.
        //  c. The above parameterization techniques elimainate sql injection threat vector.
        //  d. Executes the query and loads the results into a datatable, which is returned.
        public static DataTable StandardQuery(bool NonQuery, string QueryString, List<MySqlParameter> QueryParams)
        {
            try 
            {
                string connstring = "Server=localhost; database=childadvocacyoltp; UID=client; password=Purpletiger1!";
                using(MySqlConnection dbCon = new MySqlConnection(connstring))
                {
                    dbCon.Open();
                    string query = QueryString;
                    MySqlCommand cmd = new MySqlCommand(query, dbCon);
                    if(QueryParams != null)
                    {
                        foreach(MySqlParameter entry in QueryParams)
                        {
                            cmd.Parameters.Add(entry);
                        }
                    }
                    if(NonQuery)
                    {   
                        int numRowsUpdated = cmd.ExecuteNonQuery();
                        DataTable resultDT = new DataTable();
                        resultDT.Rows.Add();
                        resultDT.Columns.Add();
                        resultDT.Rows[0][0] = numRowsUpdated;
                        return resultDT;
                    }
                    else
                    {
                        var dataReader = cmd.ExecuteReader();           
                        DataTable resultDT = new DataTable();
                        resultDT.Load(dataReader);
                        return resultDT;
                    }
                }
            } 
            catch (Exception e)
            {
                //Username doesn't exist or other internal error.
                return null;
            }
        }
        
        //This function:
        //  a. Takes a UserId and Secret and determines if the credentials are valid based on:
        //      0. If the params are empty/null, return null
        //      1. If the account doesn't exist, return null
        //      2. If the password expired, return 9
        //      3. If the passed secret and database secret are equal, return 1
        //      4. If none of the above conditions are met, return null
        public static int? UserAuthentication(string UserId, string Secret)
        {    
            try
            { 
                if(string.IsNullOrEmpty(UserId) || string.IsNullOrEmpty(Secret))
                    return null;

                string query = "SELECT EffectiveThru, IsApproved,Secret,SecretExpirationTm FROM AccessControl where EmailAddress = @addr";

                List<MySqlParameter> parms = new List<MySqlParameter>();
                parms.Add(new MySqlParameter
                {
                    ParameterName = "@addr",
                    MySqlDbType = MySqlDbType.VarChar,
                    Value=UserId
                });

                DataTable dt = StandardQuery(false,query,parms);
                
                if (dt == null)
                    return null;

                DateTime? EffectiveThru = dt.Rows[0].Field<DateTime?>(0);
                SByte IsApproved = dt.Rows[0].Field<SByte>(1);
                string dbsecret = dt.Rows[0].Field<string>(2);
                DateTime SecretExpirationTm = dt.Rows[0].Field<DateTime>(3);

                if(IsApproved == 0 || EffectiveThru != null)
                    return 2; //account not active

                if(DateTime.UtcNow > SecretExpirationTm)
                    return 9; //password expired

                if(dbsecret == Secret)
                    return 1; //auth success

                return null; //auth fail
            } catch (Exception e) {
                //Username doesn't exist or other internal error.
                return null;
            }
           
        }

        //This function:
        //  a. Takes a Token and determines if it is valid based on:
        //      0. The token being checked is not null.
        //      1. The token exists.
        //      2. The account associated is active.
        //      3. The token is not expired.
        public static bool IsTokenValid(string Token)
        {

            if(string.IsNullOrEmpty(Token))
                return false; //incase client requests a null token

            string query = "SELECT IsApproved,Token,TokenExpirationTm FROM AccessControl where Token = @tok";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@tok",
                MySqlDbType = MySqlDbType.VarChar,
                Value=Token
            });

            DataTable dt = StandardQuery(false,query,parms);

            if (dt == null || dt.Rows.Count == 0)
                return false;

            SByte IsActive = dt.Rows[0].Field<SByte>(0);
            string dbToken = dt.Rows[0].Field<string>(1);
            DateTime TokenExpirationTm = dt.Rows[0].Field<DateTime>(2);

            if(IsActive == 0)
                return false; //account not active

            if(DateTime.UtcNow > TokenExpirationTm)
                return false; //token expiration

            return true;
            
        }

        public static int? IsMFValid(string MFToken, string MFCodeChallenge)
        {
            if(string.IsNullOrEmpty(MFToken) || string.IsNullOrEmpty(MFCodeChallenge))
                return null;

            string query = "SELECT AccessControlKey,IsApproved,mfCode, mfCodeExpirationTm FROM AccessControl where mfToken = @mftok";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@mftok",
                MySqlDbType = MySqlDbType.VarChar,
                Value=MFToken
            });

            DataTable dt = StandardQuery(false,query,parms);

            if (dt == null || dt.Rows.Count == 0)
                return null;

            int ACK = dt.Rows[0].Field<int>(0);
            SByte IsActive = dt.Rows[0].Field<SByte>(1);
            int RealMFCode = dt.Rows[0].Field<int>(2);
            DateTime mfCodeExpirationTm = dt.Rows[0].Field<DateTime>(3);

            if(IsActive == 0)
                return null; //account not active

            if(DateTime.UtcNow > mfCodeExpirationTm)
                return null; //token expiration

            if(RealMFCode != int.Parse(MFCodeChallenge))
                return null;

            return ACK;

        }

        public static bool IsUserExisting(string UserId)
        {
            if(string.IsNullOrEmpty(UserId))
                return false;

            string query = "SELECT EmailAddress FROM AccessControl where EmailAddress = @usrid";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@usrid",
                MySqlDbType = MySqlDbType.VarChar,
                Value=UserId
            });

            DataTable dt = StandardQuery(false,query,parms);

            if (dt == null || dt.Rows.Count == 0)
                return false;

            return true;

        }

        public static bool IsPhoneExisting(string PhoneNumber)
        {
            if(string.IsNullOrEmpty(PhoneNumber))
                return false;

            string query = "SELECT PhoneNumber FROM AccessControl where PhoneNumber = @phne";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@phne",
                MySqlDbType = MySqlDbType.VarChar,
                Value=PhoneNumber
            });

            DataTable dt = StandardQuery(false,query,parms);

            if (dt == null || dt.Rows.Count == 0)
                return false;

            return true;

        }

        public static DataTable GetAllApprovedUsers()
        {
            string query = "select FirstName, LastName, PhoneNumber, EmailAddress, AccessControlKey, IsApproved, EffectiveThru, IsAdmin from AccessControl where IsApproved = 1;";
            DataTable dt = StandardQuery(false,query,null);

            if (dt == null || dt.Rows.Count == 0)
                return null;

            return dt;           
        }

        public static DataTable GetAllNonApprovedUsers()
        {
            string query = "select FirstName, LastName, PhoneNumber, EmailAddress, AccessControlKey, IsApproved, EffectiveThru from AccessControl where IsApproved = 0;";
            DataTable dt = StandardQuery(false,query,null);

            if (dt == null || dt.Rows.Count == 0)
                return null;

            return dt;  

        }

        public static bool CheckEventDoubleBooked(DateTime StartDate, DateTime EndDate)
        {
             string query = "select * from ChildEvent " + 
             "where @srtdt > EventStartDateTm and @srtdt < EventEndDateTm " + 
             "and @enddt > EventStartDateTm and @enddt < EventEndDateTm;";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@srtdt",
                MySqlDbType = MySqlDbType.DateTime,
                Value=StartDate
            });

            parms.Add(new MySqlParameter
            {
                ParameterName = "@enddt",
                MySqlDbType = MySqlDbType.DateTime,
                Value=EndDate
            });

            DataTable dt = StandardQuery(false,query,parms);

            if (dt == null || dt.Rows.Count == 0) 
                return false;

            return true;  
        }
       
        public static bool CheckCaseExists(int CaseNumber)
        {
            string query = "select * from Case where CaseKey = @casenum;";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@casenum",
                MySqlDbType = MySqlDbType.Int64,
                Value=CaseNumber
            });

            DataTable dt = StandardQuery(false,query,parms);

            if (dt == null || dt.Rows.Count == 0)
                return false;

            return true;  

        }

        public static DataTable GetEventsByRange(DateTime StartDate, DateTime EndDate)
        {
            
            string query = "select ChildEventKey, CaseKey, accKeyInterviewer, EventType, Location, DATE_FORMAT(EventStartDateTm, '%Y-%m-%dT%T') as start, DATE_FORMAT(EventEndDateTm, '%Y-%m-%dT%T') as end from ChildEvent where EventStartDateTm >= @srtdt and EventEndDateTm <= @enddt order by EventStartDateTm;";
            List<MySqlParameter> parms = new List<MySqlParameter>();
            parms.Add(new MySqlParameter
            {
                ParameterName = "@srtdt",
                MySqlDbType = MySqlDbType.DateTime,
                Value=StartDate
            });

            parms.Add(new MySqlParameter
            {
                ParameterName = "@enddt",
                MySqlDbType = MySqlDbType.DateTime,
                Value=EndDate
            });

            DataTable dt = StandardQuery(false,query,parms);

            if (dt == null || dt.Rows.Count == 0)
                return null;

            return dt;  
        }

        public static DataTable GetEventTypes()
        {
            string query = "select distinct EventType from ChildEvent;";
            DataTable dt = StandardQuery(false,query,null);

            if (dt == null || dt.Rows.Count == 0)
                return null;

            return dt;  
        }

        //This function:
        //  a. Takes a DataTable object and serializes it to JSON in the form of a string, which is returned
        //  note: I think there may be a better, more succinct solution out there. 
        public static string DataTableToJSON(DataTable table)
        {
            var JSONString = new StringBuilder();
            if (table.Rows.Count > 0)
            {
                JSONString.Append("[");
                for (int i = 0; i < table.Rows.Count; i++)
                {
                    JSONString.Append("{");
                    for (int j = 0; j < table.Columns.Count; j++)
                    {
                        if (j < table.Columns.Count - 1)
                        {
                            JSONString.Append("\"" + table.Columns[j].ColumnName.ToString() + "\":" + "\"" + table.Rows[i][j].ToString() + "\",");
                        }
                        else if (j == table.Columns.Count - 1)
                        {
                            JSONString.Append("\"" + table.Columns[j].ColumnName.ToString() + "\":" + "\"" + table.Rows[i][j].ToString() + "\"");
                        }
                    }
                    if (i == table.Rows.Count - 1)
                    {
                        JSONString.Append("}");
                    }
                    else
                    {
                        JSONString.Append("},");
                    }
                }
                JSONString.Append("]");
            }
            return JSONString.ToString();
        }
    
    
    }

}


