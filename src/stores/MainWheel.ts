import { defineStore } from 'pinia';

export const useMainWheelHandler = defineStore('main-wheel', {
  state: () => {
    return { top: 0, isDisabled: false };
  },
  actions: {
    changeTop(offset: number) {
      this.top = offset;
    },
    disableWheel() {
      this.isDisabled = true;
    },
    enableWheel() {
      this.isDisabled = false;
    }
  }
});
