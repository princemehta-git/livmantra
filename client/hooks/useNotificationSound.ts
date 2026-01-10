import { useRef } from "react";

// List of notification sound files to try in order
const NOTIFICATION_SOUNDS = [
  "/audio/tune.mp3",
  "/audio/notification.mp3",
  "/audio/notification1.mp3",
  "/audio/notification2.mp3",
  "/audio/notification3.mp3",
  "/audio/alert.mp3",
  "/audio/chime.mp3",
  "/audio/ding.mp3",
];

export function useNotificationSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);
  const workingSoundRef = useRef<string | null>(null);

  const playSound = () => {
    // Prevent multiple simultaneous plays
    if (isPlayingRef.current) {
      return;
    }

    const tryPlaySound = (soundIndex: number): void => {
      if (soundIndex >= NOTIFICATION_SOUNDS.length) {
        console.warn("No notification sound files found. Please add notification sounds to /audio/ folder.");
        isPlayingRef.current = false;
        return;
      }

      const soundPath = NOTIFICATION_SOUNDS[soundIndex];
      
      // If we already know a working sound, use it
      if (workingSoundRef.current && soundIndex === 0) {
        const audio = new Audio(workingSoundRef.current);
        audio.volume = 0.8;
        audio.onended = () => {
          isPlayingRef.current = false;
        };
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.error("Error playing known working sound:", error);
          isPlayingRef.current = false;
        });
        isPlayingRef.current = true;
        return;
      }

      // Try to play the sound
      const audio = new Audio(soundPath);
      audio.volume = 0.8;
      
      audio.onended = () => {
        isPlayingRef.current = false;
      };

      audio.onerror = () => {
        // Try next sound in the list
        tryPlaySound(soundIndex + 1);
      };

      audio.oncanplay = () => {
        // Sound loaded successfully, try to play
        audio.currentTime = 0;
        audio.play()
          .then(() => {
            // Success! Remember this working sound
            if (!workingSoundRef.current) {
              workingSoundRef.current = soundPath;
            }
            isPlayingRef.current = true;
          })
          .catch((error) => {
            // Play failed, try next sound
            console.warn(`Failed to play ${soundPath}, trying next sound...`);
            tryPlaySound(soundIndex + 1);
          });
      };

      // Load the audio file
      audio.load();
    };

    try {
      // Start trying sounds from the beginning (or use known working sound)
      tryPlaySound(0);
    } catch (error) {
      console.error("Error initializing notification sound:", error);
      isPlayingRef.current = false;
    }
  };

  return { playSound };
}

