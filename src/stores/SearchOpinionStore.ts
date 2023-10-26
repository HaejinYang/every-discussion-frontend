import { defineStore } from 'pinia';

export const useSearchOpinionStore = defineStore('search-opinion-store', {
  state: () => {
    return {
      filterKeyword: ''
    };
  },
  actions: {
    set(filterKeyWord: string) {
      this.filterKeyword = filterKeyWord;
    }
  }
});
