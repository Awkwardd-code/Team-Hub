const service = require("./analytics.service");

exports.getOverview = async (req, res, next) => {
  try {
    const data = await service.getOverview(req.user.id, req.query.workspaceId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};