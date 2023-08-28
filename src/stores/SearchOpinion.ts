import { defineStore } from 'pinia';

export const useSearchOpinionHandler = defineStore('search-opinion', {
  state: () => {
    return {
      isDisplayingSearchedOpinions: false
    };
  },
  actions: {
    showSearchedOpinions() {
      this.isDisplayingSearchedOpinions = true;
    },
    hideSearchedOpinions() {
      this.isDisplayingSearchedOpinions = false;
    }
  }
});
