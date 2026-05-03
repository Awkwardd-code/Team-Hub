const prisma = require("../../prisma/client");
const { createNotification } = require("../notifications/notification.service");
const {
  emitWorkspaceCreated,
  emitWorkspaceUpdated,
  emitWorkspaceDeleted,
} = require("../../socket/events");
const invitationService = require("../workspace-invitations/invitation.service");

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    isAdmin: user.isAdmin,
  };
}

function badRequest(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function getMembership(workspaceId, userId) {
  return prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: { userId, workspaceId },
    },
  });
}

async function requireMember(workspaceId, userId) {
  const member = await getMembership(workspaceId, userId);
  if (!member) throw badRequest("You are not a member of this workspace", 403);
  return member;
}

async function requireAdmin(workspaceId, userId) {
  const member = await requireMember(workspaceId, userId);
  if (member.role !== "ADMIN") {
    throw badRequest("Admin permission required", 403);
  }
  return member;
}

async function ensureNotLastAdmin(workspaceId, memberId) {
  const member = await prisma.workspaceMember.findUnique({
    where: { id: memberId },
  });

  if (!member || member.role !== "ADMIN") return;

  const adminCount = await prisma.workspaceMember.count({
    where: { workspaceId, role: "ADMIN" },
  });

  if (adminCount <= 1) {
    throw badRequest("Workspace must have at least one admin");
  }
}

exports.getWorkspaces = async (userId) => {
  const memberships = await prisma.workspaceMember.findMany({
    where: { userId },
    include: {
      workspace: {
        include: {
          members: true,
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  return memberships.map((membership) => ({
    id: membership.workspace.id,
    name: membership.workspace.name,
    description: membership.workspace.description,
    accentColor: membership.workspace.accentColor,
    createdAt: membership.workspace.createdAt,
    updatedAt: membership.workspace.updatedAt,
    memberCount: membership.workspace.members.length,
    myRole: membership.role,
  }));
};

exports.createWorkspace = async (userId, body) => {
  const name = body.name?.trim();
  const description = body.description?.trim() || null;
  const accentColor = body.accentColor || "#7c3aed";

  if (!name) throw badRequest("Workspace name is required");

  const workspace = await prisma.workspace.create({
    data: {
      name,
      description,
      accentColor,
      createdById: userId,
      members: {
        create: {
          userId,
          role: "ADMIN",
        },
      },
    },
    include: {
      members: {
        include: { user: true },
      },
    },
  });

  emitWorkspaceCreated(workspace.id, workspace);
  return workspace;
};

exports.getWorkspace = async (workspaceId, userId) => {
  const membership = await requireMember(workspaceId, userId);

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      members: {
        include: { user: true },
        orderBy: { joinedAt: "asc" },
      },
    },
  });

  return {
    ...workspace,
    myRole: membership.role,
    members: workspace.members.map((m) => ({
      id: m.id,
      role: m.role,
      joinedAt: m.joinedAt,
      user: publicUser(m.user),
    })),
  };
};

exports.updateWorkspace = async (workspaceId, userId, body) => {
  await requireAdmin(workspaceId, userId);

  const workspace = await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      name: body.name?.trim(),
      description: body.description?.trim() || null,
      accentColor: body.accentColor || "#7c3aed",
    },
  });
  emitWorkspaceUpdated(workspaceId, workspace);
  return workspace;
};

exports.getWorkspaceOverview = async (workspaceId, userId) => {
  const membership = await requireMember(workspaceId, userId);

  const [workspace, members, goalsCount, milestonesCount, actionItems, announcements, latestGoals, latestActionItems, latestAnnouncements] =
    await Promise.all([
      prisma.workspace.findUnique({ where: { id: workspaceId } }),
      prisma.workspaceMember.findMany({
        where: { workspaceId },
        include: { user: true },
        orderBy: { joinedAt: "asc" },
      }),
      prisma.goal.count({ where: { workspaceId } }),
      prisma.milestone.count({ where: { goal: { workspaceId } } }),
      prisma.actionItem.findMany({ where: { workspaceId }, select: { id: true, status: true } }),
      prisma.announcement.count({ where: { workspaceId } }),
      prisma.goal.findMany({
        where: { workspaceId },
        include: { owner: true, milestones: true, updates: { include: { user: true }, orderBy: { createdAt: "desc" }, take: 2 } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.actionItem.findMany({
        where: { workspaceId },
        include: { assignee: true, createdBy: true, goal: true },
        orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
        take: 8,
      }),
      prisma.announcement.findMany({
        where: { workspaceId },
        include: { author: true, comments: { include: { user: true }, orderBy: { createdAt: "desc" }, take: 3 }, reactions: true },
        orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
        take: 6,
      }),
    ]);

  if (!workspace) throw badRequest("Workspace not found", 404);

  return {
    workspace: {
      id: workspace.id,
      name: workspace.name,
      description: workspace.description,
      accentColor: workspace.accentColor,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    },
    myRole: membership.role,
    members: members.map((m) => ({
      id: m.id,
      role: m.role,
      joinedAt: m.joinedAt,
      user: publicUser(m.user),
    })),
    stats: {
      goals: goalsCount,
      milestones: milestonesCount,
      actionItems: actionItems.length,
      completedTasks: actionItems.filter((item) => item.status === "DONE").length,
      announcements,
      members: members.length,
    },
    latestGoals: latestGoals.map((goal) => ({
      ...goal,
      owner: goal.owner ? publicUser(goal.owner) : null,
      updates: (goal.updates || []).map((update) => ({
        ...update,
        user: publicUser(update.user),
      })),
    })),
    latestActionItems: (latestActionItems || []).map((item) => ({
      ...item,
      assignee: item.assignee ? publicUser(item.assignee) : null,
      createdBy: item.createdBy ? publicUser(item.createdBy) : null,
    })),
    latestAnnouncements: latestAnnouncements.map((announcement) => ({
      ...announcement,
      author: publicUser(announcement.author),
      comments: (announcement.comments || []).map((comment) => ({
        ...comment,
        user: publicUser(comment.user),
      })),
    })),
  };
};

exports.deleteWorkspace = async (workspaceId, userId) => {
  await requireAdmin(workspaceId, userId);

  await prisma.workspace.delete({
    where: { id: workspaceId },
  });
  emitWorkspaceDeleted(workspaceId, { id: workspaceId });
  return { id: workspaceId };
};

exports.getMembers = async (workspaceId, userId) => {
  await requireMember(workspaceId, userId);

  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId },
    include: { user: true },
  });

  return members.map((m) => ({
    id: m.id,
    role: m.role,
    joinedAt: m.joinedAt,
    user: publicUser(m.user),
  }));
};

exports.inviteMember = async (workspaceId, userId, body) => {
  return invitationService.inviteToWorkspace({
    actorId: userId,
    workspaceId,
    email: body.email,
    role: body.role,
  });
};

exports.updateMemberRole = async (workspaceId, memberId, userId, role) => {
  await requireAdmin(workspaceId, userId);

  if (!["ADMIN", "MEMBER"].includes(role)) {
    throw badRequest("Invalid role");
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
    await createNotification({
      userId: member.userId,
      actorUserId: userId,
      workspaceId,
      type: "role_update",
      title: "Your role was updated",
      message: `Your role in this workspace was changed to ${role}.`,
      link: `/workspaces/${workspaceId}`,
    });
  }

  return member;
};

exports.removeMember = async (workspaceId, memberId, userId) => {
  const requester = await requireMember(workspaceId, userId);
  const target = await prisma.workspaceMember.findUnique({
    where: { id: memberId },
  });

  if (!target || target.workspaceId !== workspaceId) {
    throw badRequest("Member not found", 404);
  }

  const removingSelf = target.userId === userId;

  if (!removingSelf && requester.role !== "ADMIN") {
    throw badRequest("Admin permission required", 403);
  }

  await ensureNotLastAdmin(workspaceId, memberId);

  return prisma.workspaceMember.delete({
    where: { id: memberId },
  });
};
