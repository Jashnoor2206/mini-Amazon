const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    }
});

async function sendOTP(to, otp, minutes){
    await transporter.sendMail({
        from : `"Node"<${process.env.EMAIL_USER}>`,
        to,
        subject : 'Password Reset OTP',
        text : `Your code is ${otp} , it expires in ${minutes} minutes . If you did not ask for this please ignore`,
        html: `<p>Your password reset code is</p><h2 style="letter-spacing:4px">${otp}</h2><p>It expires in ${minutes} minutes.</p>`
    });
}

module.exports = {
    sendOTP
}