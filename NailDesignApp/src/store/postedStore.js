import { create } from "zustand";
import { getPostedDesigns } from "../services/postedDesigns";

export const usePostedStore = create((set) => ({
  postedDesigns: [],
  hasFetched: false,
  loading: false,

  fetchPostedDesigns: async () => {
    set({ loading: true });
    try {
      const data = await getPostedDesigns();
      set({ postedDesigns: data, hasFetched: true });
    } catch (err) {
      console.error("Error in postedStore.js: ", err);
    } finally {
      set({ loading: false });
    }
  },
}));
