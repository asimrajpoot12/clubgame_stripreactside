const firebase = require('firebase/app');
// require('firebase/firestore'); // Import the Firestore module if you need Firestore
var admin = require("firebase-admin");
var serviceAccount = require("../pkey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://clubgame-8e08e-default-rtdb.firebaseio.com"
  });
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    // measurementId: process.env.MEASUREMENT_ID
};

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase:', error);
}