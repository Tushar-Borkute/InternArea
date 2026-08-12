const express = require("express");
const router = express.Router();
const admin = require("./admin");
const job = require("./job");
const internship = require("./internship");
const application = require("./application");
const resume = require("./resume");
const publicSpace = require("./publicSpace");
const auth = require("./auth");
const subscription = require("./subscription");

router.use("/admin", admin);
router.use("/job", job);
router.use("/internship", internship);
router.use("/application", application);
router.use("/resume", resume);
router.use("/public-space", publicSpace);
router.use("/auth", auth);
router.use("/subscription", subscription);

module.exports = router;