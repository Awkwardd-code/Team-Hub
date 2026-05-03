const service = require("./announcement.service");

exports.getAnnouncements = async (req, res, next) => {
  try {
    const data = await service.getAnnouncements(req.user.id, req.query.workspaceId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.createAnnouncement = async (req, res, next) => {
  try {
    const data = await service.createAnnouncement(req.user.id, req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

exports.updateAnnouncement = async (req, res, next) => {
  try {
    const data = await service.updateAnnouncement(req.user.id, req.params.id, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.deleteAnnouncement = async (req, res, next) => {
  try {
    await service.deleteAnnouncement(req.user.id, req.params.id);
    res.json({ message: "Announcement deleted" });
  } catch (error) {
    next(error);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const data = await service.createComment(req.user.id, req.params.id, req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

exports.toggleReaction = async (req, res, next) => {
  try {
    const data = await service.toggleReaction(req.user.id, req.params.id, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};