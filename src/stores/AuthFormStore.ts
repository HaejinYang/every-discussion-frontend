import { defineStore } from 'pinia';

enum eAuthForm {
  Login = 0,
  Register = 1,
  FindAccount = 2,
  FindPassword = 3
}

const useAuthFromStore = defineStore('auth-form-store', {
  state: () => {
    return { isShow: false, selectedAuthForm: eAuthForm.Login as eAuthForm };
  },
  actions: {
    hide() {
      this.isShow = false;
    },
    show(form: eAuthForm) {
      this.isShow = true;
      this.selectedAuthForm = form;
    }
  }
});

export { useAuthFromStore, eAuthForm };
