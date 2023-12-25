import { fetchApi } from '@/util/network';
import throwErrorWhenResponseNotOk from '@/util/error/NetworkError';
import { plainToInstance } from 'class-transformer';
import { useAuthStore } from '@/stores/AuthStore';
import { UserItem } from '@/services/users';

class AuthService {
  async login(loginParam: { email: string; password: string; isKeepLoggedIn: boolean }) {
    const URI = '/api/auth/login';
    const response = await fetchApi(URI, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginParam)
    });

    throwErrorWhenResponseNotOk(response, true);

    const result = await response.json();
    const user: UserItem = plainToInstance(UserItem, result.data);

    const authStore = useAuthStore();
    authStore.login(user, loginParam.isKeepLoggedIn);

    return user;
  }

  async logout() {
    const authStore = useAuthStore();
    const URI = '/api/auth/logout';
    const response = await fetchApi(URI, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${authStore.authInfo.user.token}`
      }
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const user: UserItem = plainToInstance(UserItem, result.data);

    return user;
  }

  async sendEmailForTransferingToken(email: string) {
    const URI = `/api/auth/password/token?email=${email}`;
    const response = await fetchApi(URI, {
      method: 'GET',
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);
  }

  async sendTokenForChangePassword(email: string, token: string) {
    const URI = '/api/auth/password/token';
    const response = await fetchApi(URI, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, token })
    });

    throwErrorWhenResponseNotOk(response);
  }

  async changePassword(changeParam: {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
  }) {
    const URI = '/api/auth/password';
    const response = await fetchApi(URI, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(changeParam)
    });

    throwErrorWhenResponseNotOk(response);
  }

  async sendAuthEmail(email: string) {
    const URI = `/api/auth/email`;
    const response = await fetchApi(URI, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email})
    });

    throwErrorWhenResponseNotOk(response);
  }
}

export { AuthService };
