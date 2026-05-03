const service = require("./auditLog.service");

exports.getAuditLogs = async (req, res, next) => {
  try {
    const data = await service.getAuditLogs(req.user.id, req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.createAuditLog = async (req, res, next) => {
  try {
    const data = await service.createAuditLog(req.user.id, req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

exports.exportAuditLogsCsv = async (req, res, next) => {
  try {
    const csv = await service.exportAuditLogsCsv(req.user.id, req.query);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=audit-logs.csv");
    res.send(csv);
  } catch (error) {
    next(error);
  }
};