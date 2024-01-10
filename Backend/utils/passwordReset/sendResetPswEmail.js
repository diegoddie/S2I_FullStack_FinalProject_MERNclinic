import nodemailer from 'nodemailer';

export const sendResetPasswordEmail = async (email, resetToken) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
              user: process.env.GMAIL,
              pass: process.env.GMAIL_PSW_APP
            },
        });

        const resetTokenLink = `http://localhost:3001/password-reset/${resetToken}`;

        const mailOptions = {
            from: process.env.GMAIL,
            to: email,
            subject: 'Password Reset',
            html: `<p>You have requested a password reset. Click on the following link to proceed: <a href="${resetTokenLink}">${resetTokenLink}</a></p>`,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent successfully:', info.response);
    } catch (err) {
        console.error('Error sending email: ', err);
        throw err;
    }
};