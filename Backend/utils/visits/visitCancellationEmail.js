import nodemailer from 'nodemailer';
import formatDate from '../formatDate.js';

export const sendVisitCancellationEmail = async (userEmail, doctorEmail, visitDetails) => {
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
      subject: 'Visit Cancellation',
      html: `
        <html>
          <body>
            <h1>Your Visit Has Been Cancelled</h1>
            <p>Your visit scheduled on ${formatDate(visitDetails.date)} has been cancelled.</p>
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
      subject: 'Visit Cancellation',
      html: `
        <html>
          <body>
            <h1>Visit Cancellation</h1>
            <p>Patient: ${visitDetails.patient.firstName} ${visitDetails.patient.lastName}</p>
            <p>Tax ID: ${visitDetails.patient.taxId}</p>
            <p>The visit scheduled on ${formatDate(visitDetails.date)} has been cancelled.</p>
          </body>
        </html>
      `,
    };

    const [infoUser, infoDoctor] = await Promise.all([
      transporter.sendMail(mailOptionsUser),
      transporter.sendMail(mailOptionsDoctor),
    ]);

    console.log('Visit cancellation emails sent successfully:', infoUser.response, infoDoctor.response);
  } catch (err) {
    console.error('Error sending visit cancellation emails: ', err);
    throw err;
  }
};
