const prisma = require("../../prisma/client");
const { getIO } = require("../../socket");

exports.createNotification = async ({
  userId,
  actorUserId = null,
  workspaceId,
  type = "mention",
  title,
  message,
  link = null,
  metadata = null,
}) => {
  if (!userId) return null;
  if (actorUserId && actorUserId === userId) return null;

  const notification = await prisma.notification.create({
    data: {
      userId,
      workspaceId: workspaceId || null,
      title,
      message,
      type,
      link: link || null,
      metadata: metadata || {},
    },
  });

  const payload = {
    id: notification.id,
    userId: notification.userId,
    workspaceId: notification.workspaceId,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    link: notification.link,
    metadata: notification.metadata,
    read: notification.read,
    createdAt: notification.createdAt,
  };

  try {
    const io = getIO();
    io.to(`user:${userId}`).emit("notification:new", payload);
  } catch (error) {
    console.error("Socket emit failed:", error.message);
  }

  return payload;
};

exports.getNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

exports.markAsRead = async (userId, notificationId) => {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });
  if (!notification) {
    const error = new Error("Notification not found");
    error.status = 404;
    throw error;
  }
  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
};

exports.markAllRead = async (userId) => {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
};

exports.deleteNotification = async (userId, notificationId) => {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });
  if (!notification) {
    const error = new Error("Notification not found");
    error.status = 404;
    throw error;
  }
  return prisma.notification.delete({
    where: { id: notificationId },
  });
};
