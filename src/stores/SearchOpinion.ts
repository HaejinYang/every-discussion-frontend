import { defineStore } from 'pinia';
import type { Opinion } from '@/services/opinions';

export const useSearchOpinionHandler = defineStore('search-opinion', {
  state: () => {
    return {
      isDisplayingSearchedOpinions: false,
      opinions: [] as Opinion[],
      topicId: -1
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
    },
    selectTopic(topicId: number) {
      this.topicId = topicId;
    }
  }
});
