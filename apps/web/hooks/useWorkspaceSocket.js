"use client";

import { useEffect } from "react";
import { useRef } from "react";
import { getSocket } from "../lib/socket";
import { useAuthStore } from "../store/authStore";

export function useWorkspaceSocket(workspaceId, handlers = {}) {
  const user = useAuthStore((state) => state.user);
  const joinedWorkspaceRef = useRef(null);

  useEffect(() => {
    if (!user?.id) return;
    const socket = getSocket();
    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    };

    const emitUserJoin = () => {
      socket.emit("user:join", { user: userPayload });
    };
    if (!socket.connected) socket.connect();
    if (socket.connected) emitUserJoin();
    socket.on("connect", emitUserJoin);

    return () => {
      socket.off("connect", emitUserJoin);
    };
  }, [workspaceId, user?.id, user?.name, user?.email, user?.avatarUrl]);

  useEffect(() => {
    if (!workspaceId || !user?.id) return;
    const socket = getSocket();
    const payload = {
      workspaceId,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    };

    const joinWorkspace = () => {
      if (joinedWorkspaceRef.current === workspaceId) return;
      if (joinedWorkspaceRef.current) {
        socket.emit("workspace:leave", { workspaceId: joinedWorkspaceRef.current });
      }
      socket.emit("workspace:join", payload);
      joinedWorkspaceRef.current = workspaceId;
    };

    if (!socket.connected) socket.connect();
    if (socket.connected) joinWorkspace();
    socket.on("connect", joinWorkspace);

    return () => {
      socket.off("connect", joinWorkspace);
      if (joinedWorkspaceRef.current === workspaceId) {
        socket.emit("workspace:leave", { workspaceId });
        joinedWorkspaceRef.current = null;
      }
    };
  }, [workspaceId, user?.id, user?.name, user?.email, user?.avatarUrl]);

  useEffect(() => {
    if (!user?.id) return;
    const socket = getSocket();
    const entries = Object.entries(handlers).filter(([, handler]) => typeof handler === "function");

    entries.forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      entries.forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [handlers, user?.id]);
}
