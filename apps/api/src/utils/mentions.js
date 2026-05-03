const prisma = require("../prisma/client");

function normalizeName(value) {
  return String(value || "").toLowerCase().trim();
}

function extractMentionTokens(text) {
  if (!text || typeof text !== "string") return [];
  const matches = text.match(/@([A-Za-z0-9._@-]+)/g) || [];
  const tokens = matches
    .map((item) => item.slice(1).trim().toLowerCase())
    .filter(Boolean);

  return Array.from(new Set(tokens));
}

async function findMentionedWorkspaceUsers({ workspaceId, text, excludeUserId }) {
  const tokens = extractMentionTokens(text);
  if (!workspaceId || tokens.length === 0) return [];

  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId },
    include: { user: true },
  });

  const matchedUsers = members
    .map((member) => member.user)
    .filter(Boolean)
    .filter((user) => user.id !== excludeUserId)
    .filter((user) => {
      const email = normalizeName(user.email);
      const emailLocal = email.split("@")[0];
      const name = normalizeName(user.name);
      const compactName = name.replace(/\s+/g, "");

      return tokens.some(
        (token) => token === email || token === emailLocal || token === name || token === compactName
      );
    });

  return Array.from(new Map(matchedUsers.map((user) => [user.id, user])).values());
}

module.exports = {
  extractMentionTokens,
  findMentionedWorkspaceUsers,
};
