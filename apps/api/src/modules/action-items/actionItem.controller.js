const service = require("./actionItem.service");

exports.getActionItems = async (req, res, next) => {
  try {
    const data = await service.getActionItems(req.user.id, req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.createActionItem = async (req, res, next) => {
  try {
    const data = await service.createActionItem(req.user.id, req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

exports.getActionItem = async (req, res, next) => {
  try {
    const data = await service.getActionItem(req.user.id, req.params.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.updateActionItem = async (req, res, next) => {
  try {
    const data = await service.updateActionItem(req.user.id, req.params.id, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.deleteActionItem = async (req, res, next) => {
  try {
    await service.deleteActionItem(req.user.id, req.params.id);
    res.json({ message: "Action item deleted" });
  } catch (error) {
    next(error);
  }
};