import { defineStore } from 'pinia';

const useMainScrollStore = defineStore('main-scroll-store', {
  state: () => {
    return {
      scrollHeight: 0,
      scrollTop: 0,
      clientHeight: 0,
      isEnd: false
    };
  },
  actions: {
    move(scrollHeight: number, scrollTop: number, clientHeight: number) {
      this.scrollHeight = scrollHeight;
      this.scrollTop = scrollTop;
      this.clientHeight = clientHeight;
      this.isEnd = !(this.scrollHeight - 10 >= this.scrollTop + this.clientHeight);
    }
  }
});

export { useMainScrollStore };
