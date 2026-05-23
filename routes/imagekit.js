const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./auth");

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admin role required." });
  }
  next();
};

const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;

router.post("/upload", authenticateToken, requireAdmin, async (req, res) => {
  const { file, fileName, folder } = req.body;

  if (!file || !fileName) {
    return res.status(400).json({ error: "File and fileName are required." });
  }

  if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY) {
    return res.status(500).json({ error: "ImageKit credentials are not configured on the server." });
  }

  try {
    const basicAuth = Buffer.from(`${IMAGEKIT_PUBLIC_KEY}:${IMAGEKIT_PRIVATE_KEY}`).toString("base64");
    const dataUrlMatch = /^data:.*;base64,(.*)$/s.exec(file);
    const rawBase64 = dataUrlMatch ? dataUrlMatch[1] : file;
    const fileBuffer = Buffer.from(rawBase64, "base64");

    const formData = new FormData();
    formData.append("file", new Blob([fileBuffer]), fileName);
    formData.append("fileName", fileName);
    formData.append("folder", folder || "/mehndi-muse");
    formData.append("useUniqueFileName", "true");

    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || "ImageKit upload failed.", details: data });
    }

    res.json({ url: data.url, fileId: data.fileId, name: data.name });
  } catch (err) {
    console.error("ImageKit upload error:", err);
    res.status(500).json({ error: "ImageKit upload failed during server processing." });
  }
});

// Admin-only: quick auth check for ImageKit credentials
router.get("/check", authenticateToken, requireAdmin, async (req, res) => {
  if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY) {
    return res.status(500).json({ ok: false, message: "ImageKit keys not configured on server." });
  }

  try {
    const basicAuth = Buffer.from(`${IMAGEKIT_PUBLIC_KEY}:${IMAGEKIT_PRIVATE_KEY}`).toString("base64");
    // Send a minimal form-encoded request to observe auth behavior
    const body = new URLSearchParams();
    body.append("file", "abc");
    body.append("fileName", "test-check.txt");

    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const text = await response.text();
    return res.status(200).json({ ok: response.ok, status: response.status, body: text });
  } catch (err) {
    console.error('ImageKit check error:', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

module.exports = router;
