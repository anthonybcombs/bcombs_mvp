const nodemailer = require("nodemailer");

const defaultMailConfig = {
  from: "live.bcombs@gmail.com", // sender address,
  subject: "",
  text: "" // plain text body
};

const eventResponse = ["Yes", "No", "Maybe"];

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "live.bcombs@gmail.com",
    pass: "viacrcjcwjnwxvvh"
  }
});

const sendCancelledEvent = async ({ eventName, recipients }) => {
  let numRecipients = recipients.length;

  for (let x = 0; x < numRecipients; x++) {
    try {
      const template = getCancelledTemplate(eventName);

      sendEmail({
        ...defaultMailConfig,
        subject: `Bcombs: Event ${eventName} Cancelled`,
        to: recipients[x].email,
        html: template // html body
      });
    } catch (error) {
      console.log("Error", error);
    }
  }
};

const sendReScheduledEvent = async ({
  eventName,
  eventStartDate,
  eventEndDate,
  recipients
}) => {
  let numRecipients = recipients.length;

  for (let x = 0; x < numRecipients; x++) {
    try {
      const template = getReScheduledTemplate(
        eventName,
        eventStartDate,
        eventEndDate
      );

      sendEmail({
        ...defaultMailConfig,
        subject: `Bcombs: Event ${eventName} Re-Scheduled`,
        to: recipients[x].email,
        html: template // html body
      });
    } catch (error) {
      console.log("Error", error);
    }
  }
};
const sendInvitation = async ({
  eventName,
  eventOwnerEmail,
  eventId,
  eventStartDate,
  eventEndDate,
  recipients = []
}) => {
  let numRecipients = recipients.length;

  console.log("RECIPIENTS", recipients);

  for (let x = 0; x < numRecipients; x++) {
    try {
      const template = getTemplateInvitationStrings({
        data: recipients[x],
        eventId,
        eventName,
        eventOwnerEmail,
        recipients,
        eventStartDate,
        eventEndDate
      });

      sendEmail({
        ...defaultMailConfig,
        subject: "Bcombs: Event Invitation",
        to: recipients[x].email,
        html: template // html body
      });
    } catch (error) {
      console.log("Error", error);
    }
  }
};

const getTemplateInvitationStrings = ({
  data,
  eventName,
  eventOwnerEmail,
  eventId,
  recipients,
  eventStartDate,
  eventEndDate
}) => {
  return `
          <h4>You have been invited on this event ${eventName}</h4>
          <h5>Created by: ${eventOwnerEmail}</h5>
          <p>${
            eventStartDate !== eventEndDate
              ? `${eventStartDate} - ${eventEndDate}`
              : `${eventStartDate}`
          }</p>
          <div>
            <div>
           
              <table>
                <tr>
                  <th>Invited Guest</th>
                </tr>
                ${recipients.map(rec => {
                  return `<tr><td> ${rec.email}</td> </tr>`;
                })}
              </table>
              <ul>
                ${recipients.map(rec => {
                  return `<li><i> ${rec.email}</i> </li>`;
                })}
              </ul>
            </div>
            <form action="${process.env.API_URL}/api/invitation/event/${eventId}" method="GET">
              Calendar:
              <select name="calendar">
                ${data.calendars.map(calendar => {
                  return `<option value="${calendar.id}">${calendar.name}</option>`;
                })}
              </select>
              <br/>
              Response:
              <select name="response">
                ${eventResponse.map(resp => {
                  return `<option value="${resp}">${resp}</option>`;
                })}
              </select>
              <input type="hidden" name="eventId" value="${eventId}"/>
              <input type="hidden" name="userId" value="${data.user_id}"/>
              <br/>
              <input type="submit" value="Submit" style="background-color:#f26e21;color:white;padding:5px;"/>
            </form>
          </div>

  `;
};

export const getCancelledTemplate = eventName => {
  return `
    <div>
      Hi, 
      <br/>
      <br/>
      It is with regret that we must inform you that the organizer are cancelling Event ${eventName}.  We are sorry for any inconvenience this may cause.
    </div>
  `;
};

export const getReScheduledTemplate = (
  eventName,
  eventStartDate,
  eventEndDate
) => {
  return `
    <div>
      Hi, 
      <br/>
      <br/>
      We would to inform you that the event ${eventName} has been re-scheduled to date ${eventStartDate} - ${eventEndDate}
    </div>
  `;
};

export const bookDemoSchedule = ({
  organizationName,
  organizationType,
  organizationSize,
  websiteUrl,
  fullName,
  clientEmail,
  contactNo
}) => {
  return sendEmail({
    ...defaultMailConfig,
    subject: `Bcombs: Demo Request`,
    to: 'nate@bcombs.com',
    html: `
      <div>
        
        <p>
          Organization Name: ${organizationName}
          <br/>
          Organization Type: ${organizationType}
          <br/>
          Organization Size: ${organizationSize}
          <br/>
          Website URL: ${websiteUrl}
          <br/>
          Full Name: ${fullName}
          <br/>
          Email: ${clientEmail}
          <br/>
          Contact No: ${contactNo}
        </p>
      
      </div>
    ` // html body
  });
};

const sendEmail = config => {
  transporter.sendMail(config, function(error, info) {
    if (error) {
      console.log("Error", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export {
  getTemplateInvitationStrings,
  sendInvitation,
  sendCancelledEvent,
  sendReScheduledEvent
};

//added by bon :(
export const getShareCalendarTemplate = (calendar, user, groupId) => {
  console.log("getShareCalendarTemplate user", user);
  return `<h4>Calendar ${calendar.name} is shared to you!</h4>
<p>You want to follow this calendar?</p>
<div>
  <form action="${process.env.API_URL}/api/invitation/calendar/${calendar.id}/1" method="GET">
  <input type="submit" value="Yes" style="background-color:#f26e21;color:white;padding:5px;"/>
  <input type="hidden" name="userId" value="${user.user_id}"/>
  <input type="hidden" name="groupId" value="${groupId}"/>
  </form>
  <form action="${process.env.API_URL}/api/invitation/calendar/${calendar.id}/2" method="GET">
  <input type="submit" value="No" style="background-color:grey;color:white;padding:5px;"/>
  <input type="hidden" name="userId" value="${user.user_id}"/>
  <input type="hidden" name="groupId" value="${groupId}"/>
  </form>  
</div>`;
};

export const sendToUserShareCalendarConfirmation = async ({
  calendar,
  recipient,
  groupId
}) => {
  try {
    console.log('Recipientttt',recipient)
    const template = getShareCalendarTemplate(calendar, recipient, groupId);
    sendEmail({
      ...defaultMailConfig,
      subject: `Bcombs: Calendar ${calendar.name} is shared to you!`,
      to: recipient.email,
      html: template // html body
    });
  } catch (error) {
    console.log("Error", error);
  }
};

export const sendMigratedAccount = async ({ email, password, firstname }) => {
  try {
    sendEmail({
      ...defaultMailConfig,
      subject: `Bcombs: Credentials for new bcombs site`,
      to: email,
      html: `
        <div>
          <p>Hi ${firstname}!</p>
          <p>
            This is your account for the new bcombs site.
            <br/>
            Email: ${email}
            <br/>
            Password: ${password}
            <br/>
            Please change your password after signing in.
            <br/>
            Thanks
          </p>
        </div>
      ` // html body
    });
  } catch (error) {
    console.log("Error", error);
  }
};

export const sendAdminInvite = async ({ 
  email, 
  password = "", 
  name, 
  vendorId, 
  isExist = false
}) => {
  try {
    console.log('sendAdminInvite isExist',isExist)
    console.log('sendAdminInvite email',email)
    console.log('sendAdminInvite password',password)

    if(isExist) {
      sendEmail({
        ...defaultMailConfig,
        subject: `Bcombs: Admin Invitation`,
        to: email,
        html: `
          <div>
            <p>Hi ${name}!</p>
            <p>
              This is your account for the bcombs site.
              <br/>
              Email: ${email}
              <br/>
              Please use your existing password to sign in. If you cannot recall your existing password, please utilize the forget password process.
              <br/>
            </p>
            <p>
              To access the application, please use the following link: https://bcombs.com/dashboard/application?vendor=${vendorId}
            </p<
          </div>
        ` // html body
      });
    } else {
      sendEmail({
        ...defaultMailConfig,
        subject: `Bcombs: Admin Invitation`,
        to: email,
        html: `
          <div>
            <p>Hi ${name}!</p>
            <p>
              This is your account for the bcombs site.
              <br/>
              Email: ${email}
              <br/>
              Password: ${password}
              <br/>
              Please change your password after signing in.
              <br/>
            </p>
            <p>
              To access the application, please go to this site: https://bcombs.com/dashboard/application?vendor=${vendorId}
            </p<
          </div>
        ` // html body
      });
    }

  } catch (error) {
    console.log("invite error", error);
  }
};

export const maskEmail = (mail) => {
  let mailUsername = mail.split("@")[0];
  mailUsername = mailUsername[0] + mailUsername.substring(1).replace(/./gi, '*')
  let mailDomain = mail.split("@")[1].split(".")[0].replace(/./gi, '*');
  let mailTld = mail.split("@")[1].split(".")[1].replace(/./gi, '*')

  return `${mailUsername}@${mailDomain}.${mailTld}`
}

