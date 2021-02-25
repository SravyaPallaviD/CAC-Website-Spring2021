using System;
namespace ChildAdvocacy.RequestModels
{
    public class RequestAccountModel
    {
        public string FirstName {get;set;}
        public string LastName {get;set;}
        public string EmailAddress {get;set;}
        public string Password {get;set;}
        public string ConfirmPassword {get;set;}
        public string PhoneNumber {get;set;}
        public string Carrier {get;set;}

    }

    public class UpdateAccountModel 
    {
        public string FirstName {get;set;}
        public string LastName {get;set;}
        public string EmailAddress {get;set;}
        public string PhoneNumber {get;set;}
        public string Carrier {get;set;}

    }

    public class AddEventModel
    {
        public int ChildEventKey {get;set;}
        public int CaseKey {get;set;}
        public int accKeyInterviewer {get;set;}
        public string EventType {get;set;}
        public string Location {get;set;}
        public DateTime EventStartDateTm {get;set;}
        public DateTime EventEndDateTm {get;set;}

    }

    public class EventRange
    {
        public DateTime EventStartDateTm {get;set;}
        public DateTime EventEndDateTm {get;set;}
    }

}