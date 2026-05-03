const prisma = require("../../prisma/client");
const { uploadDataUrlToCloudinary } = require("../../utils/cloudinary");

const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_FILE_SIZE = 2 * 1024 * 1024;

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    emailVerified: user.emailVerified,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function parseDataUrl(dataUrl) {
  if (typeof dataUrl !== "string") return null;

  const match = dataUrl.match(/^data:(image\/(png|jpeg|webp));base64,(.+)$/i);
  if (!match) return null;

  const mimeType = match[1].toLowerCase();
  const base64 = match[3];
  const sizeBytes = Buffer.byteLength(base64, "base64");

  return { mimeType, sizeBytes };
}

async function updateCurrentUser(req, res) {
  try {
    const userId = req.user.id;
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const avatarDataUrl = req.body.avatarDataUrl;

    const updateData = {};

    if (name) {
      updateData.name = name;
    }

    if (avatarDataUrl) {
      const parsed = parseDataUrl(avatarDataUrl);

      if (!parsed || !ALLOWED_MIME.has(parsed.mimeType)) {
        return res.status(400).json({ message: "Invalid image format. Only PNG, JPEG, and WEBP are allowed." });
      }

      if (parsed.sizeBytes > MAX_FILE_SIZE) {
        return res.status(400).json({ message: "File size must be 2MB or less." });
      }

      const uploaded = await uploadDataUrlToCloudinary(avatarDataUrl, {
        folder: "teamhub/avatars",
        resource_type: "image",
      });

      updateData.avatarUrl = uploaded.secure_url;
    }

    if (!updateData.name && !updateData.avatarUrl) {
      return res.status(400).json({ message: "No valid profile changes provided." });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return res.status(200).json({ user: sanitizeUser(updated) });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile." });
  }
}

module.exports = {
  updateCurrentUser,
};