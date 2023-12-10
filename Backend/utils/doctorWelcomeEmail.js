import nodemailer from 'nodemailer';

// Function to send a welcome email to a new doctor
export const sendWelcomeEmail = async (email, password) => {
    try {
      // Create a nodemailer transporter using Gmail service
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL,  
          pass: process.env.GMAIL_PSW_APP,
        },
      });
  
      const resetPasswordUrl = 'http://localhost:3000/doctor/sign-in'; 
      const mailOptions = {
        from: process.env.GMAIL,
        to: email,
        subject: 'Welcome to Our Clinic!',
        html: `
            <p>Welcome to our clinic! Your temporary password is: ${password}. Please use this password to <a href="${resetPasswordUrl}">log in here</a>. You can change it later.</p>
        `,
      };
  
      const info = await transporter.sendMail(mailOptions);
  
      console.log('Welcome Email sent successfully:', info.response);
    } catch (err) {
      console.error('Error sending welcome email: ', err);
      throw err;
    }
};