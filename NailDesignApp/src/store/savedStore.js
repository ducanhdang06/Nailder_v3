import { create } from 'zustand';
import { getSavedDesigns } from '../services/savedDesigns';

export const useSavedStore = create((set) => ({
  savedDesigns: [],
  hasFetched: false,
  loading: false,

  fetchSavedDesigns: async () => {
    set({ loading: true });
    try {
      const data = await getSavedDesigns();
      set({ savedDesigns: data, hasFetched: true });
    } catch (err) {
      console.error('❌ Failed to fetch saved designs:', err);
    } finally {
      set({ loading: false });
    }
  },
}));
