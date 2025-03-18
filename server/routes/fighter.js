import express from "express";
import { Fighter } from "../models/Fighter.js";

const router = express.Router();

// Get all fighters
router.get("/", async (req, res) => {
  try {
    const fighters = await Fighter.find().sort({ name: 1 });
    res.json({
      success: true,
      data: fighters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get fighter by ID
router.get("/:id", async (req, res) => {
  try {
    const fighter = await Fighter.findById(req.params.id);
    if (!fighter) {
      return res.status(404).json({
        success: false,
        error: "Fighter not found",
      });
    }
    res.json({
      success: true,
      data: fighter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Create new fighter
router.post("/", async (req, res) => {
  try {
    const fighter = await Fighter.create(req.body);
    res.status(201).json({
      success: true,
      data: fighter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update fighter
router.patch("/:id", async (req, res) => {
  try {
    const fighter = await Fighter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!fighter) {
      return res.status(404).json({
        success: false,
        error: "Fighter not found",
      });
    }
    res.json({
      success: true,
      data: fighter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router; 