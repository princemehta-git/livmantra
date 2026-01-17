import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography } from "@mui/material";

type Props = {
  onComplete: () => void;
  testType?: "BBA" | "PERSONALITY";
};

// Audio file path - place your audio file at public/audio/techy-sound.mp3
const AUDIO_FILE_PATH = "/audio/techy-sound.mp3";

// Shared audio unlock state
let globalAudioUnlocked = false;

// Function to play the techy sound using HTML5 Audio
// Returns the audio instance so it can be stopped if needed
const playTechySound = async (isFinal: boolean = false, forceUnlock: boolean = false): Promise<HTMLAudioElement | null> => {
  return new Promise((resolve) => {
    try {
      // Create a new Audio instance for each play to ensure it plays reliably
      const audio = new Audio(AUDIO_FILE_PATH);
      audio.volume = isFinal ? 0.8 : 0.7; // Increased volume
      
      // Wait for audio to be ready
      const playAudio = () => {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("✅ Sound playing successfully");
              // Mark as unlocked if we successfully played
              globalAudioUnlocked = true;
              resolve(audio); // Return audio instance
            })
            .catch((error) => {
              console.warn("❌ Audio play failed:", error);
              
              // If force unlock is true (from click), try one more time
              if (forceUnlock) {
                setTimeout(() => {
                  audio.play()
                    .then(() => {
                      console.log("✅ Sound unlocked and playing after retry");
                      globalAudioUnlocked = true;
                      resolve(audio); // Return audio instance
                    })
                    .catch(() => resolve(null));
                }, 50);
                return;
              }
              
              // Try to unlock by playing on next user interaction
              const unlockAudio = () => {
                audio.play()
                  .then(() => {
                    console.log("✅ Sound unlocked and playing");
                    globalAudioUnlocked = true;
                    resolve(audio); // Return audio instance
                  })
                  .catch((err) => {
                    console.warn("❌ Still failed after unlock:", err);
                    resolve(null);
                  });
                document.removeEventListener("click", unlockAudio);
                document.removeEventListener("touchstart", unlockAudio);
              };
              document.addEventListener("click", unlockAudio, { once: true });
              document.addEventListener("touchstart", unlockAudio, { once: true });
            });
        } else {
          resolve(audio); // Return audio instance even if play() is undefined
        }
      };

      // Wait for audio to load before playing
      if (audio.readyState >= 2) {
        // Already loaded
        playAudio();
      } else {
        // Wait for canplay event
        audio.addEventListener("canplay", playAudio, { once: true });
        audio.addEventListener("error", (e) => {
          console.error("❌ Audio file error:", e);
          console.error("Check if file exists at:", AUDIO_FILE_PATH);
          resolve(null);
        }, { once: true });
        
        // Force load
        audio.load();
        
        // Fallback: try to play after a short delay even if canplay didn't fire
        setTimeout(() => {
          if (audio.readyState >= 2) {
            playAudio();
          }
        }, 100);
      }
      
      // Don't remove audio immediately - let it play fully
      // Only clean up after it ends naturally
      audio.addEventListener("ended", () => {
        // Keep audio element for a bit in case we need it again
        setTimeout(() => {
          audio.remove();
        }, 100);
      }, { once: true });
    } catch (error) {
      console.error("❌ Error creating audio:", error);
      resolve(null);
    }
  });
};

export default function HackingSequenceLoader({ onComplete, testType = "BBA" }: Props) {
  const [stage, setStage] = useState(0);
  const audioUnlocked = useRef(false);
  const audioPreloaded = useRef(false);
  const activeAudioInstances = useRef<HTMLAudioElement[]>([]); // Track all playing audio
  
  const messages = testType === "PERSONALITY" 
    ? [
        "> INITIALIZING PERSONALITY SCAN...",
        "> ACCESSING PSYCHOLOGICAL DATABASE...",
        "> ANALYZING DIMENSION PATTERNS...",
        "> DECRYPTING PERSONALITY CODE...",
        "> CALCULATING DIMENSION SIGNATURES...",
        "> DETECTING PERSONALITY TRAITS...",
        "> COMPILING PERSONALITY REPORT...",
        "> ACCESS GRANTED ✓",
      ]
    : [
        "> INITIALIZING SCAN...",
        "> ACCESSING BIOSYSTEM DATABASE...",
        "> ANALYZING BODYCODES...",
        "> DECRYPTING BODY CODE...",
        "> CALCULATING BODY TYPE SIGNATURE...",
        "> DETECTING BODY TYPE ANOMALIES...",
        "> COMPILING BODY TYPE REPORT...",
        "> ACCESS GRANTED ✓",
      ];

  // Preload audio on mount
  useEffect(() => {
    const preloadAudio = () => {
      if (!audioPreloaded.current) {
        const preload = new Audio(AUDIO_FILE_PATH);
        preload.preload = "auto";
        preload.volume = 0.01;
        
        preload.addEventListener("error", (e) => {
          console.error("❌ Audio file not found or cannot load:", AUDIO_FILE_PATH);
          console.error("Make sure the file exists at: client/public/audio/techy-sound.mp3");
        }, { once: true });
        
        preload.addEventListener("canplay", () => {
          console.log("✅ Audio file loaded successfully");
        }, { once: true });
        
        preload.load();
        audioPreloaded.current = true;
      }
    };

    preloadAudio();

    // Check if audio was already unlocked (from page load)
    if (globalAudioUnlocked) {
      audioUnlocked.current = true;
      console.log("✅ Audio already unlocked from page load");
    }

    // Also unlock on any user interaction as fallback
    const events = ['click', 'touchstart', 'keydown', 'mousedown'];
    const handlers = events.map(event => {
      const handler = async () => {
        if (!audioUnlocked.current && !globalAudioUnlocked) {
          try {
            const testAudio = new Audio(AUDIO_FILE_PATH);
            testAudio.volume = 0.01;
            await testAudio.play();
            console.log("✅ Audio unlocked via user interaction");
            audioUnlocked.current = true;
            globalAudioUnlocked = true;
            testAudio.pause();
            testAudio.currentTime = 0;
          } catch (error) {
            console.warn("⚠️ Audio unlock failed:", error);
          }
        }
        // Remove all listeners after first interaction
        events.forEach(e => document.removeEventListener(e, handler as any));
      };
      document.addEventListener(event, handler, { once: true });
      return handler;
    });

    return () => {
      events.forEach((event, i) => {
        document.removeEventListener(event, handlers[i] as any);
      });
    };
  }, []);

  // Stop all playing sounds
  const stopAllSounds = useCallback(() => {
    activeAudioInstances.current.forEach((audio) => {
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
      audio.remove();
    });
    activeAudioInstances.current = [];
    console.log("🔇 All sounds stopped");
  }, []);

  useEffect(() => {
    if (stage < messages.length) {
      // Play sound when a new message appears - ALWAYS play, even if previous failed
      const isFinal = stage === messages.length - 1;
      
      // Small delay to ensure audio context is ready
      const playDelay = stage === 0 ? 100 : 0;
      
      setTimeout(() => {
        console.log(`🔊 Attempting to play sound for stage ${stage + 1}/${messages.length} (unlocked: ${audioUnlocked.current || globalAudioUnlocked})`);
        playTechySound(isFinal, false).then((audio) => {
          if (audio) {
            // Track this audio instance
            activeAudioInstances.current.push(audio);
            
            // Remove from tracking when it ends naturally
            audio.addEventListener("ended", () => {
              const index = activeAudioInstances.current.indexOf(audio);
              if (index > -1) {
                activeAudioInstances.current.splice(index, 1);
              }
              audio.remove();
            }, { once: true });
          }
        });
      }, playDelay);
      
      const timer = setTimeout(() => setStage(stage + 1), 800);
      return () => clearTimeout(timer);
    } else {
      // Transition is complete - call onComplete after 500ms
      setTimeout(onComplete, 500);
      
      // Stop all sounds 3 seconds after transition ends
      setTimeout(() => {
        stopAllSounds();
      }, 3000);
    }
  }, [stage, messages.length, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSounds();
    };
  }, [stopAllSounds]);

  // Handle click anywhere to unlock audio and play current sound
  const handleClick = async () => {
    if (!audioUnlocked.current && !globalAudioUnlocked) {
      try {
        const testAudio = new Audio(AUDIO_FILE_PATH);
        testAudio.volume = 0.7; // Play at full volume to unlock
        await testAudio.play();
        console.log("✅ Audio unlocked via click");
        audioUnlocked.current = true;
        globalAudioUnlocked = true;
        testAudio.pause();
        testAudio.currentTime = 0;
        
        // Also play the sound for the current stage with force unlock
        const isFinal = stage === messages.length - 1;
        playTechySound(isFinal, true).then((audio) => {
          if (audio) {
            activeAudioInstances.current.push(audio);
            audio.addEventListener("ended", () => {
              const index = activeAudioInstances.current.indexOf(audio);
              if (index > -1) {
                activeAudioInstances.current.splice(index, 1);
              }
              audio.remove();
            }, { once: true });
          }
        });
      } catch (error) {
        console.warn("⚠️ Click unlock failed:", error);
      }
    } else if (audioUnlocked.current || globalAudioUnlocked) {
      // Audio is already unlocked, just play the current sound
      const isFinal = stage === messages.length - 1;
      playTechySound(isFinal).then((audio) => {
        if (audio) {
          activeAudioInstances.current.push(audio);
          audio.addEventListener("ended", () => {
            const index = activeAudioInstances.current.indexOf(audio);
            if (index > -1) {
              activeAudioInstances.current.splice(index, 1);
            }
            audio.remove();
          }, { once: true });
        }
      });
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: "fixed",
        inset: 0,
        background: "#000",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "monospace",
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          color: "#00ff00",
          fontSize: { xs: "0.9rem", md: "1.2rem" },
          textShadow: "0 0 10px #00ff00",
          maxWidth: "600px",
          px: 3,
        }}
      >
        {messages.slice(0, stage + 1).map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              mb: 1,
              opacity: idx === stage ? 1 : 0.6,
              animation: idx === stage ? "glitch 0.3s" : "none",
            }}
          >
            {msg}
            {idx === stage && (
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: "10px",
                  height: "1em",
                  background: "#00ff00",
                  marginLeft: "4px",
                  animation: "blink 1s infinite",
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
