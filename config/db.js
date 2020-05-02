const mongoose = require("mongoose");
const config = require("config");
//*When we install the npm -i config, and create default.json file, we can access
// the default.json variables globally. In this case we get the mongoURI to connect with our cloud DB.
const db = config.get("mongoURI");

const connectDB = async () => {
    try {
        //MongoClient constructor
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        console.log("MongoDB Connected...");
    } catch (err) {
        //If error happens log the error to the console, and exit with failure(1)
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
