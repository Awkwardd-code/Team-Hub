const prisma = require("../../prisma/client");
const {
  emitAnnouncementCreated,
  emitAnnouncementUpdated,
  emitAnnouncementDeleted,
  emitAnnouncementCommentCreated,
  emitAnnouncementReactionUpdated,
} = require("../../socket/events");
const { createNotification } = require("../notifications/notification.service");
const { findMentionedWorkspaceUsers } = require("../../utils/mentions");

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
  };
}

async function requireWorkspaceMember(workspaceId, userId) {
  const member = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
  });

  if (!member) throw httpError("You are not a member of this workspace", 403);
  return member;
}

async function requireWorkspaceAdmin(workspaceId, userId) {
  const member = await requireWorkspaceMember(workspaceId, userId);
  if (member.role !== "ADMIN") {
    throw httpError("Only workspace admins can perform this action", 403);
  }

  return member;
}

function formatAnnouncement(item) {
  return {
    ...item,
    author: publicUser(item.author),
    comments: item.comments?.map((comment) => ({
      ...comment,
      user: publicUser(comment.user),
    })),
    reactions: item.reactions || [],
  };
}

async function getAnnouncementWithAccess(announcementId, userId) {
  const announcement = await prisma.announcement.findUnique({
    where: { id: announcementId },
    include: {
      author: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
      reactions: true,
    },
  });

  if (!announcement) throw httpError("Announcement not found", 404);

  await requireWorkspaceMember(announcement.workspaceId, userId);
  return announcement;
}

async function getFormattedAnnouncementById(announcementId) {
  const announcement = await prisma.announcement.findUnique({
    where: { id: announcementId },
    include: {
      author: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
      reactions: true,
    },
  });

  if (!announcement) return null;
  return formatAnnouncement(announcement);
}

exports.getAnnouncements = async (userId, workspaceId) => {
  if (workspaceId) {
    await requireWorkspaceMember(workspaceId, userId);

    const items = await prisma.announcement.findMany({
      where: { workspaceId },
      include: {
        author: true,
        comments: {
          include: { user: true },
          orderBy: { createdAt: "asc" },
        },
        reactions: true,
      },
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    });

    return items.map(formatAnnouncement);
  }

  const memberships = await prisma.workspaceMember.findMany({
    where: { userId },
    select: { workspaceId: true },
  });

  const workspaceIds = memberships.map((item) => item.workspaceId);

  const items = await prisma.announcement.findMany({
    where: { workspaceId: { in: workspaceIds } },
    include: {
      author: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
      reactions: true,
    },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
  });

  return items.map(formatAnnouncement);
};

exports.createAnnouncement = async (userId, body) => {
  const workspaceId = body.workspaceId;
  const title = body.title?.trim();
  const content = body.content?.trim();

  if (!workspaceId) throw httpError("Workspace is required");
  if (!title) throw httpError("Title is required");
  if (!content) throw httpError("Content is required");

  await requireWorkspaceAdmin(workspaceId, userId);

  const item = await prisma.announcement.create({
    data: {
      workspaceId,
      authorId: userId,
      title,
      content,
      pinned: Boolean(body.pinned),
    },
    include: {
      author: true,
      comments: {
        include: { user: true },
      },
      reactions: true,
    },
  });

  const formatted = formatAnnouncement(item);
  const mentionedUsers = await findMentionedWorkspaceUsers({
    workspaceId,
    text: `${title}\n${content}`,
    excludeUserId: userId,
  });

  for (const mentionedUser of mentionedUsers) {
    await createNotification({
      userId: mentionedUser.id,
      actorUserId: userId,
      workspaceId,
      type: "mention",
      title: "You were mentioned",
      message: `${formatted.author.name} mentioned you in an announcement.`,
      link: "/announcements",
      metadata: { announcementId: item.id },
    });
  }

  emitAnnouncementCreated(workspaceId, formatted);
  return formatted;
};

exports.updateAnnouncement = async (userId, announcementId, body) => {
  const existing = await getAnnouncementWithAccess(announcementId, userId);
  await requireWorkspaceAdmin(existing.workspaceId, userId);

  const item = await prisma.announcement.update({
    where: { id: announcementId },
    data: {
      title: body.title?.trim() || existing.title,
      content: body.content?.trim() || existing.content,
      pinned: typeof body.pinned === "boolean" ? body.pinned : existing.pinned,
    },
    include: {
      author: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
      reactions: true,
    },
  });

  const formatted = formatAnnouncement(item);
  emitAnnouncementUpdated(existing.workspaceId, formatted);
  return formatted;
};

exports.deleteAnnouncement = async (userId, announcementId) => {
  const existing = await getAnnouncementWithAccess(announcementId, userId);
  await requireWorkspaceAdmin(existing.workspaceId, userId);

  await prisma.announcement.delete({ where: { id: announcementId } });
  emitAnnouncementDeleted(existing.workspaceId, announcementId);

  return { id: announcementId };
};

exports.createComment = async (userId, announcementId, body) => {
  const announcement = await getAnnouncementWithAccess(announcementId, userId);

  const content = body.content?.trim();
  if (!content) throw httpError("Comment is required");

  const comment = await prisma.announcementComment.create({
    data: {
      announcementId: announcement.id,
      userId,
      content,
    },
    include: { user: true },
  });

  const formatted = {
    ...comment,
    user: publicUser(comment.user),
  };

  emitAnnouncementCommentCreated(announcement.workspaceId, {
    announcementId,
    comment: formatted,
  });

  const mentionedUsers = await findMentionedWorkspaceUsers({
    workspaceId: announcement.workspaceId,
    text: content,
    excludeUserId: userId,
  });

  for (const mentionedUser of mentionedUsers) {
    await createNotification({
      userId: mentionedUser.id,
      actorUserId: userId,
      workspaceId: announcement.workspaceId,
      type: "mention",
      title: "You were mentioned",
      message: `${formatted.user.name} mentioned you in a comment.`,
      link: "/announcements",
      metadata: { announcementId, commentId: comment.id },
    });
  }

  const mentionedUserIds = new Set(mentionedUsers.map((user) => user.id));
  if (announcement.authorId !== userId && !mentionedUserIds.has(announcement.authorId)) {
    await createNotification({
      userId: announcement.authorId,
      actorUserId: userId,
      workspaceId: announcement.workspaceId,
      type: "announcement_comment",
      title: "New comment on your announcement",
      message: `${formatted.user.name} commented on your announcement.`,
      link: "/announcements",
      metadata: { announcementId, commentId: comment.id },
    });
  }

  return formatted;
};

exports.toggleReaction = async (userId, announcementId, body) => {
  const announcement = await getAnnouncementWithAccess(announcementId, userId);
  const reactor = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  const emoji = body.emoji || "👍";

  const existing = await prisma.announcementReaction.findUnique({
    where: {
      announcementId_userId_emoji: {
        announcementId,
        userId,
        emoji,
      },
    },
  });

  if (existing) {
    await prisma.announcementReaction.delete({ where: { id: existing.id } });
    const fullAnnouncement = await getFormattedAnnouncementById(announcementId);
    const payload = { announcementId, announcement: fullAnnouncement };

    emitAnnouncementReactionUpdated(announcement.workspaceId, payload);
    return payload;
  }

  try {
    await prisma.announcementReaction.create({
      data: {
        announcementId,
        userId,
        emoji,
      },
    });
  } catch (error) {
    if (error?.code !== "P2002") throw error;
  }

  const fullAnnouncement = await getFormattedAnnouncementById(announcementId);
  const payload = {
    announcementId,
    announcement: fullAnnouncement,
  };

  if (announcement.authorId !== userId) {
    await createNotification({
      userId: announcement.authorId,
      actorUserId: userId,
      workspaceId: announcement.workspaceId,
      type: "announcement_reaction",
      title: "New reaction on your announcement",
      message: `${reactor?.name || "Someone"} reacted ${emoji} to your announcement.`,
      link: "/announcements",
      metadata: { announcementId, emoji },
    });
  }

  emitAnnouncementReactionUpdated(announcement.workspaceId, payload);
  return payload;
};

