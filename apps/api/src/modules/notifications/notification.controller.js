const service = require("./notification.service");

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await service.getNotifications(req.user.id);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

exports.markRead = async (req, res, next) => {
  try {
    await service.markAsRead(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await service.markAllRead(req.user.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    await service.deleteNotification(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
