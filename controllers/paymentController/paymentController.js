const admin = require("firebase-admin");

const paymentIntent = async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_KEY);
  const { amount, currency } = req.body;
  console.log("the amount is",amount)  
  console.log("the currency is",currency)
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      // payment_method_types: ['card'],
    });
    console.log("the payment intent is",paymentIntent)
    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send(error.message);
  }
 
};

const storeData = async (req, res) => {
  const { amount,coins,email } = req.body;
   // Regular expression for email validation
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   if (!emailRegex.test(email)) {
       return res.status(400).send({ error: 'Invalid email address' });
   }
    try {
    // Get a reference to the Firestore database
    const db= admin.firestore();
    // Create a new collection named "payment"
    const docRef = await db.collection("payment").doc(email).set({
      Email: email,
      Amount: amount,
      GameCoin: coins
    });
    res.status(200).send("Succeded!");
  } catch (error) {
    res.status(500).send("Error adding document: " + error.message);
  }
};

module.exports = { paymentIntent, storeData };
