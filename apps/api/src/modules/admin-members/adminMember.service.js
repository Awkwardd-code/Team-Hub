const prisma = require("../../prisma/client");
const { createNotification } = require("../notifications/notification.service");
const invitationService = require("../workspace-invitations/invitation.service");
const { createSystemAuditLog } = require("../audit-log/auditLog.service");

function httpError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    isAdmin: user.isAdmin,
    emailVerified: user.emailVerified,
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

  if (!member) throw httpError("You are not a member of this workspace", 403);
  if (member.role !== "ADMIN") throw httpError("Workspace admin permission required", 403);

  return member;
}

async function ensureNotLastAdmin(workspaceId, memberId) {
  const member = await prisma.workspaceMember.findUnique({
    where: { id: memberId },
  });

  if (!member) throw httpError("Member not found", 404);
  if (member.role !== "ADMIN") return;

  const adminCount = await prisma.workspaceMember.count({
    where: {
      workspaceId,
      role: "ADMIN",
    },
  });

  if (adminCount <= 1) {
    throw httpError("Workspace must have at least one admin");
  }
}

exports.getMembers = async (userId, workspaceId) => {
  await requireWorkspaceAdmin(workspaceId, userId);

  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId },
    include: { user: true },
    orderBy: [{ role: "asc" }, { joinedAt: "asc" }],
  });

  return members.map((member) => ({
    id: member.id,
    role: member.role,
    joinedAt: member.joinedAt,
    user: publicUser(member.user),
  }));
};

exports.inviteMember = async (userId, workspaceId, body) => {
  const invitation = await invitationService.inviteToWorkspace({
    actorId: userId,
    workspaceId,
    email: body.email,
    role: body.role,
  });

  return invitation;
};

exports.updateMemberRole = async (userId, workspaceId, memberId, role) => {
  await requireWorkspaceAdmin(workspaceId, userId);

  if (!["ADMIN", "MEMBER"].includes(role)) {
    throw httpError("Invalid role");
  }

  const target = await prisma.workspaceMember.findUnique({
    where: { id: memberId },
  });

  if (!target || target.workspaceId !== workspaceId) {
    throw httpError("Member not found", 404);
  }

  if (role === "MEMBER") {
    await ensureNotLastAdmin(workspaceId, memberId);
  }

  const member = await prisma.workspaceMember.update({
    where: { id: memberId },
    data: { role },
    include: { user: true },
  });

  if (member.userId !== userId) {
    const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId }, select: { name: true } });
    await createNotification({
      userId: member.userId,
      actorUserId: userId,
      workspaceId,
      type: "role_update",
      title: "Your role was updated",
      message: `Your role in ${workspace?.name || "this workspace"} was changed to ${role}.`,
      link: `/workspaces/${workspaceId}`,
    });
  }

  await createSystemAuditLog({
    userId,
    workspaceId,
    action: "role_changed",
    entityType: "workspace_member",
    entityId: member.id,
    metadata: { memberUserId: member.userId, role },
  });

  return {
    id: member.id,
    role: member.role,
    joinedAt: member.joinedAt,
    user: publicUser(member.user),
  };
};

exports.removeMember = async (userId, workspaceId, memberId) => {
  await requireWorkspaceAdmin(workspaceId, userId);

  const target = await prisma.workspaceMember.findUnique({
    where: { id: memberId },
  });

  if (!target || target.workspaceId !== workspaceId) {
    throw httpError("Member not found", 404);
  }

  await ensureNotLastAdmin(workspaceId, memberId);

  const deleted = await prisma.workspaceMember.delete({
    where: { id: memberId },
  });

  await createSystemAuditLog({
    userId,
    workspaceId,
    action: "member_removed",
    entityType: "workspace_member",
    entityId: memberId,
    metadata: { memberUserId: deleted.userId },
  });

  return deleted;
};

exports.getAdminOverview = async (userId) => {
  const adminMemberships = await prisma.workspaceMember.findMany({
    where: { userId, role: "ADMIN" },
    select: { workspaceId: true },
  });
  const workspaceIds = adminMemberships.map((item) => item.workspaceId);

  const [memberCount, pendingInvitations, recentAuditLogs] = await Promise.all([
    prisma.workspaceMember.count({ where: { workspaceId: { in: workspaceIds } } }),
    prisma.workspaceInvitation.count({ where: { workspaceId: { in: workspaceIds }, status: "PENDING" } }),
    prisma.auditLog.findMany({
      where: { workspaceId: { in: workspaceIds } },
      include: { user: true, workspace: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return {
    workspaceCount: workspaceIds.length,
    memberCount,
    pendingInvitations,
    recentAuditLogs: recentAuditLogs.map((log) => ({
      ...log,
      user: log.user
        ? { id: log.user.id, name: log.user.name, email: log.user.email, avatarUrl: log.user.avatarUrl }
        : null,
      workspace: log.workspace ? { id: log.workspace.id, name: log.workspace.name } : null,
    })),
  };
};
