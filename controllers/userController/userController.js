const admin = require('firebase-admin');
const resetPassword = async (req, res) => {
    // const { amount, currency } = req.body;
    const { email } = req.body;
    try {
        const link=await admin.auth().generatePasswordResetLink(email);
        return res.status(200).json({ Reset_Link: link });
      } catch (error) {
        res.status(500).json({error:'Error sending password reset email'});
      }
   
  };

  module.exports = { resetPassword }