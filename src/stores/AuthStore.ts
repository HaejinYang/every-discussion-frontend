import { defineStore } from 'pinia';
import { type UserItem } from '@/services/users';
import { AuthService } from '@/services/auth';

type useAuthStoreState = {
  isAuth: boolean;
  isKeepLoggedIn: boolean;
  user: UserItem;
};

export const useAuthStore = defineStore('auth-store', {
  state: () => {
    return {
      isAuth: false,
      isKeepLoggedIn: false,
      user: {
        id: -1,
        email: '',
        token: '',
        role: -1
      }
    } as useAuthStoreState;
  },
  actions: {
    initialize() {
      const store = localStorage.getItem('keepLoggedIn');
      if (store) {
        const authInfo = JSON.parse(store) as useAuthStoreState;
        if (authInfo.isKeepLoggedIn) {
          this.isAuth = true;
          this.user = authInfo.user;
        }
      } else {
        localStorage.setItem('keepLoggedIn', JSON.stringify(this.$state));
      }
    },
    login(user: UserItem, isKeepLoggedIn = false) {
      this.isAuth = true;
      this.isKeepLoggedIn = isKeepLoggedIn;
      this.user = user;

      if (this.isKeepLoggedIn) {
        localStorage.setItem('keepLoggedIn', JSON.stringify(this.$state));
      }
    },
    logout() {
      this.isAuth = false;
      this.isKeepLoggedIn = false;
      const auth = new AuthService();
      auth.logout().then((user: UserItem) => {
        localStorage.setItem('keepLoggedIn', JSON.stringify(this.$state));
      });
    },
    delete() {
      this.isAuth = false;
      this.isKeepLoggedIn = false;
    },
    update(updates: Partial<UserItem>) {
      this.user = {
        ...this.user,
        ...updates
      };

      localStorage.setItem('keepLoggedIn', JSON.stringify(this.$state));
    }
  }
});
