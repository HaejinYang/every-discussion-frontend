import { defineStore } from 'pinia';

enum eAuthForm {
  Login = 0,
  Register = 1,
  FindAccount = 2,
  FindPassword = 3
}

const useAuthFormStore = defineStore('auth-form-store', {
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
    },
    isShowLogin() {
      return this.isShow && this.selectedAuthForm === eAuthForm.Login;
    },
    isShowRegister() {
      return this.isShow && this.selectedAuthForm === eAuthForm.Register;
    },
    isShowFindAccount() {
      return this.isShow && this.selectedAuthForm === eAuthForm.FindAccount;
    },
    isShowFindPassword() {
      return this.isShow && this.selectedAuthForm === eAuthForm.FindPassword;
    }
  }
});

export { useAuthFormStore, eAuthForm };
