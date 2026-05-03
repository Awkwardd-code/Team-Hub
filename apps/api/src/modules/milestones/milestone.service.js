const prisma = require("../../prisma/client");
const {
  emitMilestoneCreated,
  emitMilestoneUpdated,
  emitMilestoneDeleted,
} = require("../../socket/events");
const { createNotification } = require("../notifications/notification.service");
const { findMentionedWorkspaceUsers } = require("../../utils/mentions");

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

async function requireWorkspaceMember(workspaceId, userId) {
  const member = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });

  if (!member) throw httpError("You are not a member of this workspace", 403);
  return member;
}

async function requireGoalAccess(goalId, userId) {
  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
    include: { workspace: true },
  });

  if (!goal) throw httpError("Goal not found", 404);

  await requireWorkspaceMember(goal.workspaceId, userId);
  return goal;
}

function formatMilestone(milestone) {
  return {
    ...milestone,
    owner: publicUser(milestone.owner),
    goal: milestone.goal
      ? {
          id: milestone.goal.id,
          title: milestone.goal.title,
          workspaceId: milestone.goal.workspaceId,
          workspace: milestone.goal.workspace,
        }
      : null,
  };
}

exports.getMilestones = async (userId, query) => {
  const { workspaceId, goalId, status } = query;

  if (goalId) await requireGoalAccess(goalId, userId);
  if (workspaceId) await requireWorkspaceMember(workspaceId, userId);

  if (!workspaceId && !goalId) {
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId },
      select: { workspaceId: true },
    });
    const workspaceIds = memberships.map((item) => item.workspaceId);

    const milestones = await prisma.milestone.findMany({
      where: {
        goal: { workspaceId: { in: workspaceIds } },
        ...(status ? { status } : {}),
      },
      include: {
        owner: true,
        goal: { include: { workspace: true } },
      },
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    });

    return milestones.map(formatMilestone);
  }

  const milestones = await prisma.milestone.findMany({
    where: {
      ...(goalId ? { goalId } : {}),
      ...(workspaceId ? { goal: { workspaceId } } : {}),
      ...(status ? { status } : {}),
    },
    include: {
      owner: true,
      goal: { include: { workspace: true } },
    },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });

  return milestones.map(formatMilestone);
};

exports.createMilestone = async (userId, body) => {
  const goalId = body.goalId;
  const title = body.title?.trim();

  if (!goalId) throw httpError("Goal is required");
  if (!title) throw httpError("Milestone title is required");

  const goal = await requireGoalAccess(goalId, userId);

  if (body.ownerId) {
    await requireWorkspaceMember(goal.workspaceId, body.ownerId);
  }

  const progress = Number(body.progress || 0);
  if (progress < 0 || progress > 100) {
    throw httpError("Progress must be between 0 and 100");
  }

  const milestone = await prisma.milestone.create({
    data: {
      goalId,
      ownerId: body.ownerId || userId,
      title,
      description: body.description?.trim() || null,
      progress,
      status: body.status || "NOT_STARTED",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    },
    include: {
      owner: true,
      goal: { include: { workspace: true } },
    },
  });

  const formatted = formatMilestone(milestone);
  emitMilestoneCreated(goal.workspaceId, formatted);

  const mentionedUsers = await findMentionedWorkspaceUsers({
    workspaceId: goal.workspaceId,
    text: `${title} ${body.description || ""}`,
    excludeUserId: userId,
  });

  await Promise.all(
    mentionedUsers.map((user) =>
      createNotification({
        userId: user.id,
        workspaceId: goal.workspaceId,
        type: "mention",
        title: "You were mentioned in a milestone",
        message: `${title}${body.description ? `: ${body.description}` : ""}`,
        link: "/milestones",
      })
    )
  );
  return formatted;
};

exports.updateMilestone = async (userId, milestoneId, body) => {
  const existing = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    include: { goal: true },
  });

  if (!existing) throw httpError("Milestone not found", 404);

  const goal = await requireGoalAccess(existing.goalId, userId);

  if (body.ownerId) {
    await requireWorkspaceMember(goal.workspaceId, body.ownerId);
  }

  const progress = typeof body.progress !== "undefined" ? Number(body.progress) : existing.progress;
  if (progress < 0 || progress > 100) {
    throw httpError("Progress must be between 0 and 100");
  }

  const milestone = await prisma.milestone.update({
    where: { id: milestoneId },
    data: {
      title: body.title?.trim() || existing.title,
      description: typeof body.description === "string" ? body.description.trim() : existing.description,
      progress,
      status: body.status || existing.status,
      dueDate: body.dueDate ? new Date(body.dueDate) : existing.dueDate,
      ownerId: body.ownerId || existing.ownerId,
    },
    include: {
      owner: true,
      goal: { include: { workspace: true } },
    },
  });

  const formatted = formatMilestone(milestone);
  emitMilestoneUpdated(goal.workspaceId, formatted);

  const mentionedUsers = await findMentionedWorkspaceUsers({
    workspaceId: goal.workspaceId,
    text: `${milestone.title} ${typeof body.description === "string" ? body.description : ""}`,
    excludeUserId: userId,
  });

  await Promise.all(
    mentionedUsers.map((user) =>
      createNotification({
        userId: user.id,
        workspaceId: goal.workspaceId,
        type: "mention",
        title: "You were mentioned in a milestone",
        message: `${milestone.title}${typeof body.description === "string" ? `: ${body.description}` : ""}`,
        link: "/milestones",
      })
    )
  );
  return formatted;
};

exports.deleteMilestone = async (userId, milestoneId) => {
  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    include: { goal: true },
  });

  if (!milestone) throw httpError("Milestone not found", 404);

  const goal = await requireGoalAccess(milestone.goalId, userId);

  await prisma.milestone.delete({ where: { id: milestoneId } });
  emitMilestoneDeleted(goal.workspaceId, milestoneId);

  return { id: milestoneId };
};

