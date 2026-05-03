"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAuthStore } from "../store/authStore";
import { useNotificationStore } from "../store/notificationStore";
import { useToastStore } from "../store/toastStore";

export function useUserSocket() {
  const user = useAuthStore((state) => state.user);
  const addNotificationFromSocket = useNotificationStore((state) => state.addNotificationFromSocket);
  const showNotificationToast = useToastStore((state) => state.showNotificationToast);

  useEffect(() => {
    if (!user?.id) return;

    const socket = getSocket();
    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    };

    const joinUserRoom = () => {
      socket.emit("user:join", { user: userPayload });
    };

    if (!socket.connected) socket.connect();
    if (socket.connected) joinUserRoom();

    socket.on("connect", joinUserRoom);
    const onNotification = (notification) => {
      addNotificationFromSocket(notification);
      showNotificationToast(notification);
    };

    socket.on("notification:new", onNotification);

    return () => {
      socket.off("connect", joinUserRoom);
      socket.off("notification:new", onNotification);
    };
  }, [user?.id, user?.name, user?.email, user?.avatarUrl, addNotificationFromSocket, showNotificationToast]);
}
