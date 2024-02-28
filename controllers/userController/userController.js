const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const resetPassword = async (req, res) => {
    // const { amount, currency } = req.body;
    const { email } = req.body;
     // Create a Nodemailer transporter
     const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: process.env.NODEMAILER_EMAIL, // Your Gmail email address
          pass: process.env.NODEMAILER_PASS // Your Gmail password
      }
  });
    try {
        const link=await admin.auth().generatePasswordResetLink(email);
         // Send email
         await transporter.sendMail({
          from: process.env.NODEMAILER_EMAIL, // Sender's email address
          to: email, // Recipient's email address
          subject: 'Password Reset Link', // Email subject
          html: `
          <html>
          <head>
              <title>Email Verification</title>
          </head>
          <body>
              <p>Hello ${email},</p>
              <p>Follow this <a href="${link}">link</a> to verify your email address.</p>
              <p>If you didn’t ask to verify this address, you can ignore this email.</p>
              <p>Thanks,</p>
              <p>Your Club Game team</p>
          </body>
          </html>
      `
      });

      return res.status(200).json({Message: 'Password reset link sent successfully' });
        // return res.status(200).json({ Reset_Link: link });
      } catch (error) {
        console.log("the error is",error)
        res.status(500).json({error:'Error sending password reset email'});
      }
   
  };

  module.exports = { resetPassword }