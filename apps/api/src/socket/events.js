const { getIO } = require("./index");

function emitToWorkspace(workspaceId, event, payload) {
  if (!workspaceId) return;

  const io = getIO();
  io.to(`workspace:${workspaceId}`).emit(event, payload);
}

function emitGoalCreated(workspaceId, goal) {
  emitToWorkspace(workspaceId, "goal:created", goal);
}

function emitGoalUpdated(workspaceId, goal) {
  emitToWorkspace(workspaceId, "goal:updated", goal);
}

function emitGoalDeleted(workspaceId, goalId) {
  emitToWorkspace(workspaceId, "goal:deleted", { id: goalId });
}

function emitGoalUpdateCreated(workspaceId, payload) {
  emitToWorkspace(workspaceId, "goal:update-created", payload);
}

function emitMilestoneCreated(workspaceId, milestone) {
  emitToWorkspace(workspaceId, "milestone:created", milestone);
}

function emitMilestoneUpdated(workspaceId, milestone) {
  emitToWorkspace(workspaceId, "milestone:updated", milestone);
}

function emitMilestoneDeleted(workspaceId, milestoneId) {
  emitToWorkspace(workspaceId, "milestone:deleted", { id: milestoneId });
}

function emitActionItemCreated(workspaceId, item) {
  emitToWorkspace(workspaceId, "action-item:created", item);
}

function emitActionItemUpdated(workspaceId, item) {
  emitToWorkspace(workspaceId, "action-item:updated", item);
}

function emitActionItemDeleted(workspaceId, itemId) {
  emitToWorkspace(workspaceId, "action-item:deleted", { id: itemId });
}

function emitAnnouncementCreated(workspaceId, announcement) {
  emitToWorkspace(workspaceId, "announcement:created", announcement);
}

function emitAnnouncementUpdated(workspaceId, announcement) {
  emitToWorkspace(workspaceId, "announcement:updated", announcement);
}

function emitAnnouncementDeleted(workspaceId, announcementId) {
  emitToWorkspace(workspaceId, "announcement:deleted", { id: announcementId });
}

function emitAnnouncementCommentCreated(workspaceId, comment) {
  emitToWorkspace(workspaceId, "announcement:comment-created", comment);
}

function emitAnnouncementReactionUpdated(workspaceId, payload) {
  emitToWorkspace(workspaceId, "announcement:reaction-updated", payload);
}

function emitWorkspaceCreated(workspaceId, payload) {
  emitToWorkspace(workspaceId, "workspace:created", payload);
}

function emitWorkspaceUpdated(workspaceId, payload) {
  emitToWorkspace(workspaceId, "workspace:updated", payload);
}

function emitWorkspaceDeleted(workspaceId, payload) {
  emitToWorkspace(workspaceId, "workspace:deleted", payload);
}

function emitWorkspaceMemberAdded(workspaceId, payload) {
  emitToWorkspace(workspaceId, "workspace:member-added", payload);
}

function emitToUser(userId, event, payload) {
  if (!userId) return;
  const io = getIO();
  io.to(`user:${userId}`).emit(event, payload);
}

module.exports = {
  emitToWorkspace,
  emitToUser,
  emitGoalCreated,
  emitGoalUpdated,
  emitGoalDeleted,
  emitGoalUpdateCreated,
  emitMilestoneCreated,
  emitMilestoneUpdated,
  emitMilestoneDeleted,
  emitActionItemCreated,
  emitActionItemUpdated,
  emitActionItemDeleted,
  emitAnnouncementCreated,
  emitAnnouncementUpdated,
  emitAnnouncementDeleted,
  emitAnnouncementCommentCreated,
  emitAnnouncementReactionUpdated,
  emitWorkspaceCreated,
  emitWorkspaceUpdated,
  emitWorkspaceDeleted,
  emitWorkspaceMemberAdded,
};
