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
            <form action="http://192.243.109.224:3001/api/invitation/event/${eventId}" method="GET">
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
  <form action="http://192.243.109.224:3001/api/invitation/calendar/${calendar.id}" method="GET">
  <input type="submit" value="Yes" style="background-color:#f26e21;color:white;padding:5px;"/>
  <input type="hidden" name="userId" value="${user.user_id}"/>
  <input type="hidden" name="groupId" value="${groupId}"/>
  </form>
  <form action="http://192.243.109.224:1234/dashboard/mycalendars" method="GET">
  <input type="submit" value="No" style="background-color:grey;color:white;padding:5px;"/>
  </form>  
</div>`;
};

export const sendToUserShareCalendarConfirmation = async ({
  calendar,
  recipient,
  groupId
}) => {
  try {
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
