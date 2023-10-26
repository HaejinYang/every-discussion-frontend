import { defineStore } from 'pinia';

export const useUniqueIdStore = defineStore('unique-id-store', {
  state: () => {
    return { id: 1 };
  },
  actions: {
    getId() {
      this.id++;
      return this.id;
    }
  }
});
