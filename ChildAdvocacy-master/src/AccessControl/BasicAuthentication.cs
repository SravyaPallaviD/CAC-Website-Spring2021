using ChildAdvocacy.DataAccess;
using ChildAdvocacy.Encoding;
using Microsoft.AspNetCore.Http;
using System;
using ChildAdvocacy.Tooling;
using System.Data;

namespace ChildAdvocacy.AccessControl
{
    
    public static class BasicAuthentication
    {
        //TODO: what about error 500? and descr
        //This function:
        //  a. Initiates BasicAuthentication for BasicAuthenticationMiddleware
        public static HttpContext BasicAuthenticationMiddlewareHelper(HttpContext httpContext)
        {
            
            //Gets the Authorization Header.
            //TODO: What happens if there is no Authorization header? -- Should be null apparently
            string authHeader = httpContext.Request.Headers["Authorization"];

            if (authHeader != null && authHeader.StartsWith("Basic "))
            {
                //stores token based on auth process. Returns null if failed.
                //BasicAuthResult = AccessControl.BasicAuthentication(authHeader);

                //Dissect header here.
                DissectAuthorizationHeader_Basic(authHeader, out string UserId, out string Secret);

                //Now we have userid and secret decoded from the authorization header.


                //Returns token if validated. Else returns null.
                string Validity = VerifyCredentials(UserId, Secret);
                
               

                if (Validity != null)
                {
                    httpContext.Response.Headers.Add("Access-Control-Expose-Headers", "Authorization");
                    //Adds token to Authorization Header.
                    httpContext.Response.Headers.Add("Authorization", Validity); //Validity is token

                    /* 204 NO CONTETNT:
                     * The server has fulfilled the request but does not need to return an entity-body, 
                     * and might want to return updated metainformation. The response MAY include new or
                     * updated metainformation in the form of entity-headers, which if present SHOULD be 
                     * associated with the requested variant.
                     * If the client is a user agent, it SHOULD NOT change its document view from that which
                     * caused the request to be sent. This response is primarily intended to allow input for 
                     * actions to take place without causing a change to the user agent's active document view,
                     * although any new or updated metainformation SHOULD be applied to the document currently 
                     * in the user agent's active view. The 204 response MUST NOT include a message-body, and 
                     * thus is always terminated by the first empty line after the header fields. Here, we are 
                     * only updating header(s) such as Authorization.
                     */
                    
                    httpContext.Response.StatusCode = 204;
                    return httpContext;

                }
                else
                {

                    httpContext.Response.Headers.Add("Access-Control-Expose-Headers", "Authorization");

                    //Unauthorized. Send Challenge. Realm is not relevant anymore
                    //https://tools.ietf.org/html/rfc7617

                    //change localhost realm to url ClassAndField.Everonics.com or whatever...I don't know where I found 
                    //That realms are not necessary, but if you don't have a realm, chrome pops up a modal sign in.
                    //httpContext.Response.Headers.Add("WWW-Authenticate", "Basic realm=\"localhost\" charset=\"UTF - 8\""); 
                    //Apparently chrome is takes over when the WWW-Authenticate header is sent. So we are not using it
                    /* 401 UNAUTHORIZED:
                     * The request requires user authentication. The response MUST include a WWW-Authenticate header
                     * field (section 14.47) containing a challenge applicable to the requested resource. The client
                     * MAY repeat the request with a suitable Authorization header field (section 14.8). If the request
                     * already included Authorization credentials, then the 401 response indicates that authorization
                     * has been refused for those credentials. If the 401 response contains the same challenge as the
                     * prior response, and the user agent has already attempted authentication at least once, then the
                     * user SHOULD be presented the entity that was given in the response, since that entity might include
                     * relevant diagnostic information. HTTP access authentication is explained in "HTTP Authentication:
                     * Basic and Digest Access Authentication" [43].
                     */
                    httpContext.Response.StatusCode = 401;
                    return httpContext; //Unauthorized

                }
            }
            else
            {
                /*400 BAD REQUEST:
                 *The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat
                 * the request without modifications.
                 */

                //Short Circuit. Request does not contain proper Authorization Header.
                httpContext.Response.StatusCode = 400;
                return httpContext;

            }
        }

        //This function:
        //  a. Validates Credentials passed in.
        //  b. Generates Token, Updates Token (to db), and returns the Token
        //  c. Is called by BasicAuthentication
        public static string VerifyCredentials(string UserId, string Secret)
        {
            //We need to hash secret here to compare in Query
            Secret = SHA.Hashit(Secret);

            int? AuthResult = OLTP_Query.UserAuthentication(UserId,Secret);

            // --9 is expired, 1 is pw's matched, 0 or null is not valid
            if (AuthResult == null) // User or Pass is not valid
            {
                return null;
            }
           
            if (AuthResult == 1) //Authenticated
            {                 
                string Token = GenerateToken(UserId + Secret);

                int Code = Tooling.Tooling.GenerateMFACode();
              

                //update db with token
                if (OLTP_Commit.UpdateMultiFactorToken(UserId, Token, Code))
                {
                    //DBIO Success

                    //Grab AccessControlRecord.
                    DataTable AccessControlRecord = OLTP_Query.GetIdentity(UserId);

                    //Send MFA text.
                    string CR = AccessControlRecord.Rows[0]["Carrier"].ToString();
                    string PN = AccessControlRecord.Rows[0]["PhoneNumber"].ToString();
                    CR = Tooling.Tooling.DetermineCarrierAddress(CR);

                    string PhoneAddress = PN + CR;
                    string body = "Use this code for verification: \n" +
                                  $"{Code}\n" +
                                  "This is an automated message from the CAC system.\n";
                   
                    Tooling.Tooling.SmtpInvoker(PhoneAddress, body);

                    //Send MFA email.
                    string ADDR = AccessControlRecord.Rows[0]["EmailAddress"].ToString();
                   
                    Tooling.Tooling.SmtpInvoker(ADDR, body, "CAC MFA Verification Code");


                    //return token
                    return Token;
                }
                else
                {
                    //DBIO failed.
                    return null;
                }
            }

            if(AuthResult == 2) //account is not active
            {
                return null;
            }

            if (AuthResult == 9) //Password expired. Initiate password reset process. 
            {
                //TODO: Password reset, return null for now.
                return null;
            }
            return null; //This would mean that query is returning numbers that are not hardcoded...fatality
        
        }

        //This function:
        //  a. Dissects the Authorization header (Decodes/Separates) and updates ByRef parameters 'UserId' and 'Secret' with their 
        //     respective values from the Concatenated and Encoded Authorization Header.
        public static void DissectAuthorizationHeader_Basic(string authHeader, out string UserId, out string Secret)
        {
            UserId = null;
            Secret = null;

            //Trims auth type off header string for credential processing.
            string EncodedCred = authHeader.Substring("Basic ".Length).Trim();

            //decodes the string
            string Decoded = GeneralEncoding.FromBase64(EncodedCred);

            //separates colon from decoded auth header:
            int seperatorIndex = Decoded.IndexOf(':');
            UserId = Decoded.Substring(0, seperatorIndex);
            Secret = Decoded.Substring(seperatorIndex + 1);
        }

        //This function:
        //  a. Generates a token by hashing whatever is passed in.
        public static string GenerateToken(string unHashedToken)
        {
            string rnd = RandomGenerators.RandomString();
            unHashedToken.Insert(0,rnd);
            return SHA.Hashit(unHashedToken);  
        }
    }
}
