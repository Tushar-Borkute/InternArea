const express = require("express");
const router = express.Router();

const Internship = require("../model/internship");

router.post("/", async (req, res) => {
    const internshipdata = new Internship({
        title: req.body.title,
        location: req.body.location,
        company: req.body.company,
        category: req.body.category,
        aboutcompany: req.body.aboutcompany,
        aboutinternship: req.body.aboutinternship,
        whocanapply: req.body.whocanapply,
        perks: req.body.perks,
        numberofopenings: req.body.numberofopenings,
        stipend: req.body.stipend,
        startdate: req.body.startdate,
        additionalinfo: req.body.additionalinfo,
    });

    await internshipdata
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
    const data = await Internship.find();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await Internship.findById(id);

    if (!data) {
      return res.status(404).json({ error: "internship not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "internal server error" });
  }
});

module.exports = router;