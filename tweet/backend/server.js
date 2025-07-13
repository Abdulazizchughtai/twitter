const express= require('express');
const cors = require('cors');
const connectDb = require('./config/db');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
dotenv.config();

connectDb();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5174", credentials: true }));
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tweets", require("./routes/tweetRoutes"));


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
