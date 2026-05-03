const prisma = require("../../prisma/client");
const { createNotification } = require("../notifications/notification.service");
const { emitWorkspaceMemberAdded } = require("../../socket/events");
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

  if (!member) throw httpError("You are not a member of this workspace", 403);
  if (member.role !== "ADMIN") throw httpError("Workspace admin permission required", 403);

  return member;
}

exports.inviteToWorkspace = async ({ actorId, workspaceId, email, role }) => {
  await requireWorkspaceAdmin(workspaceId, actorId);

  const normalizedEmail = String(email || "").trim().toLowerCase();
  const inviteRole = role === "ADMIN" ? "ADMIN" : "MEMBER";
  if (!normalizedEmail) throw httpError("Email is required");

  const [workspace, inviter, invitee] = await Promise.all([
    prisma.workspace.findUnique({ where: { id: workspaceId } }),
    prisma.user.findUnique({ where: { id: actorId } }),
    prisma.user.findUnique({ where: { email: normalizedEmail } }),
  ]);

  if (!workspace) throw httpError("Workspace not found", 404);
  if (!inviter) throw httpError("Inviter not found", 404);
  if (!invitee) throw httpError("User must register before they can be invited.", 404);

  const existingMembership = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: invitee.id,
        workspaceId,
      },
    },
  });

  if (existingMembership) throw httpError("User is already a workspace member", 400);

  const pendingInvitation = await prisma.workspaceInvitation.findFirst({
    where: {
      workspaceId,
      inviteeId: invitee.id,
      status: "PENDING",
    },
  });

  if (pendingInvitation) throw httpError("User already has a pending invitation", 400);

  const invitation = await prisma.workspaceInvitation.create({
    data: {
      workspaceId,
      inviterId: actorId,
      inviteeId: invitee.id,
      role: inviteRole,
      status: "PENDING",
    },
  });

  if (invitee.id !== actorId) {
    await createNotification({
      userId: invitee.id,
      workspaceId,
      type: "workspace_invite",
      title: "Workspace invitation",
      message: `${inviter.name} invited you to join ${workspace.name} as ${inviteRole}.`,
      link: "/notifications",
      metadata: {
        invitationId: invitation.id,
        workspaceId,
        role: inviteRole,
      },
    });
  }

  await createSystemAuditLog({
    userId: actorId,
    workspaceId,
    action: "invite_sent",
    entityType: "workspace_invitation",
    entityId: invitation.id,
    metadata: { inviteeId: invitee.id, role: inviteRole },
  });

  return {
    message: "Invitation sent",
    invitation: {
      id: invitation.id,
      workspaceId,
      inviteeId: invitee.id,
      role: invitation.role,
      status: invitation.status,
      createdAt: invitation.createdAt,
    },
  };
};

exports.getMyInvitations = async (userId) => {
  return prisma.workspaceInvitation.findMany({
    where: { inviteeId: userId },
    include: {
      workspace: {
        select: { id: true, name: true, description: true },
      },
      inviter: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

exports.acceptInvitation = async ({ invitationId, userId }) => {
  const invitation = await prisma.workspaceInvitation.findUnique({
    where: { id: invitationId },
    include: {
      workspace: true,
      invitee: true,
      inviter: true,
    },
  });

  if (!invitation) throw httpError("Invitation not found", 404);
  if (invitation.inviteeId !== userId) throw httpError("You are not allowed to accept this invitation", 403);
  if (invitation.status === "ACCEPTED") {
    return { success: true, status: "ACCEPTED", alreadyProcessed: true };
  }
  if (invitation.status === "DECLINED") {
    return { success: true, status: "DECLINED", alreadyProcessed: true };
  }
  if (invitation.status !== "PENDING") throw httpError("Invitation is no longer pending", 400);

  const existingMembership = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: invitation.inviteeId,
        workspaceId: invitation.workspaceId,
      },
    },
  });

  await prisma.$transaction(async (tx) => {
    if (!existingMembership) {
      await tx.workspaceMember.create({
        data: {
          userId: invitation.inviteeId,
          workspaceId: invitation.workspaceId,
          role: invitation.role,
        },
      });
    }

    await tx.workspaceInvitation.update({
      where: { id: invitation.id },
      data: {
        status: "ACCEPTED",
        respondedAt: new Date(),
      },
    });
  });

  await createNotification({
    userId: invitation.inviterId,
    workspaceId: invitation.workspaceId,
    type: "workspace_invite_accepted",
    title: "Invitation accepted",
    message: `${invitation.invitee.name} accepted your invitation to ${invitation.workspace.name}.`,
    link: `/workspaces/${invitation.workspaceId}`,
  });

  emitWorkspaceMemberAdded(invitation.workspaceId, {
    workspaceId: invitation.workspaceId,
    member: {
      role: invitation.role,
      user: {
        id: invitation.invitee.id,
        name: invitation.invitee.name,
        email: invitation.invitee.email,
        avatarUrl: invitation.invitee.avatarUrl,
      },
    },
  });

  await createSystemAuditLog({
    userId,
    workspaceId: invitation.workspaceId,
    action: "invitation_accepted",
    entityType: "workspace_invitation",
    entityId: invitation.id,
    metadata: { inviteeId: invitation.inviteeId, role: invitation.role },
  });

  return { success: true, status: "ACCEPTED" };
};

exports.declineInvitation = async ({ invitationId, userId }) => {
  const invitation = await prisma.workspaceInvitation.findUnique({
    where: { id: invitationId },
    include: {
      workspace: true,
      invitee: true,
    },
  });

  if (!invitation) throw httpError("Invitation not found", 404);
  if (invitation.inviteeId !== userId) throw httpError("You are not allowed to decline this invitation", 403);
  if (invitation.status === "DECLINED") {
    return { success: true, status: "DECLINED", alreadyProcessed: true };
  }
  if (invitation.status === "ACCEPTED") {
    return { success: true, status: "ACCEPTED", alreadyProcessed: true };
  }
  if (invitation.status !== "PENDING") throw httpError("Invitation is no longer pending", 400);

  await prisma.workspaceInvitation.update({
    where: { id: invitation.id },
    data: {
      status: "DECLINED",
      respondedAt: new Date(),
    },
  });

  await createNotification({
    userId: invitation.inviterId,
    workspaceId: invitation.workspaceId,
    type: "workspace_invite_declined",
    title: "Invitation declined",
    message: `${invitation.invitee.name} declined your invitation to ${invitation.workspace.name}.`,
    link: "/notifications",
  });

  return { success: true, status: "DECLINED" };
};
