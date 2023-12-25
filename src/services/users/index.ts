import { fetchApi, objectToQueryString } from '@/util/network';
import 'reflect-metadata';
import { Expose, plainToInstance } from 'class-transformer';
import throwErrorWhenResponseNotOk from '@/util/error/NetworkError';
import { useAuthStore } from '@/stores/AuthStore';

class UserItem {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  token: string;

  @Expose()
  role: number;

  @Expose()
  topicsCount: number;

  @Expose()
  opinionsCount: number;
}

interface UserRegisterParam {
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
}

interface CheckDuplicatedUserParam {
  email?: string;
  name?: string;
}

interface UserChangeParam {
  name: string;
  password: string;
  password_confirmation: string;
}

class UserService {
  async create(registerParam: UserRegisterParam) {
    const URI = '/api/auth/register';
    const response = await fetchApi(URI, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerParam)
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const user: UserItem = plainToInstance(UserItem, result.data);

    return user;
  }

  async update(updates: Partial<UserChangeParam>) {
    const authStore = useAuthStore();

    const URI = '/api/users';
    const response = await fetchApi(URI, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${authStore.authInfo.user.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });

    throwErrorWhenResponseNotOk(response);

    if ('name' in updates) {
      authStore.update(updates);
    }
  }

  async find(name: string) {
    const URI = `/api/auth/email?name=${name}`;
    const response = await fetchApi(URI, {
      method: 'GET',
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    let email = '';
    if ('email' in result.data) {
      email = result.data.email;
    }

    return email;
  }

  async delete(password: string) {
    const authStore = useAuthStore();

    const URI = '/api/users';
    const response = await fetchApi(URI, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${authStore.authInfo.user.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });

    throwErrorWhenResponseNotOk(response);
  }

  async isDuplicated(userInfo: CheckDuplicatedUserParam) {
    let URI = '/api/auth/duplicated';
    const queryString = objectToQueryString(userInfo);
    URI += '?' + queryString;
    const response = await fetchApi(URI, {
      method: 'GET',
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);

    return true;
  }
}

export { UserService, UserItem };
