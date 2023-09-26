import { defineStore } from 'pinia';

export const useDiscussionHandler = defineStore('discussion', {
  state: () => {
    return { isFoldOpinionList: true };
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
