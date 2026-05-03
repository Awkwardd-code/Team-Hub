const service = require("./settings.service");

exports.getPreferences = async (req, res, next) => {
  try {
    const preferences = await service.getPreferences(req.user.id);
    res.json(preferences);
  } catch (error) {
    next(error);
  }
};

exports.updatePreferences = async (req, res, next) => {
  try {
    const preferences = await service.updatePreferences(req.user.id, req.body);
    res.json(preferences);
  } catch (error) {
    next(error);
  }
};
