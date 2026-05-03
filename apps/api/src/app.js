const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const { initializePassport } = require("./modules/auth/auth.middleware");
const workspaceRoutes = require("./modules/workspaces/workspace.routes");
const goalRoutes = require("./modules/goals/goal.routes");
const announcementRoutes = require("./modules/announcements/announcement.routes");
const milestoneRoutes = require("./modules/milestones/milestone.routes");
const analyticsRoutes = require("./modules/analytics/analytics.routes");
const actionItemRoutes = require("./modules/action-items/actionItem.routes");
const workspaceSettingRoutes = require("./modules/workspace-settings/workspaceSetting.routes");
const adminMemberRoutes = require("./modules/admin-members/adminMember.routes");
const auditLogRoutes = require("./modules/audit-log/auditLog.routes");
const notificationRoutes = require("./modules/notifications/notification.routes");
const settingsRoutes = require("./modules/settings/settings.routes");
const invitationRoutes = require("./modules/workspace-invitations/invitation.routes");

const app = express();
const configuredOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/+$/, "");
      if (configuredOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
initializePassport(app);

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/action-items", actionItemRoutes);
app.use("/api/workspace-settings", workspaceSettingRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/admin/members", adminMemberRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/invitations", invitationRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const status = Number(error?.status) || 500;
  const message = status >= 500 ? "Internal server error" : error?.message || "Request failed";
  return res.status(status).json({ message });
});

module.exports = app;
