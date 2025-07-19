TEMPLATES = {

    "offer_letter":
"""
{date}

{fullName},  
{address}  

Dear {salutation} {firstname},

LETTER OF OFFER

We are pleased to offer you the position of {designation} at Lanka Education And Research Network 
(LEARN) on a fixed term contract for a period of one (01) year commencing on {startDate} 
and ending on {endDate}.

You will be paid a basic salary of LKR {basicSalary}/- per month plus a monthly fixed allowance 
of LKR {fixedAllowance}/-.

You will be required to report to LEARN on {reportingDate}.

Sincerely,  
""",

    "rejection": 
"""Rejection Letter

Dear {candidateName},

Thank you for applying for the {jobRole} position at our company.
After careful consideration, we regret to inform you that we will not be moving forward with your application.

We wish you the best in your job search.

Best Regards,
HR Department,
LEARN
""",

    "leave":    
"""Leave Request

Dear {managerName}, 
    
I hope this message finds you well. I am writing to request a {leaveType} Leave for {numberOfDays} days from {startDate} to {endDate}.
The reason for my leave is {reason}. Thank you for understanding.

Best Regards,
{employeeName}
""",

    "email": 
""" Email Template

To: {recepientEmail}
Subject: {subject}

Dear {recepientName},

{body}
""",

    "confirmation":
"""
{date} 

{name}, 
{address}

Dear {name},

Letter of Confirmation

This refers to your Self-Evaluation Report, and your appointment as {designation} at 
Lanka Education and Research Network (LEARN), effective from {effectiveDate}. 

We wish to inform you that at the {boardNo}th Board of Directors Meeting of LEARN held on {meetingDate} it was 
decided to confirm your services on a permanent basis in your position as {designation} with effect from 
{effectiveDate}. Further, it was decided to place you, in your next increment step that you are eligible after 
completion of one year service with LEARN. Therefore, your basic salary will be {basicSalary}}/- + 
{allowance}/- allowance per month with effect from the date of confirmation. All other terms and 
conditions of your employment will remain as outlined in your initial Letter of Appointment, effective 
from {prevDate}, unless revised or updated by the Board of Directors in the future.

We kindly request you to sign a copy of this letter to indicate your acceptance of the aforementioned 
terms and conditions and return it for our records. 

We extend our congratulations on your confirmation and wish you a prosperous and fulfilling career. 

Thank you. 
Sincerely 



Signatory 
Lanka Education And Research Network 

Having understood the above contents, I place my signature accepting the terms & conditions stated 
herein. 

""",
}