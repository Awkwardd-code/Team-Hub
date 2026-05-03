const prisma = require("../../prisma/client");
const { createSystemAuditLog } = require("../audit-log/auditLog.service");

function httpError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function requireWorkspaceAdmin(workspaceId, userId) {
  const member = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });

  if (!member) {
    throw httpError("You are not a member of this workspace", 403);
  }

  if (member.role !== "ADMIN") {
    throw httpError("Workspace admin permission required", 403);
  }

  return member;
}

async function ensureSettings(workspaceId) {
  return prisma.workspaceSetting.upsert({
    where: { workspaceId },
    update: {},
    create: { workspaceId },
  });
}

exports.getSettings = async (userId, workspaceId) => {
  await requireWorkspaceAdmin(workspaceId, userId);

  return ensureSettings(workspaceId);
};

exports.updateSettings = async (userId, workspaceId, body) => {
  await requireWorkspaceAdmin(workspaceId, userId);

  await ensureSettings(workspaceId);

  const allowedGoalStatuses = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "ON_HOLD"];
  const allowedPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

  if (
    body.defaultGoalStatus &&
    !allowedGoalStatuses.includes(body.defaultGoalStatus)
  ) {
    throw httpError("Invalid default goal status");
  }

  if (
    body.defaultActionPriority &&
    !allowedPriorities.includes(body.defaultActionPriority)
  ) {
    throw httpError("Invalid default action priority");
  }

  const updated = await prisma.workspaceSetting.update({
    where: { workspaceId },
    data: {
      allowMemberInvites:
        typeof body.allowMemberInvites === "boolean"
          ? body.allowMemberInvites
          : undefined,

      requireAdminApprovals:
        typeof body.requireAdminApprovals === "boolean"
          ? body.requireAdminApprovals
          : undefined,

      allowPublicExports:
        typeof body.allowPublicExports === "boolean"
          ? body.allowPublicExports
          : undefined,

      defaultGoalStatus: body.defaultGoalStatus || undefined,
      defaultActionPriority: body.defaultActionPriority || undefined,
    },
  });

  await createSystemAuditLog({
    userId,
    workspaceId,
    action: "workspace_settings_updated",
    entityType: "workspace_setting",
    entityId: updated.id,
    metadata: {
      allowMemberInvites: updated.allowMemberInvites,
      requireAdminApprovals: updated.requireAdminApprovals,
      allowPublicExports: updated.allowPublicExports,
      defaultGoalStatus: updated.defaultGoalStatus,
      defaultActionPriority: updated.defaultActionPriority,
    },
  });

  return updated;
};
