import { defineStore } from 'pinia';

export const useMainWheelHandler = defineStore('main-wheel', {
  state: () => {
    return { isDisabled: false };
  },
  actions: {
    disableWheel() {
      this.isDisabled = true;
    },
    enableWheel() {
      this.isDisabled = false;
    }
  }
});
