import { create } from "zustand";
import { getSavedDesigns } from "../services/savedDesigns";

export const useSavedStore = create((set, get) => ({
  savedDesigns: [],
  hasFetched: false,
  loading: false,

  fetchSavedDesigns: async () => {
    set({ loading: true });
    try {
      const data = await getSavedDesigns();
      set({ savedDesigns: data, hasFetched: true });
    } catch (err) {
      console.error("Error in savedStore.js: ", err);
    } finally {
      set({ loading: false });
    }
  },

  // Optimistically remove a design from the local state
  removeDesign: (designId) => {
    const currentDesigns = get().savedDesigns;
    const updatedDesigns = currentDesigns.filter(design => design.id !== designId);
    set({ savedDesigns: updatedDesigns });
  },
}));
