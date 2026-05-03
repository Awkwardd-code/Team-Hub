const service = require("./workspace.service");

exports.getWorkspaces = async (req, res, next) => {
  try {
    const data = await service.getWorkspaces(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.createWorkspace = async (req, res, next) => {
  try {
    const data = await service.createWorkspace(req.user.id, req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

exports.getWorkspace = async (req, res, next) => {
  try {
    const data = await service.getWorkspace(req.params.id, req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.updateWorkspace = async (req, res, next) => {
  try {
    const data = await service.updateWorkspace(req.params.id, req.user.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.deleteWorkspace = async (req, res, next) => {
  try {
    await service.deleteWorkspace(req.params.id, req.user.id);
    res.json({ message: "Workspace deleted" });
  } catch (err) {
    next(err);
  }
};

exports.getMembers = async (req, res, next) => {
  try {
    const data = await service.getMembers(req.params.id, req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.inviteMember = async (req, res, next) => {
  try {
    const data = await service.inviteMember(req.params.id, req.user.id, req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error("INVITE ERROR:", err);
    return res.status(500).json({
      message: err.message || "Internal server error",
    });
  }
};

exports.getWorkspaceOverview = async (req, res, next) => {
  try {
    const data = await service.getWorkspaceOverview(req.params.id, req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.updateMemberRole = async (req, res, next) => {
  try {
    const data = await service.updateMemberRole(
      req.params.id,
      req.params.memberId,
      req.user.id,
      req.body.role
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    await service.removeMember(req.params.id, req.params.memberId, req.user.id);
    res.json({ message: "Member removed" });
  } catch (err) {
    next(err);
  }
};
