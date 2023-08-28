import { defineStore } from 'pinia';
import type { Opinion } from '@/services/opinions';

export const useSearchOpinionHandler = defineStore('search-opinion', {
  state: () => {
    return {
      isDisplayingSearchedOpinions: false,
      opinions: [] as Opinion[]
    };
  },
  actions: {
    showSearchedOpinions() {
      this.isDisplayingSearchedOpinions = true;
    },
    hideSearchedOpinions() {
      this.isDisplayingSearchedOpinions = false;
    },
    replaceOpinions(opinions: Opinion[]) {
      this.opinions = opinions;
    }
  }
});
