import { defineStore } from 'pinia';
import { User, type UserItem } from '@/services/users';

export const useAuthHandler = defineStore('auth-handler', {
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
      User.logout().then((user: UserItem) => {
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
