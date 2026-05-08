import express from "express";
import Daily from "../models/Daily.js";

const router = express.Router();

// GET
router.get("/:email", async (req, res) => {
  try {
    const data = await Daily.find({ userEmail: req.params.email });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching daily data" });
  }
});

// POST
router.post("/", async (req, res) => {
  try {
    const { entry, userEmail } = req.body;
    console.log("this is new entry",req.body)
    const newEntry = new Daily({ ...entry, userEmail });
    const saved = await newEntry.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error saving daily data" });
  }
});

// PUT
router.put("/:id", async (req, res) => {
  try {
    const updated = await Daily.findOneAndUpdate(
      { _id: req.params.id, userEmail: req.body.userEmail },
      req.body.entry,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating daily data" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Daily.findByIdAndDelete(req.params.id);   // ✅ FIXED
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting daily data" });
  }
});


export default router;