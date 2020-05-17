const nodemailer = require("nodemailer");

const defaultMailConfig = {
  from: "sanjosedennis7593@gmail.com", // sender address
  subject: "Bcombs: Event Invitation", // Subject line
  text: "" // plain text body
};

const eventResponse = ["Yes", "No", "Maybe"];

const sendEmail = async ({
  eventName,
  eventOwnerEmail,
  eventId,

  recipients = []
}) => {
  let numRecipients = recipients.length;
  let transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: "sanjosedennis7593@gmail.com",
      pass: "hnkkusrtgmbpwsyf"
    }
  });
  for (let x = 0; x < numRecipients; x++) {
    try {
      const template = getTemplateInvitationStrings({
        data: recipients[x],
        eventId,
        eventName,
        eventOwnerEmail
      });
      console.log("template", template);
      transporter.sendMail(
        {
          ...defaultMailConfig,
          to: recipients[x].email,
          html: template // html body
        },
        function(error, info) {
          if (error) {
            console.log("Error", error);
          } else {
            console.log("Email sent: " + info.response);
          }
        }
      );
    } catch (error) {
      console.log("Error", error);
    }
  }
};

const getTemplateInvitationStrings = ({
  data,
  eventName,
  eventOwnerEmail,
  eventId
}) => {
  return `

          <h4>You have been invited on this event ${eventName}</h4>
          <h5>Created by: ${eventOwnerEmail}</h5>
          <div>
            <form action="http://localhost:3001/api/invitation/event/${eventId}" method="GET">
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

export { getTemplateInvitationStrings, sendEmail };
