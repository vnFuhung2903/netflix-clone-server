const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
require('dotenv').config();
const routes = require('./routes/routes');


const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));


const password = process.env.MONGODB_PASSWORD;
const mongodbname = "vnFuhung2903";
const uri = `mongodb+srv://${mongodbname}:${password}@vnfuhung2903.45t0xd8.mongodb.net/netflix-userDb`;


app.listen(process.env.PORT, () => {
    mongoose.connect(uri)
    .then(() => console.log("Connected"))
});

routes(app);