import { defineStore } from 'pinia';
import { type UserItem } from '@/services/users';
import { AuthService } from '@/services/auth';

export const useAuthStore = defineStore('auth-store', {
  state: () => {
    return {
      isAuth: false,
      user: {
        id: -1,
        email: '',
        token: '',
        role: -1
      } as UserItem
    };
  },
  actions: {
    login(user: UserItem) {
      this.isAuth = true;
      this.user = user;

      console.log('login', user);
    },
    logout() {
      this.isAuth = false;
      const auth = new AuthService();
      auth.logout().then((user: UserItem) => {
        console.log('logout', user);
      });
    },
    delete() {
      this.isAuth = false;
    },
    update(updates: Partial<UserItem>) {
      this.user = {
        ...this.user,
        ...updates
      };
    }
  }
});
