const prisma = require("../../prisma/client");
const {
  emitActionItemCreated,
  emitActionItemUpdated,
  emitActionItemDeleted,
} = require("../../socket/events");
const { createNotification } = require("../notifications/notification.service");

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

async function getItemWithAccess(itemId, userId) {
  const item = await prisma.actionItem.findUnique({
    where: { id: itemId },
    include: {
      assignee: true,
      createdBy: true,
      workspace: true,
      goal: true,
    },
  });

  if (!item) throw httpError("Action item not found", 404);

  await requireWorkspaceMember(item.workspaceId, userId);
  return item;
}

function formatItem(item) {
  return {
    ...item,
    assignee: publicUser(item.assignee),
    createdBy: publicUser(item.createdBy),
  };
}

exports.getActionItems = async (userId, query) => {
  const { workspaceId, goalId, status, priority, assigneeId } = query;

  if (workspaceId) {
    await requireWorkspaceMember(workspaceId, userId);
  }

  const workspaceIds = workspaceId
    ? [workspaceId]
    : (
        await prisma.workspaceMember.findMany({
          where: { userId },
          select: { workspaceId: true },
        })
      ).map((item) => item.workspaceId);

  const items = await prisma.actionItem.findMany({
    where: {
      workspaceId: { in: workspaceIds },
      ...(goalId ? { goalId } : {}),
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
      ...(assigneeId ? { assigneeId } : {}),
    },
    include: {
      assignee: true,
      createdBy: true,
      workspace: true,
      goal: true,
    },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });

  return items.map(formatItem);
};

exports.createActionItem = async (userId, body) => {
  const workspaceId = body.workspaceId;
  const title = body.title?.trim();

  if (!workspaceId) throw httpError("Workspace is required");
  if (!title) throw httpError("Title is required");

  await requireWorkspaceMember(workspaceId, userId);

  if (body.assigneeId) {
    await requireWorkspaceMember(workspaceId, body.assigneeId);
  }

  if (body.goalId) {
    const goal = await prisma.goal.findUnique({ where: { id: body.goalId } });
    if (!goal || goal.workspaceId !== workspaceId) {
      throw httpError("Goal does not belong to this workspace");
    }
  }

  const item = await prisma.actionItem.create({
    data: {
      workspaceId,
      goalId: body.goalId || null,
      assigneeId: body.assigneeId || null,
      createdById: userId,
      title,
      description: body.description?.trim() || null,
      status: body.status || "TODO",
      priority: body.priority || "MEDIUM",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    },
    include: {
      assignee: true,
      createdBy: true,
      workspace: true,
      goal: true,
    },
  });

  const formatted = formatItem(item);
  emitActionItemCreated(item.workspaceId, formatted);

  if (item.assigneeId && item.assigneeId !== userId) {
    await createNotification({
      userId: item.assigneeId,
      workspaceId: item.workspaceId,
      type: "task",
      title: "You were assigned a task",
      message: item.title,
      link: "/action-items",
    });
  }
  return formatted;
};

exports.getActionItem = async (userId, itemId) => {
  const item = await getItemWithAccess(itemId, userId);
  return formatItem(item);
};

exports.updateActionItem = async (userId, itemId, body) => {
  const existing = await getItemWithAccess(itemId, userId);

  if (body.assigneeId) {
    await requireWorkspaceMember(existing.workspaceId, body.assigneeId);
  }

  const item = await prisma.actionItem.update({
    where: { id: itemId },
    data: {
      title: body.title?.trim() || existing.title,
      description: typeof body.description === "string" ? body.description.trim() : existing.description,
      status: body.status || existing.status,
      priority: body.priority || existing.priority,
      assigneeId:
        typeof body.assigneeId !== "undefined" ? body.assigneeId || null : existing.assigneeId,
      goalId: typeof body.goalId !== "undefined" ? body.goalId || null : existing.goalId,
      dueDate: body.dueDate ? new Date(body.dueDate) : existing.dueDate,
    },
    include: {
      assignee: true,
      createdBy: true,
      workspace: true,
      goal: true,
    },
  });

  const formatted = formatItem(item);
  emitActionItemUpdated(item.workspaceId, formatted);

  const assigneeChanged =
    typeof body.assigneeId !== "undefined" && body.assigneeId && body.assigneeId !== existing.assigneeId;
  const statusChanged = body.status && body.status !== existing.status;

  if (assigneeChanged && item.assigneeId && item.assigneeId !== userId) {
    await createNotification({
      userId: item.assigneeId,
      workspaceId: item.workspaceId,
      type: "task",
      title: "You were assigned a task",
      message: item.title,
      link: "/action-items",
    });
  }

  if (statusChanged && item.assigneeId && item.assigneeId !== userId) {
    await createNotification({
      userId: item.assigneeId,
      workspaceId: item.workspaceId,
      type: "task",
      title: "A task status changed",
      message: `${item.title} is now ${item.status.replaceAll("_", " ")}`,
      link: "/action-items",
    });
  }
  return formatted;
};

exports.deleteActionItem = async (userId, itemId) => {
  const item = await getItemWithAccess(itemId, userId);

  await prisma.actionItem.delete({ where: { id: itemId } });
  emitActionItemDeleted(item.workspaceId, itemId);

  return { id: itemId };
};

