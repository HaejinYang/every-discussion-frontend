import { fetchApi } from '@/util/network';
import { throwErrorWhenResponseNotOk } from '@/util/error';
import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { useAuthStore } from '@/stores/AuthStore';
import { type AgreeingType, OpinionData, OpinionWithReferenceItem } from '@/services/opinions';

interface RegisterOpinion {
  topicId: number;
  title: string;
  content: string;
  agreeingType: AgreeingType;
}

class UserOpinion {
  public static async fetch(topicId: number) {
    const authStore = useAuthStore();
    const userId = authStore.user.id;
    const response = await fetchApi(`/api/users/${userId}/topics/${topicId}/opinions`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${authStore.user.token}`
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
    const authStore = useAuthStore();
    const response = await fetchApi('/api/opinions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.user.token}`
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
