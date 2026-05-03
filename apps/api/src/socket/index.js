const { Server } = require("socket.io");

let io;

const workspacePresence = new Map();
const socketPresence = new Map();

function getWorkspaceUsers(workspaceId) {
  const userSockets = workspacePresence.get(workspaceId);
  if (!userSockets) return [];

  return Array.from(userSockets.keys()).map((userId) => {
    for (const meta of socketPresence.values()) {
      if (meta.workspaceId === workspaceId && meta.user?.id === userId) {
        return {
          id: meta.user.id,
          name: meta.user.name,
          email: meta.user.email,
          avatarUrl: meta.user.avatarUrl,
        };
      }
    }

    return { id: userId };
  });
}

function emitPresence(workspaceId) {
  if (!io || !workspaceId) return;
  const users = getWorkspaceUsers(workspaceId);

  io.to(`workspace:${workspaceId}`).emit("presence:updated", {
    workspaceId,
    count: users.length,
    users,
  });
}

function addUserToWorkspace(socketId, workspaceId, user) {
  if (!workspacePresence.has(workspaceId)) {
    workspacePresence.set(workspaceId, new Map());
  }

  const workspaceUsers = workspacePresence.get(workspaceId);
  const existingUserSockets = workspaceUsers.get(user.id);

  if (existingUserSockets) {
    existingUserSockets.add(socketId);
  } else {
    workspaceUsers.set(user.id, new Set([socketId]));
  }

  socketPresence.set(socketId, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
    workspaceId,
  });
}

function removeSocketFromWorkspace(socketId, workspaceId, fallbackUser) {
  if (!workspaceId) {
    socketPresence.delete(socketId);
    return;
  }

  const workspaceUsers = workspacePresence.get(workspaceId);
  if (!workspaceUsers) {
    socketPresence.delete(socketId);
    return;
  }

  const meta = socketPresence.get(socketId);
  const userId = meta?.user?.id || fallbackUser?.id;
  if (!userId) {
    socketPresence.delete(socketId);
    return;
  }

  const userSocketSet = workspaceUsers.get(userId);
  if (userSocketSet) {
    userSocketSet.delete(socketId);
    if (userSocketSet.size === 0) {
      workspaceUsers.delete(userId);
    }
  }

  if (workspaceUsers.size === 0) {
    workspacePresence.delete(workspaceId);
  }

  socketPresence.delete(socketId);
  emitPresence(workspaceId);
}

function joinWorkspace(socket, payload) {
  const workspaceId = payload?.workspaceId;
  const user = payload?.user;
  if (!workspaceId || !user?.id) return;

  const existing = socketPresence.get(socket.id);
  if (existing?.workspaceId && existing.workspaceId !== workspaceId) {
    socket.leave(`workspace:${existing.workspaceId}`);
    removeSocketFromWorkspace(socket.id, existing.workspaceId, existing.user);
  }

  socket.join(`workspace:${workspaceId}`);
  socket.join(`user:${user.id}`);
  addUserToWorkspace(socket.id, workspaceId, user);
  emitPresence(workspaceId);
}

function leaveWorkspace(socket, payload) {
  const workspaceId = payload?.workspaceId;
  if (!workspaceId) return;

  socket.leave(`workspace:${workspaceId}`);
  removeSocketFromWorkspace(socket.id, workspaceId);
}

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    if (process.env.NODE_ENV !== "production") {
      console.log("socket connected", socket.id);
    }

    socket.on("user:join", ({ user }) => {
      if (!user?.id) return;
      socket.join(`user:${user.id}`);
    });

    socket.on("workspace:join", (payload) => {
      joinWorkspace(socket, payload);

      if (process.env.NODE_ENV !== "production") {
        const workspaceId = payload?.workspaceId;
        const userId = payload?.user?.id;
        if (workspaceId && userId) {
          console.log("workspace:join", { socketId: socket.id, workspaceId, userId });
        }
      }
    });

    socket.on("workspace:leave", (payload) => {
      leaveWorkspace(socket, payload);
    });

    socket.on("disconnect", () => {
      const meta = socketPresence.get(socket.id);
      if (meta?.workspaceId) {
        removeSocketFromWorkspace(socket.id, meta.workspaceId, meta.user);
      } else {
        socketPresence.delete(socket.id);
      }
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }

  return io;
}

module.exports = {
  initSocket,
  getIO,
  getWorkspaceUsers,
};
