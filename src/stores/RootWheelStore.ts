import { defineStore } from 'pinia';

export const useRootWheelStore = defineStore('root-wheel-store', {
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
