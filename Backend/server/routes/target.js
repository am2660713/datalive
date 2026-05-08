import express from "express";
import Target from "../models/Targetmodel.js";

const router = express.Router();


// ✅ GET (load target)
router.get("/:email", async (req, res) => {
  try {
    let data = await Target.findOne({ userEmail: req.params.email });

    // 🔥 Agar user ka target nahi hai → create default
    if (!data) {
      data = await Target.create({
        userEmail: req.params.email,
        yearlyTarget: 1000,
        monthlyTargets: {},
      });
    }

    res.json({
      ...data._doc,
      monthlyTargets: Object.fromEntries(data.monthlyTargets || {}),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching target" });
  }
});


// ✅ SAVE / UPDATE
router.post("/", async (req, res) => {
  try {
    const { userEmail, yearlyTarget, monthlyTargets } = req.body;

    const updated = await Target.findOneAndUpdate(
      { userEmail },
      {
        yearlyTarget,
        monthlyTargets: new Map(Object.entries(monthlyTargets || {})),
      },
      { new: true, upsert: true }
    );

    res.json({
      ...updated._doc,
      monthlyTargets: Object.fromEntries(updated.monthlyTargets || {}),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving target" });
  }
});

export default router;