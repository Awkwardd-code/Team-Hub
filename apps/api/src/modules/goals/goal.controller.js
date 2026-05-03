const service = require("./goal.service");

exports.getGoals = async (req, res, next) => {
  try {
    const goals = await service.getGoals(req.user.id, req.query.workspaceId);
    res.json(goals);
  } catch (error) {
    next(error);
  }
};

exports.createGoal = async (req, res, next) => {
  try {
    const goal = await service.createGoal(req.user.id, req.body);
    res.status(201).json(goal);
  } catch (error) {
    next(error);
  }
};

exports.getGoal = async (req, res, next) => {
  try {
    const goal = await service.getGoal(req.user.id, req.params.id);
    res.json(goal);
  } catch (error) {
    next(error);
  }
};

exports.updateGoal = async (req, res, next) => {
  try {
    const goal = await service.updateGoal(req.user.id, req.params.id, req.body);
    res.json(goal);
  } catch (error) {
    next(error);
  }
};

exports.deleteGoal = async (req, res, next) => {
  try {
    await service.deleteGoal(req.user.id, req.params.id);
    res.json({ message: "Goal deleted" });
  } catch (error) {
    next(error);
  }
};

exports.createMilestone = async (req, res, next) => {
  try {
    const milestone = await service.createMilestone(req.user.id, req.params.id, req.body);
    res.status(201).json(milestone);
  } catch (error) {
    next(error);
  }
};

exports.updateMilestone = async (req, res, next) => {
  try {
    const milestone = await service.updateMilestone(
      req.user.id,
      req.params.id,
      req.params.milestoneId,
      req.body
    );
    res.json(milestone);
  } catch (error) {
    next(error);
  }
};

exports.deleteMilestone = async (req, res, next) => {
  try {
    await service.deleteMilestone(req.user.id, req.params.id, req.params.milestoneId);
    res.json({ message: "Milestone deleted" });
  } catch (error) {
    next(error);
  }
};

exports.createGoalUpdate = async (req, res, next) => {
  try {
    const update = await service.createGoalUpdate(req.user.id, req.params.id, req.body);
    res.status(201).json(update);
  } catch (error) {
    next(error);
  }
};