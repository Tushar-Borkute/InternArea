const express = require("express");
const router = express.Router();

const Job = require("../model/job");

router.post("/", async (req, res) => {
    const jobdata = new Job({
        title: req.body.title,
        location: req.body.location,
        company: req.body.company,
        category: req.body.category,
        aboutcompany: req.body.aboutcompany,
        aboutjob: req.body.aboutjob,
        whocanapply: req.body.whocanapply,
        perks: req.body.perks,
        numberofopenings: req.body.numberofopenings,
        salary: req.body.salary,
        joiningdate: req.body.joiningdate,
        additionalinfo: req.body.additionalinfo,
    });

    await jobdata
        .save()
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            console.log(error);
        });
});

router.get("/", async (req, res) => {
  try {
    const data = await Job.find();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Job.findById(id);

    if (!data) {
      return res.status(404).json({ error: "job not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "internal server error" });
  }
});

module.exports = router;