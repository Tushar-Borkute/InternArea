const bodyparser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const { connect } = require("./db");
const router = require("./Routes/index");

const port = 5000;

app.use(cors());
app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

// Log each incoming request so console output is visible in the Node terminal
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    console.log("GET / route hit");
    res.send("hello this is internshala backend");
});

app.use("/api", router);

// Start the server immediately — don't wait for DB
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Connect to DB in background
connect()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
    });