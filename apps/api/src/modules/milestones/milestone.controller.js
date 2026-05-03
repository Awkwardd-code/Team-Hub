const service = require("./milestone.service");

exports.getMilestones = async (req, res, next) => {
  try {
    const data = await service.getMilestones(req.user.id, req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.createMilestone = async (req, res, next) => {
  try {
    const data = await service.createMilestone(req.user.id, req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

exports.updateMilestone = async (req, res, next) => {
  try {
    const data = await service.updateMilestone(req.user.id, req.params.id, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.deleteMilestone = async (req, res, next) => {
  try {
    await service.deleteMilestone(req.user.id, req.params.id);
    res.json({ message: "Milestone deleted" });
  } catch (error) {
    next(error);
  }
};