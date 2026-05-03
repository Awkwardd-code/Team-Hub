const prisma = require("../../prisma/client");

exports.getPreferences = async (userId) => {
  return prisma.userPreference.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
};

exports.updatePreferences = async (userId, body) => {
  await prisma.userPreference.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  return prisma.userPreference.update({
    where: { userId },
    data: {
      theme: body.theme || undefined,
      notifyMentions:
        typeof body.notifyMentions === "boolean" ? body.notifyMentions : undefined,
      notifyTasks: typeof body.notifyTasks === "boolean" ? body.notifyTasks : undefined,
      notifyRoleChanges:
        typeof body.notifyRoleChanges === "boolean" ? body.notifyRoleChanges : undefined,
    },
  });
};
