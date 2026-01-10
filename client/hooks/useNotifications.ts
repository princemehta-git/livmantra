import { useEffect, useRef, useState } from "react";
import { useNotificationSound } from "./useNotificationSound";

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  onClick?: () => void;
  playSound?: boolean;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const { playSound } = useNotificationSound();
  const notificationRef = useRef<Notification | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);

      // Request permission if not already granted or denied
      if (Notification.permission === "default") {
        Notification.requestPermission().then((perm) => {
          setPermission(perm);
        });
      }
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    const perm = await Notification.requestPermission();
    setPermission(perm);
    return perm === "granted";
  };

  const showNotification = async (options: NotificationOptions) => {
    const { title, body, icon, onClick, playSound: shouldPlaySound = true } = options;

    // Play sound if requested
    if (shouldPlaySound) {
      playSound();
    }

    // Show browser notification if permission is granted
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        // Close previous notification if exists
        if (notificationRef.current) {
          notificationRef.current.close();
        }

        const notification = new Notification(title, {
          body,
          icon: icon || "/logo.png",
          badge: "/logo.png",
          tag: "livmantra-message",
        });

        notificationRef.current = notification;

        if (onClick) {
          notification.onclick = () => {
            onClick();
            notification.close();
          };
        }

        // Auto-close after 5 seconds
        setTimeout(() => {
          notification.close();
        }, 5000);
      } else if (Notification.permission === "default") {
        // Request permission and show notification
        const granted = await requestPermission();
        if (granted) {
          showNotification(options);
        }
      }
    }
  };

  return {
    permission,
    requestPermission,
    showNotification,
    canNotify: permission === "granted",
  };
}

