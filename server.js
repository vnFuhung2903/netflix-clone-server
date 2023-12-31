const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const routes = require('./routes/routes');


const app = express();
app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:3000", 
        "https://netflixbyvnfuhung2903.vercel.app", 
        "https://netflixbyvnfuhung2903-vnfuhung2903s-projects.vercel.app", 
        "https://netflixbyvnfuhung2903-git-main-vnfuhung2903s-projects.vercel.app",
        "https://vercel.com/vnfuhung2903s-projects/netflixbyvnfuhung2903/GNP7wXttF1q2A67xs3KFWxDJV2Vc"
    ],
    credentials: true
}));
app.use(cookieParser());


const password = process.env.MONGODB_PASSWORD;
const mongodbname = "vnFuhung2903";
const uri = `mongodb+srv://${mongodbname}:${password}@vnfuhung2903.45t0xd8.mongodb.net/netflix-userDb`;


app.listen(process.env.PORT, () => {
    console.log(process.env.PORT);
    mongoose.connect(uri)
    .then(() => console.log("Connected"))
});

routes(app);