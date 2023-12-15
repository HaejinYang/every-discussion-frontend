import { defineStore } from 'pinia';

export const useDiscussionStore = defineStore('discussion-store', {
  state: () => {
    return { isShowOpinionList: true, isShowOpinionGraph: false, isShowOpinionDetail: false, selectedOpinionId: -1, isShowOpinionWhenRedirect: false };
  },
  actions: {
    hideAll() {
      this.isShowOpinionList = false;
      this.isShowOpinionGraph = false;
      this.isShowOpinionDetail = false;
    },
    showOpinionList() {
      this.hideAll();
      this.isShowOpinionList = true;
    },
    showOpinionDetail(selectedOpinionId: number) {
      this.hideAll();
      this.isShowOpinionDetail = true;
      this.selectedOpinionId = selectedOpinionId;
    },
    showOpinionGraph() {
      this.hideAll();
      this.isShowOpinionGraph = true;
    },
    setOpinionIdWhenRedirect(opinionId: number) {
      this.isShowOpinionWhenRedirect = true;
      this.showOpinionDetail(opinionId);
    }
  }
});
