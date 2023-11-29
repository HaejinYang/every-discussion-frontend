import { defineStore } from 'pinia';
import { type UserItem } from '@/services/users';
import { AuthService } from '@/services/auth';
import { useStorage } from '@vueuse/core';

export const useAuthStore = defineStore('auth-store', {
  state: () => {
    return {
      authInfo: useStorage(
        'user',
        {
          isAuth: false,
          isKeepLoggedIn: false,
          user: {
            id: -1,
            email: '',
            token: '',
            role: -1,
            name: '',
            topicsCount: 0,
            opinionsCount: 0
          }
        },
        localStorage
      )
    };
  },
  actions: {
    login(user: UserItem, isKeepLoggedIn = false) {
      this.authInfo.isAuth = true;
      this.authInfo.isKeepLoggedIn = isKeepLoggedIn;
      this.authInfo.user = user;
    },
    logout() {
      this.authInfo.isAuth = false;
      this.authInfo.isKeepLoggedIn = false;
      const auth = new AuthService();
      auth.logout();
    },
    update(updates: Partial<UserItem>) {
      this.authInfo.user = {
        ...this.authInfo.user,
        ...updates
      };
    },
    invalidate() {
      this.authInfo.isAuth = false;
      this.authInfo.isKeepLoggedIn = false;
      this.authInfo.user = {
        id: -1,
        email: '',
        token: '',
        role: -1,
        name: '',
        topicsCount: 0,
        opinionsCount: 0
      };
    }
  }
});
