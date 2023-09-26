import { defineStore } from 'pinia';

export const useDiscussionHandler = defineStore('discussion', {
  state: () => {
    return { isFoldOpinionList: false };
  },
  actions: {
    foldList() {
      this.isFoldOpinionList = true;
    },
    spreadList() {
      this.isFoldOpinionList = false;
    }
  }
});
