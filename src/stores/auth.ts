import { defineStore } from 'pinia';
import type { UserItem } from '@/services/users';

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
    accept(info: UserItem) {
      this.isAuth = true;
      this.info = info;
    }
  }
});
