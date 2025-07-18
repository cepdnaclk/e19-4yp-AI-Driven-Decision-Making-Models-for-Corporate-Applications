TEMPLATES = {

    "offer": 
"""Dear {candidateName},

We are pleased to offer you the position of {jobRole} in our {department} department at LEARN, starting on {startDate}. Your salary will be {salary} per month.

We look forward to working with you.

Best Regards,
HR Department,
LEARN
""",

    "rejection": 
"""Dear {candidateName},

Thank you for applying for the {jobRole} position at our company.
After careful consideration, we regret to inform you that we will not be moving forward with your application.

We wish you the best in your job search.

Best Regards,
HR Department,
LEARN
""",

    "leave":    
"""Dear {managerName}, 
    
I hope this message finds you well. I am writing to request a {leaveType} Leave for {numberOfDays} days from {startDate} to {endDate}.
The reason for my leave is {reason}. Thank you for understanding.

Best Regards,
{employeeName}
""",

    "email": 
"""To: {recepientEmail}
Subject: {subject}

Dear {recepientName},

{body}
""",
}