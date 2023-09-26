import { defineStore } from 'pinia';

export const useSearchOpinionHandler = defineStore('search-opinion', {
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
