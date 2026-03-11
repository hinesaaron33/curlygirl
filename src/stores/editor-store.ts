import { create } from "zustand";
import { createBlankSlide } from "@/lib/editor/fabric-utils";

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface Slide {
  id: string;
  // Fabric.js canvas JSON (the object returned by canvas.toJSON())
  data: Record<string, unknown>;
}

interface EditorSnapshot {
  slides: Slide[];
  currentSlideIndex: number;
}

interface EditorState {
  // --- data ---
  slides: Slide[];
  currentSlideIndex: number;
  isDirty: boolean;
  isSaving: boolean;

  // --- undo / redo ---
  history: EditorSnapshot[];
  future: EditorSnapshot[];

  // --- actions ---
  setSlides: (slides: Slide[]) => void;
  setCurrentSlide: (index: number) => void;
  updateCurrentSlideData: (data: Record<string, unknown>) => void;
  addSlide: () => void;
  removeSlide: (index: number) => void;
  undo: () => void;
  redo: () => void;
  markSaved: () => void;
  markDirty: () => void;
  setSaving: (val: boolean) => void;
}

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function generateId(): string {
  return crypto.randomUUID();
}

function snapshot(state: EditorState): EditorSnapshot {
  return {
    slides: structuredClone(state.slides),
    currentSlideIndex: state.currentSlideIndex,
  };
}

// ----------------------------------------------------------------
// Store
// ----------------------------------------------------------------

export const useEditorStore = create<EditorState>((set, get) => ({
  // --- initial state ---
  slides: [{ id: generateId(), data: createBlankSlide() }],
  currentSlideIndex: 0,
  isDirty: false,
  isSaving: false,
  history: [],
  future: [],

  // --- actions ---

  setSlides(slides: Slide[]) {
    set({ slides, currentSlideIndex: 0, isDirty: false, history: [], future: [] });
  },

  setCurrentSlide(index: number) {
    const { slides } = get();
    if (index < 0 || index >= slides.length) return;
    set({ currentSlideIndex: index });
  },

  updateCurrentSlideData(data: Record<string, unknown>) {
    const state = get();
    const prev = snapshot(state);

    const updatedSlides = state.slides.map((slide, i) =>
      i === state.currentSlideIndex ? { ...slide, data } : slide,
    );

    set({
      slides: updatedSlides,
      isDirty: true,
      history: [...state.history, prev],
      future: [],
    });
  },

  addSlide() {
    const state = get();
    const prev = snapshot(state);
    const newSlide: Slide = { id: generateId(), data: createBlankSlide() };

    set({
      slides: [...state.slides, newSlide],
      currentSlideIndex: state.slides.length,
      isDirty: true,
      history: [...state.history, prev],
      future: [],
    });
  },

  removeSlide(index: number) {
    const state = get();
    if (state.slides.length <= 1) return; // always keep at least one slide
    if (index < 0 || index >= state.slides.length) return;

    const prev = snapshot(state);
    const updatedSlides = state.slides.filter((_, i) => i !== index);
    const newIndex = Math.min(state.currentSlideIndex, updatedSlides.length - 1);

    set({
      slides: updatedSlides,
      currentSlideIndex: newIndex,
      isDirty: true,
      history: [...state.history, prev],
      future: [],
    });
  },

  undo() {
    const state = get();
    if (state.history.length === 0) return;

    const current = snapshot(state);
    const previous = state.history[state.history.length - 1];

    set({
      slides: previous.slides,
      currentSlideIndex: previous.currentSlideIndex,
      isDirty: true,
      history: state.history.slice(0, -1),
      future: [current, ...state.future],
    });
  },

  redo() {
    const state = get();
    if (state.future.length === 0) return;

    const current = snapshot(state);
    const next = state.future[0];

    set({
      slides: next.slides,
      currentSlideIndex: next.currentSlideIndex,
      isDirty: true,
      history: [...state.history, current],
      future: state.future.slice(1),
    });
  },

  markSaved() {
    set({ isDirty: false });
  },

  markDirty() {
    set({ isDirty: true });
  },

  setSaving(val: boolean) {
    set({ isSaving: val });
  },
}));
