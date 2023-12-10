import nodemailer from 'nodemailer';

export const sendVisitConfirmationEmail = async (userEmail, doctorEmail, visitDetails) => {
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
      subject: 'Visit Confirmation',
      html: `
        <html>
          <body>
            <h1>Your Visit Details</h1>
            <p>Date: ${visitDetails.date}</p>
            <p>Doctor: ${visitDetails.doctor.firstName} ${visitDetails.doctor.lastName}</p>
            <p>Specialization: ${visitDetails.doctor.specialization}</p>
          </body>
        </html>
      `,
    };

    const mailOptionsDoctor = {
      from: process.env.GMAIL,
      to: doctorEmail,
      subject: 'New Visit Scheduled',
      html: `
        <html>
          <body>
            <h1>New Visit Scheduled</h1>
            <p>Date: ${visitDetails.date}</p>
            <p>Patient: ${visitDetails.patient.firstName} ${visitDetails.patient.lastName}</p>
            <p>Tax ID: ${visitDetails.patient.taxId}</p>
          </body>
        </html>
      `,
    };

    const [infoUser, infoDoctor] = await Promise.all([
      transporter.sendMail(mailOptionsUser),
      transporter.sendMail(mailOptionsDoctor),
    ]);

    console.log('Visit confirmation emails sent successfully:', infoUser.response, infoDoctor.response);
  } catch (err) {
    console.error('Error sending visit confirmation emails: ', err);
    throw err;
  }
};



