const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const url = process.env.DATABASE_URL;

module.exports.connect = async () => {
    try {
        await mongoose.connect(url);
        console.log("Database is connected");
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
};