/**
 * Utility function to play a sound effect
 * @param soundPath - Path to the audio file (relative to /public)
 * @param volume - Volume level (0.0 to 1.0)
 */
export function playSoundEffect(soundPath: string = "/audio/notification2.mp3", volume: number = 0.5): void {
  try {
    const audio = new Audio(soundPath);
    audio.volume = volume;
    audio.play().catch((error) => {
      // Silently fail if audio can't play (e.g., user hasn't interacted with page yet)
      console.debug("Could not play sound effect:", error);
    });
  } catch (error) {
    console.debug("Error creating audio:", error);
  }
}
