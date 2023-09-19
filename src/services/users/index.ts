import { fetchApi, objectToQueryString } from '@/util/network';
import 'reflect-metadata';
import { Expose, plainToInstance } from 'class-transformer';
import { throwErrorWhenResponseNotOk } from '@/util/error';
import { useAuthHandler } from '@/stores/auth';

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

class User {
  public static async create(registerInfo: UserRegisterParam) {
    const URI = '/api/auth/register';
    const response = await fetchApi(URI, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerInfo)
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const user: UserItem = plainToInstance(UserItem, result.data);

    return user;
  }

  public static async isDuplicated(userInfo: CheckDuplicatedUserParam) {
    let URI = '/api/auth/check-duplicated';
    const queryString = objectToQueryString(userInfo);
    URI += '?' + queryString;
    const response = await fetchApi(URI, {
      method: 'GET',
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);

    return true;
  }

  public static async login(email: string, password: string) {
    const URI = '/api/auth/login';
    const response = await fetchApi(URI, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const user: UserItem = plainToInstance(UserItem, result.data);

    const authHandler = useAuthHandler();
    authHandler.login(user);

    return user;
  }
}

export { User, UserItem };
