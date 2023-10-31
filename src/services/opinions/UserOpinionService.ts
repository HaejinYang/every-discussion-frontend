import { type AgreeingType, LinkedOpinion, OpinionData } from '@/services/opinions/index';
import { fetchApi } from '@/util/network';
import { throwErrorWhenResponseNotOk } from '@/util/error';
import { plainToInstance } from 'class-transformer';
import { useAuthStore } from '@/stores/AuthStore';

interface RegisterOpinionParam {
  topicId: number;
  title: string;
  content: string;
  agreeingType: AgreeingType;
  addTo?: number;
}

interface UpdateOpinionParam {
  id: number;
  title: string;
  content: string;
}

class UserOpinionService {
  public async fetchAllInTopic(topicId: number) {
    const authStore = useAuthStore();
    const response = await fetchApi(`/api/users/${authStore.user.id}/topics/${topicId}/opinions`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${authStore.user.token}`
      }
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const opinions: LinkedOpinion[] = plainToInstance(LinkedOpinion, <any[]>result.data);

    return opinions;
  }

  public async create(opinion: RegisterOpinionParam) {
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

  public async update(opinion: UpdateOpinionParam) {
    const authStore = useAuthStore();
    const response = await fetchApi(`/api/opinions/${opinion.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.user.token}`
      },
      credentials: 'include',
      body: JSON.stringify({ title: opinion.title, content: opinion.content })
    });

    throwErrorWhenResponseNotOk(response);
    const result = await response.json();
    const updated = plainToInstance(OpinionData, result.data);

    return updated;
  }

  public async delete(opinionId: number) {
    const authStore = useAuthStore();
    const response = await fetchApi(`/api/opinions/${opinionId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authStore.user.token}`
      },
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);
  }
}

export { UserOpinionService, type RegisterOpinionParam, type UpdateOpinionParam };
