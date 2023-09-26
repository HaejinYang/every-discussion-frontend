import { defineStore } from 'pinia';

export const useDiscussionHandler = defineStore('discussion', {
  state: () => {
    return { isFoldOpinionList: false, selectedOpinionId: -1 };
  },
  actions: {
    foldList() {
      this.isFoldOpinionList = true;
    },
    spreadList() {
      this.isFoldOpinionList = false;
    },
    displayOpinionDetailly(opinionId: number) {
      this.foldList();
      this.selectedOpinionId = opinionId;
    },
    hideOpinionDetaily() {
      this.spreadList();
      this.selectedOpinionId = -1;
    }
  }
});
