const express = require("express");
const router = express.Router();
const Design = require("../models/Design");
const { authenticateToken } = require("./auth");

// Admin protection middleware
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin role required." });
  }
  next();
};

// GET /api/designs - Get all designs
router.get("/", async (req, res) => {
  try {
    const designs = await Design.find().sort({ createdAt: -1 });
    // Premium locking disabled for now — all designs accessible
    const result = designs.map((d) => ({ ...d.toObject(), isLocked: false }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching designs." });
  }
});

// GET /api/designs/:id - Get design details
router.get("/:id", async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ error: "Design not found." });
    }
    // Premium locking disabled for now
    res.json({ ...design.toObject(), isLocked: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching design detail." });
  }
});

// POST /api/designs - Create a new design (Admin only)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      category,
      complexity,
      occasion,
      style,
      image,
      isPremium,
      isFeatured,
      isTrending,
      isNew,
      tags,
      description,
    } = req.body;

    if (!title || !category || !occasion || !style || !image || !description) {
      return res.status(400).json({ error: "Please enter all required fields." });
    }

    const newDesign = new Design({
      title,
      category,
      complexity: complexity || "medium",
      occasion,
      style,
      image,
      isPremium: isPremium || false,
      isFeatured: isFeatured || false,
      isTrending: isTrending || false,
      isNew: isNew || false,
      tags: tags || [],
      description,
    });

    await newDesign.save();
    res.status(201).json(newDesign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error creating design." });
  }
});

// DELETE /api/designs/:id - Delete a design (Admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ error: "Design not found." });
    }

    await Design.findByIdAndDelete(req.params.id);
    res.json({ message: "Design deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error deleting design." });
  }
});

module.exports = router;
