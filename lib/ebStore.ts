import { create } from "zustand";

/* Shared interaction state for the EB experience — the Podium pattern:
   scroll progress, pointer position, and scene phase live here so the
   scroll driver (GSAP/Lenis) and the canvas renderer share one rhythm
   without prop-drilling or re-rendering React on every frame. */

type EbState = {
  /** hero scene scrub progress 0..1 */
  progress: number;
  /** normalized pointer (0..1) within the hero stage + whether it's active */
  px: number;
  py: number;
  pointer: boolean;
  setProgress: (v: number) => void;
  setPointer: (px: number, py: number, active: boolean) => void;
};

export const useEbStore = create<EbState>((set) => ({
  progress: 0,
  px: 0.5,
  py: 0.5,
  pointer: false,
  setProgress: (progress) => set({ progress }),
  setPointer: (px, py, pointer) => set({ px, py, pointer }),
}));
