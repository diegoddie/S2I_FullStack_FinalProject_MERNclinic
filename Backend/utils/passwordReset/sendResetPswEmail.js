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

        const resetTokenLink = `http://localhost:3000/password-reset/${resetToken}`;

        const mailOptions = {
            from: process.env.GMAIL,
            to: email,
            subject: 'Reset Password',
            html: `<p>Hai richiesto una reimpostazione della password. Clicca sul seguente link per procedere: <a href="${resetTokenLink}">${resetTokenLink}</a></p>`,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent successfully:', info.response);
    } catch (err) {
        console.error('Error sending email: ', err);
        throw err;
    }
  };