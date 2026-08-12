const express = require("express");
const router = express.Router();

const adminuser = "admin";
const adminpass = "admin";

router.post("/adminlogin", (req, res) => {
    const { username, password } = req.body;

    if (username === "Tushar" && password === "Tushar") {
        res.send("admin is here");
    } else {
        res.status(401).send("unauthrized");
    }
});

module.exports = router;