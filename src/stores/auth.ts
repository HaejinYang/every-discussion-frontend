import { defineStore } from 'pinia';
import { User, type UserItem } from '@/services/users';

export const useAuthHandler = defineStore('auth-handler', {
  state: () => {
    return {
      isAuth: false,
      info: {
        id: -1,
        email: '',
        token: '',
        role: -1
      } as UserItem
    };
  },
  actions: {
    login(info: UserItem) {
      this.isAuth = true;
      this.info = info;

      console.log('login', info);
    },
    logout() {
      this.isAuth = false;
      User.logout().then((user: UserItem) => {
        console.log('logout', user);
      });
    },
    delete() {
      this.isAuth = false;
    }
  }
});
