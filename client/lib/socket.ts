import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

let socketInstance: Socket | null = null;

export function getSocket(): Socket | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (socketInstance?.connected) {
    return socketInstance;
  }

  // Get token from localStorage
  const userData = localStorage.getItem("livmantra_user");
  const adminData = localStorage.getItem("livmantra_admin");

  let token: string | null = null;

  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      token = parsed.token;
    } catch (e) {
      // Ignore
    }
  }

  if (!token && adminData) {
    try {
      const parsed = JSON.parse(adminData);
      token = parsed.token;
    } catch (e) {
      // Ignore
    }
  }

  if (!token) {
    return null;
  }

  // Create new socket connection
  socketInstance = io(API_BASE.replace("/api", ""), {
    auth: {
      token,
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socketInstance.on("connect", () => {
    console.log("Socket connected");
  });

  socketInstance.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socketInstance.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socketInstance;
}

export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}

// Hook to use socket in React components
export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const sock = getSocket();
    setSocket(sock);

    return () => {
      // Don't disconnect on unmount, keep connection alive
      // disconnectSocket();
    };
  }, []);

  return socket;
}

