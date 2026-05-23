const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authenticateToken } = require("./auth");

// Credit Card Validation Utility (Luhn algorithm simulation & validation checks)
const validateCardDetails = (number, expiry, cvv) => {
  // Strip whitespace/dashes
  const cleanedNum = number.replace(/\s+/g, "").replace(/-/g, "");
  if (!/^\d{15,16}$/.test(cleanedNum)) {
    return { valid: false, message: "Invalid credit card number. Must be 15 or 16 digits." };
  }

  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return { valid: false, message: "Invalid expiry date format. Use MM/YY." };
  }

  const [month, year] = expiry.split("/").map(Number);
  if (month < 1 || month > 12) {
    return { valid: false, message: "Invalid expiry month." };
  }

  // Check CVV
  if (!/^\d{3,4}$/.test(cvv)) {
    return { valid: false, message: "Invalid CVV. Must be 3 or 4 digits." };
  }

  return { valid: true };
};

// POST /api/payments/charge - Process simulated card charge
router.post("/charge", authenticateToken, async (req, res) => {
  try {
    const { cardNumber, cardHolder, expiryDate, cvv, planId } = req.body;

    if (!cardNumber || !cardHolder || !expiryDate || !cvv || !planId) {
      return res.status(400).json({ error: "All payment fields are required." });
    }

    // Validate Card Info
    const validation = validateCardDetails(cardNumber, expiryDate, cvv);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    // Simulate high-fidelity processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update User premium state in DB
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User profile not found." });
    }

    user.isPremium = true;
    await user.save();

    res.json({
      success: true,
      message: "Simulated charge completed successfully. Account upgraded to Premium!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error processing payment." });
  }
});

module.exports = router;
