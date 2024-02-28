const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
// import connectDB from "../config";
const userroutes = require('./routes/user/userroutes');
const path = require('path');
const app = express();
dotenv.config()
// connectDB();
require('./db/db')

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(express.json())

app.use('/api', userroutes)

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// Serve static frontend files
app.use("/", express.static(path.join(__dirname, "./public/dist")));
app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/dist/index.html"));
});


const PORT = process.env.PORT || 3001

app.listen(PORT, console.log(`server started on ${3001}`))





