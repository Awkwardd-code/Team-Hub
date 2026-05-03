const service = require("./workspaceSetting.service");

exports.getSettings = async (req, res, next) => {
  try {
    const data = await service.getSettings(req.user.id, req.params.workspaceId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const data = await service.updateSettings(
      req.user.id,
      req.params.workspaceId,
      req.body
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
};