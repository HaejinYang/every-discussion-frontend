import { defineStore } from 'pinia';

export const useShowAuthFormHandler = defineStore('show-auth-form', {
  state: () => {
    return { isShowAuth: false, isShowLogin: true };
  },
  actions: {
    showAuth() {
      this.isShowAuth = true;
    },
    hideAuth() {
      this.isShowAuth = false;
    },
    showLogin() {
      this.isShowLogin = true;
    },
    hideLogin() {
      this.isShowLogin = false;
    }
  }
});
