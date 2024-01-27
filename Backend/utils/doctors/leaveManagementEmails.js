import nodemailer from 'nodemailer';

export const sendNewLeaveRequestEmailToAdmin = async (leaveRequest) => {
  try {
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: process.env.GMAIL,
              pass: process.env.GMAIL_PSW_APP,
          },
      });

      const mailOptions = {
          from: process.env.GMAIL,
          to: process.env.ADMIN_EMAIL, 
          subject: 'New Leave Request requires approval',
          html: `
              <p>A new ${leaveRequest.typology} Request from ${leaveRequest.startDate} to ${leaveRequest.endDate} requires approval.</p>
              <p>Doctor: ${leaveRequest.doctorName}</p>
              <p>Email: ${leaveRequest.doctorEmail}</p>
          `,
      };

      const info = await transporter.sendMail(mailOptions);

      console.log('Email sent to admin:', info.response);
  } catch (err) {
      console.error('Error sending email to admin: ', err);
      throw err;
  }
};

export const sendLeaveApprovalEmail = async (email, leaveRequest) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL,  
          pass: process.env.GMAIL_PSW_APP,
        },
      });
  
      const mailOptions = {
        from: process.env.GMAIL,
        to: email,
        subject: 'Your Leave Request has been approved',
        html: `
            <p>Your ${leaveRequest.typology} Request from ${leaveRequest.startDate} to ${leaveRequest.endDate} has been approved.</p>
        `,
      };
  
      const info = await transporter.sendMail(mailOptions);
  
      console.log('Email sent successfully:', info.response);
    } catch (err) {
      console.error('Error sending email: ', err);
      throw err;
    }
};

export const sendLeaveDeclinalEmail = async (email, leaveRequest) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL,  
          pass: process.env.GMAIL_PSW_APP,
        },
      });
  
      const mailOptions = {
        from: process.env.GMAIL,
        to: email,
        subject: 'Your Leave Request has been declined',
        html: `
            <p>Your ${leaveRequest.typology} Request from ${leaveRequest.startDate} to ${leaveRequest.endDate} has been declined.</p>
        `,
      };
  
      const info = await transporter.sendMail(mailOptions);
  
      console.log('Email sent successfully:', info.response);
    } catch (err) {
      console.error('Error sending email: ', err);
      throw err;
    }
};