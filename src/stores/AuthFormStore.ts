import { defineStore } from 'pinia';

enum eAuthForm {
  Login = 0,
  Register = 1,
  FindAccount = 2,
  FindPassword = 3,
  NotSelected = 999
}

const useAuthFormStore = defineStore('auth-form-store', {
  state: () => {
    return { selectedAuthForm: eAuthForm.NotSelected as eAuthForm };
  },
  actions: {
    hide() {
      this.selectedAuthForm = eAuthForm.NotSelected;
    },
    show(form: eAuthForm) {
      this.selectedAuthForm = form;
    }
  }
});

export { useAuthFormStore, eAuthForm };
