const service = require("./invitation.service");

exports.inviteToWorkspace = async (req, res, next) => {
  try {
    const result = await service.inviteToWorkspace({
      actorId: req.user.id,
      workspaceId: req.params.workspaceId,
      email: req.body.email,
      role: req.body.role,
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getMyInvitations = async (req, res, next) => {
  try {
    const invitations = await service.getMyInvitations(req.user.id);
    res.json(invitations);
  } catch (error) {
    next(error);
  }
};

exports.acceptInvitation = async (req, res, next) => {
  try {
    const result = await service.acceptInvitation({
      invitationId: req.params.id,
      userId: req.user.id,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.declineInvitation = async (req, res, next) => {
  try {
    const result = await service.declineInvitation({
      invitationId: req.params.id,
      userId: req.user.id,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};
