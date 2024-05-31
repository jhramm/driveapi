var mongoose = require('mongoose');
require("dotenv").config();


mongoose.connect(`${process.env.DB_URL}/jason-drive`).then(() => {
    console.log("Connected to MongoDB");
}).catch((e) => {
   console.log(e);
})