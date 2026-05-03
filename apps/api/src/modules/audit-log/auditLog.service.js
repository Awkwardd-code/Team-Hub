const prisma = require("../../prisma/client");

function httpError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function publicUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  };
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

async function getAdminWorkspaceIds(userId) {
  const memberships = await prisma.workspaceMember.findMany({
    where: {
      userId,
      role: "ADMIN",
    },
    select: {
      workspaceId: true,
    },
  });

  return memberships.map((item) => item.workspaceId);
}

function formatLog(log) {
  return {
    ...log,
    user: publicUser(log.user),
    workspace: log.workspace
      ? {
          id: log.workspace.id,
          name: log.workspace.name,
          accentColor: log.workspace.accentColor,
        }
      : null,
  };
}

exports.getAuditLogs = async (userId, query) => {
  const { workspaceId, entityType, action, startDate, endDate } = query;

  let workspaceIds = [];

  if (workspaceId) {
    await requireWorkspaceAdmin(workspaceId, userId);
    workspaceIds = [workspaceId];
  } else {
    workspaceIds = await getAdminWorkspaceIds(userId);
  }

  const logs = await prisma.auditLog.findMany({
    where: {
      workspaceId: {
        in: workspaceIds,
      },
      ...(entityType ? { entityType } : {}),
      ...(action ? { action } : {}),
      ...(startDate || endDate
        ? {
            createdAt: {
              ...(startDate ? { gte: new Date(startDate) } : {}),
              ...(endDate ? { lte: new Date(endDate) } : {}),
            },
          }
        : {}),
    },
    include: {
      user: true,
      workspace: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  return logs.map(formatLog);
};

exports.createAuditLog = async (userId, body) => {
  const { workspaceId, action, entityType, entityId, metadata } = body;

  if (!action) throw httpError("Action is required");
  if (!entityType) throw httpError("Entity type is required");

  if (workspaceId) {
    await requireWorkspaceAdmin(workspaceId, userId);
  }

  const log = await prisma.auditLog.create({
    data: {
      workspaceId: workspaceId || null,
      userId,
      action,
      entityType,
      entityId: entityId || null,
      metadata: metadata || {},
    },
    include: {
      user: true,
      workspace: true,
    },
  });

  return formatLog(log);
};

exports.exportAuditLogsCsv = async (userId, query) => {
  const logs = await exports.getAuditLogs(userId, query);

  const rows = [
    ["Date", "Workspace", "User", "Action", "Entity Type", "Entity ID", "Metadata"],
    ...logs.map((log) => [
      new Date(log.createdAt).toISOString(),
      log.workspace?.name || "",
      log.user?.email || "",
      log.action,
      log.entityType,
      log.entityId || "",
      JSON.stringify(log.metadata || {}),
    ]),
  ];

  return rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");
};

exports.createSystemAuditLog = async ({
  userId = null,
  workspaceId = null,
  action,
  entityType,
  entityId = null,
  metadata = {},
}) => {
  if (!action || !entityType) return null;
  return prisma.auditLog.create({
    data: {
      userId,
      workspaceId,
      action,
      entityType,
      entityId,
      metadata,
    },
  });
};
