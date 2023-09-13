import { defineStore } from 'pinia';
import type { OpinionData } from '@/services/opinions';

export const useSearchOpinionHandler = defineStore('search-opinion', {
  state: () => {
    return {
      isDisplayingSearchedOpinions: false,
      opinions: [] as OpinionData[],
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
    replaceOpinions(opinions: OpinionData[]) {
      this.opinions = opinions;
    },
    selectTopic(topicId: number) {
      this.topicId = topicId;
    }
  }
});
