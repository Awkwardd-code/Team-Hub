const prisma = require("../../prisma/client");
const {
  emitGoalCreated,
  emitGoalUpdated,
  emitGoalDeleted,
  emitGoalUpdateCreated,
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

function sanitizeUser(user) {
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

async function getGoalWithAccess(goalId, userId) {
  const goal = await prisma.goal.findUnique({
    where: { id: goalId },
    include: {
      owner: true,
      milestones: true,
      updates: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!goal) throw httpError("Goal not found", 404);

  await requireWorkspaceMember(goal.workspaceId, userId);
  return goal;
}

function formatGoal(goal) {
  return {
    ...goal,
    owner: goal.owner ? sanitizeUser(goal.owner) : null,
    updates: goal.updates?.map((update) => ({
      ...update,
      user: sanitizeUser(update.user),
    })),
  };
}

exports.getGoals = async (userId, workspaceId) => {
  if (!workspaceId) {
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId },
      select: { workspaceId: true },
    });

    const workspaceIds = memberships.map((item) => item.workspaceId);
    const goals = await prisma.goal.findMany({
      where: { workspaceId: { in: workspaceIds } },
      include: {
        owner: true,
        milestones: true,
        updates: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return goals.map(formatGoal);
  }

  await requireWorkspaceMember(workspaceId, userId);

  const goals = await prisma.goal.findMany({
    where: { workspaceId },
    include: {
      owner: true,
      milestones: true,
      updates: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return goals.map(formatGoal);
};

exports.createGoal = async (userId, body) => {
  const title = body.title?.trim();
  const workspaceId = body.workspaceId;
  const ownerId = body.ownerId || userId;

  if (!title) throw httpError("Goal title is required");
  if (!workspaceId) throw httpError("Workspace is required");

  await requireWorkspaceMember(workspaceId, userId);
  await requireWorkspaceMember(workspaceId, ownerId);

  const goal = await prisma.goal.create({
    data: {
      title,
      description: body.description?.trim() || null,
      workspaceId,
      ownerId,
      status: body.status || "NOT_STARTED",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    },
    include: {
      owner: true,
      milestones: true,
      updates: { include: { user: true } },
    },
  });

  const formatted = formatGoal(goal);
  emitGoalCreated(goal.workspaceId, formatted);

  const mentionedUsers = await findMentionedWorkspaceUsers({
    workspaceId,
    text: `${title} ${body.description || ""}`,
    excludeUserId: userId,
  });

  await Promise.all(
    mentionedUsers.map((user) =>
      createNotification({
        userId: user.id,
        workspaceId,
        type: "goal_mention",
        title: "You were mentioned in a goal",
        message: `${title}${body.description ? `: ${body.description}` : ""}`,
        link: "/goals",
      })
    )
  );
  return formatted;
};

exports.getGoal = async (userId, goalId) => {
  const goal = await getGoalWithAccess(goalId, userId);
  return formatGoal(goal);
};

exports.updateGoal = async (userId, goalId, body) => {
  const existing = await getGoalWithAccess(goalId, userId);

  const goal = await prisma.goal.update({
    where: { id: goalId },
    data: {
      title: body.title?.trim() || existing.title,
      description:
        typeof body.description === "string" ? body.description.trim() : existing.description,
      status: body.status || existing.status,
      dueDate: body.dueDate ? new Date(body.dueDate) : existing.dueDate,
      ownerId: body.ownerId || existing.ownerId,
    },
    include: {
      owner: true,
      milestones: true,
      updates: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const formatted = formatGoal(goal);
  emitGoalUpdated(goal.workspaceId, formatted);

  const mentionedUsers = await findMentionedWorkspaceUsers({
    workspaceId: goal.workspaceId,
    text: `${goal.title} ${body.description || ""}`,
    excludeUserId: userId,
  });

  await Promise.all(
    mentionedUsers.map((user) =>
      createNotification({
        userId: user.id,
        workspaceId: goal.workspaceId,
        type: "goal_mention",
        title: "You were mentioned in a goal",
        message: `${goal.title}${body.description ? `: ${body.description}` : ""}`,
        link: "/goals",
      })
    )
  );
  return formatted;
};

exports.deleteGoal = async (userId, goalId) => {
  const goal = await getGoalWithAccess(goalId, userId);

  await prisma.goal.delete({ where: { id: goalId } });
  emitGoalDeleted(goal.workspaceId, goalId);

  return { id: goalId };
};

exports.createMilestone = async (userId, goalId, body) => {
  const goal = await getGoalWithAccess(goalId, userId);

  const title = body.title?.trim();
  if (!title) throw httpError("Milestone title is required");

  const milestone = await prisma.milestone.create({
    data: {
      goalId,
      title,
      progress: Number(body.progress || 0),
    },
  });

  emitMilestoneCreated(goal.workspaceId, milestone);
  return milestone;
};

exports.updateMilestone = async (userId, goalId, milestoneId, body) => {
  const goal = await getGoalWithAccess(goalId, userId);

  const milestone = await prisma.milestone.update({
    where: { id: milestoneId },
    data: {
      title: body.title?.trim(),
      progress: Number(body.progress || 0),
    },
  });

  emitMilestoneUpdated(goal.workspaceId, milestone);
  return milestone;
};

exports.deleteMilestone = async (userId, goalId, milestoneId) => {
  const goal = await getGoalWithAccess(goalId, userId);

  await prisma.milestone.delete({ where: { id: milestoneId } });
  emitMilestoneDeleted(goal.workspaceId, milestoneId);

  return { id: milestoneId };
};

exports.createGoalUpdate = async (userId, goalId, body) => {
  const goal = await getGoalWithAccess(goalId, userId);

  const content = body.content?.trim();
  if (!content) throw httpError("Update content is required");

  const update = await prisma.goalUpdate.create({
    data: { goalId, userId, content },
    include: { user: true },
  });

  const mentionedUsers = await findMentionedWorkspaceUsers({
    workspaceId: goal.workspaceId,
    text: content,
    excludeUserId: userId,
  });

  await Promise.all(
    mentionedUsers.map((user) =>
      createNotification({
        userId: user.id,
        workspaceId: goal.workspaceId,
        type: "goal_mention",
        title: "You were mentioned in a goal update",
        message: `${update.user.name} mentioned you in a goal update.`,
        link: "/goals",
        metadata: { goalId, updateId: update.id },
      })
    )
  );

  const mentionedUserIds = new Set(mentionedUsers.map((user) => user.id));
  if (goal.ownerId !== userId && !mentionedUserIds.has(goal.ownerId)) {
    await createNotification({
      userId: goal.ownerId,
      actorUserId: userId,
      workspaceId: goal.workspaceId,
      type: "goal_update",
      title: "New update on your goal",
      message: `${update.user.name} posted an update on ${goal.title}.`,
      link: "/goals",
      metadata: { goalId, updateId: update.id },
    });
  }

  const formattedUpdate = {
    ...update,
    user: sanitizeUser(update.user),
  };
  emitGoalUpdateCreated(goal.workspaceId, { goalId, update: formattedUpdate });

  return formattedUpdate;
};

