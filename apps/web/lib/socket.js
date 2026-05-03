"use client";

import { io } from "socket.io-client";

let socket;
let devListenersAttached = false;

export function getSocket() {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
      transports: ["websocket", "polling"],
    });
  }

  if (process.env.NODE_ENV !== "production" && !devListenersAttached) {
    devListenersAttached = true;
    socket.on("connect", () => {
      console.log("[socket] connected", socket.id);
    });
    socket.on("connect_error", (error) => {
      console.error("[socket] connect_error", error?.message || error);
    });
    socket.on("disconnect", (reason) => {
      console.log("[socket] disconnected", reason);
    });
  }

  return socket;
}
