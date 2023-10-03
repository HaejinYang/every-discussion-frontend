import { fetchApi } from '@/util/network';
import { throwErrorWhenResponseNotOk } from '@/util/error';
import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { useAuthHandler } from '@/stores/auth';
import { OpinionData, OpinionWithReferenceItem } from '@/services/opinions';

interface RegisterOpinion {
  topicId: number;
  title: string;
  content: string;
  agreeingType: AgreeingType;
}

class UserOpinion {
  public static async fetch(topicId: number) {
    const authHandler = useAuthHandler();
    const userId = authHandler.user.id;
    const response = await fetchApi(`/api/users/${userId}/topics/${topicId}/opinions`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${authHandler.user.token}`
      }
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const opinions: OpinionWithReferenceItem[] = plainToInstance(
      OpinionWithReferenceItem,
      <any[]>result.data
    );

    return opinions;
  }

  public static async create(opinion: RegisterOpinion) {
    const authHandler = useAuthHandler();
    const response = await fetchApi('/api/opinions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authHandler.user.token}`
      },
      credentials: 'include',
      body: JSON.stringify(opinion)
    });

    throwErrorWhenResponseNotOk(response);
    const result = await response.json();
    const created = plainToInstance(OpinionData, result.data);

    return created;
  }

  public static async update() {}
}

export { UserOpinion };
