import nodemailer from 'nodemailer';

export const sendUserAuthEmail = async (userEmail, token) => {
    try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL,  
            pass: process.env.GMAIL_PSW_APP,
          },
        });

        const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://www.myclinic.tech';
        const verifyEmailLink = `${baseURL}/user/verify-email/${token}`;

        const mailOptions = {
            from: process.env.GMAIL,  
            to: userEmail,
            subject: 'Verify Your Email',
            text: `Click on the following link to verify your email: ${verifyEmailLink}`,
            html: `<p>Click <a href="${verifyEmailLink}">here</a> to verify your email.</p>`,
        };

        await transporter.sendMail(mailOptions);

        console.log(`Verification email sent to ${userEmail}`);
    } catch(error){
        console.error('Error sending verification email:', error);
        throw error;
    }
}