const prisma = require("../../prisma/client");

function httpError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function getAccessibleWorkspaceIds(userId, workspaceId) {
  if (workspaceId) {
    const membership = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId, workspaceId } },
    });

    if (!membership) throw httpError("You are not a member of this workspace", 403);
    return [workspaceId];
  }

  const memberships = await prisma.workspaceMember.findMany({
    where: { userId },
    select: { workspaceId: true },
  });

  return memberships.map((item) => item.workspaceId);
}

function startOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

exports.getOverview = async (userId, workspaceId) => {
  const workspaceIds = await getAccessibleWorkspaceIds(userId, workspaceId);
  const now = new Date();
  const weekStart = startOfWeek(now);

  if (workspaceIds.length === 0) {
    return {
      stats: {
        totalGoals: 0,
        completedGoals: 0,
        completedThisWeek: 0,
        overdueGoals: 0,
        totalMilestones: 0,
        completedMilestones: 0,
        blockedMilestones: 0,
        totalActionItems: 0,
        completedActionItems: 0,
        overdueActionItems: 0,
        announcements: 0,
        members: 0,
        goalCompletionRate: 0,
        milestoneCompletionRate: 0,
        actionItemCompletionRate: 0,
      },
      goalStatus: [
        { name: "Completed", value: 0 },
        { name: "In Progress", value: 0 },
        { name: "Not Started", value: 0 },
        { name: "On Hold", value: 0 },
      ],
      actionItemStatus: [
        { name: "Done", value: 0 },
        { name: "In Progress", value: 0 },
        { name: "To Do", value: 0 },
        { name: "Blocked", value: 0 },
      ],
      milestoneStatus: [
        { name: "Completed", value: 0 },
        { name: "In Progress", value: 0 },
        { name: "Not Started", value: 0 },
        { name: "Blocked", value: 0 },
      ],
      progressTrend: [
        { name: "Mon", progress: 0 },
        { name: "Tue", progress: 0 },
        { name: "Wed", progress: 0 },
        { name: "Thu", progress: 0 },
        { name: "Fri", progress: 0 },
        { name: "Sat", progress: 0 },
        { name: "Sun", progress: 0 },
      ],
      recentActivity: [],
    };
  }

  const [
    totalGoals,
    completedGoals,
    inProgressGoals,
    notStartedGoals,
    onHoldGoals,
    overdueGoals,
    completedThisWeek,
    totalMilestones,
    completedMilestones,
    inProgressMilestones,
    notStartedMilestones,
    blockedMilestones,
    totalActionItems,
    completedActionItems,
    inProgressActionItems,
    todoActionItems,
    blockedActionItems,
    overdueActionItems,
    announcements,
    members,
    recentActivity,
  ] = await Promise.all([
    prisma.goal.count({ where: { workspaceId: { in: workspaceIds } } }),
    prisma.goal.count({ where: { workspaceId: { in: workspaceIds }, status: "COMPLETED" } }),
    prisma.goal.count({ where: { workspaceId: { in: workspaceIds }, status: "IN_PROGRESS" } }),
    prisma.goal.count({ where: { workspaceId: { in: workspaceIds }, status: "NOT_STARTED" } }),
    prisma.goal.count({ where: { workspaceId: { in: workspaceIds }, status: "ON_HOLD" } }),
    prisma.goal.count({
      where: {
        workspaceId: { in: workspaceIds },
        dueDate: { lt: now },
        status: { not: "COMPLETED" },
      },
    }),
    prisma.goal.count({
      where: {
        workspaceId: { in: workspaceIds },
        status: "COMPLETED",
        updatedAt: { gte: weekStart },
      },
    }),
    prisma.milestone.count({ where: { goal: { workspaceId: { in: workspaceIds } } } }),
    prisma.milestone.count({ where: { goal: { workspaceId: { in: workspaceIds } }, status: "COMPLETED" } }),
    prisma.milestone.count({ where: { goal: { workspaceId: { in: workspaceIds } }, status: "IN_PROGRESS" } }),
    prisma.milestone.count({ where: { goal: { workspaceId: { in: workspaceIds } }, status: "NOT_STARTED" } }),
    prisma.milestone.count({ where: { goal: { workspaceId: { in: workspaceIds } }, status: "BLOCKED" } }),
    prisma.actionItem.count({ where: { workspaceId: { in: workspaceIds } } }),
    prisma.actionItem.count({ where: { workspaceId: { in: workspaceIds }, status: "DONE" } }),
    prisma.actionItem.count({ where: { workspaceId: { in: workspaceIds }, status: "IN_PROGRESS" } }),
    prisma.actionItem.count({ where: { workspaceId: { in: workspaceIds }, status: "TODO" } }),
    prisma.actionItem.count({ where: { workspaceId: { in: workspaceIds }, status: "BLOCKED" } }),
    prisma.actionItem.count({
      where: {
        workspaceId: { in: workspaceIds },
        dueDate: { lt: now },
        status: { not: "DONE" },
      },
    }),
    prisma.announcement.count({ where: { workspaceId: { in: workspaceIds } } }),
    prisma.workspaceMember.count({ where: { workspaceId: { in: workspaceIds } } }),
    prisma.auditLog.findMany({
      where: { workspaceId: { in: workspaceIds } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const actionItemsByDay = await prisma.actionItem.findMany({
    where: { workspaceId: { in: workspaceIds } },
    select: { status: true, updatedAt: true, createdAt: true },
  });

  const goalCompletionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  const milestoneCompletionRate =
    totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
  const actionItemCompletionRate =
    totalActionItems > 0 ? Math.round((completedActionItems / totalActionItems) * 100) : 0;

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const trendByDay = new Map(dayLabels.map((label) => [label, { total: 0, done: 0 }]));

  actionItemsByDay.forEach((item) => {
    const date = new Date(item.updatedAt || item.createdAt);
    const dayIndex = (date.getDay() + 6) % 7;
    const dayLabel = dayLabels[dayIndex];

    const row = trendByDay.get(dayLabel);
    row.total += 1;
    if (item.status === "DONE") {
      row.done += 1;
    }
  });

  const progressTrend = dayLabels.map((name) => {
    const row = trendByDay.get(name);
    const progress = row.total > 0 ? Math.round((row.done / row.total) * 100) : 0;
    return { name, progress };
  });

  return {
    stats: {
      totalGoals,
      completedGoals,
      completedThisWeek,
      overdueGoals,
      totalMilestones,
      completedMilestones,
      blockedMilestones,
      totalActionItems,
      completedActionItems,
      overdueActionItems,
      announcements,
      members,
      goalCompletionRate,
      milestoneCompletionRate,
      actionItemCompletionRate,
    },
    goalStatus: [
      { name: "Completed", value: completedGoals },
      { name: "In Progress", value: inProgressGoals },
      { name: "Not Started", value: notStartedGoals },
      { name: "On Hold", value: onHoldGoals },
    ],
    actionItemStatus: [
      { name: "Done", value: completedActionItems },
      { name: "In Progress", value: inProgressActionItems },
      { name: "To Do", value: todoActionItems },
      { name: "Blocked", value: blockedActionItems },
    ],
    milestoneStatus: [
      { name: "Completed", value: completedMilestones },
      { name: "In Progress", value: inProgressMilestones },
      { name: "Not Started", value: notStartedMilestones },
      { name: "Blocked", value: blockedMilestones },
    ],
    progressTrend,
    recentActivity,
  };
};

