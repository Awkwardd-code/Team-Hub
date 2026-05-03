const service = require("./adminMember.service");

exports.getAdminOverview = async (req, res, next) => {
  try {
    const data = await service.getAdminOverview(req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getMembers = async (req, res, next) => {
  try {
    const data = await service.getMembers(req.user.id, req.params.workspaceId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.inviteMember = async (req, res, next) => {
  try {
    const data = await service.inviteMember(
      req.user.id,
      req.params.workspaceId,
      req.body
    );
    res.status(201).json(data);
  } catch (error) {
    console.error("INVITE ERROR:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

exports.updateMemberRole = async (req, res, next) => {
  try {
    const data = await service.updateMemberRole(
      req.user.id,
      req.params.workspaceId,
      req.params.memberId,
      req.body.role
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    await service.removeMember(
      req.user.id,
      req.params.workspaceId,
      req.params.memberId
    );
    res.json({ message: "Member removed" });
  } catch (error) {
    next(error);
  }
};
