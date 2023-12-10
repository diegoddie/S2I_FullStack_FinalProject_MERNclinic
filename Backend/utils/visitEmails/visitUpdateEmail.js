import nodemailer from 'nodemailer';

export const sendVisitUpdateEmail = async (userEmail, doctorEmail, visitDetails) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PSW_APP,
      },
    });

    const mailOptionsUser = {
      from: process.env.GMAIL,
      to: userEmail,
      subject: 'Visit Update',
      html: `
        <html>
          <body>
            <h1>Visit Updated</h1>
            <p>Your visit originally scheduded in date ${visitDetails.originalDate} has been rescheduled in date ${visitDetails.newDate}.
            <p>Other Details:</p>
            <p>Doctor: ${visitDetails.doctor.firstName} ${visitDetails.doctor.lastName}</p>
            <p>${visitDetails.doctor.specialization}</p>
          </body>
        </html>
      `,
    };

    const mailOptionsDoctor = {
      from: process.env.GMAIL,
      to: doctorEmail,
      subject: 'Visit Update',
      html: `
        <html>
          <body>
            <h1>Visit Updated</h1>
            <p>Patient: ${visitDetails.patient.firstName} ${visitDetails.patient.lastName}</p>
            <p>Tax ID: ${visitDetails.patient.taxId}</p>
            <p>The visit originally scheduded in date ${visitDetails.originalDate} has been rescheduled in date ${visitDetails.newDate}.
          </body>
        </html>
      `,
    };

    const [infoUser, infoDoctor] = await Promise.all([
      transporter.sendMail(mailOptionsUser),
      transporter.sendMail(mailOptionsDoctor),
    ]);

    console.log('Visit update emails sent successfully:', infoUser.response, infoDoctor.response);
  } catch (err) {
    console.error('Error sending visit update emails: ', err);
    throw err;
  }
};
