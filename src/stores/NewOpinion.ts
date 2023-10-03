import { defineStore } from 'pinia';
import type { OpinionData } from '@/services/opinions';

export const useNewOpinionHandler = defineStore('new-opinion', {
  state: () => {
    return { isAdded: false, topicId: -1, item: null as OpinionData | null };
  },
  actions: {
    addOpinion(topicId: number, opinion: OpinionData) {
      this.topicId = topicId;
      this.item = opinion;
      this.isAdded = true;
    },
    consume() {
      this.isAdded = false;
    }
  }
});
