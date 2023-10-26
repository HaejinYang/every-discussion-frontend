import type { OpinionData } from '@/services/opinions';
import { fetchApi } from '@/util/network';
import { throwErrorWhenResponseNotOk } from '@/util/error';
import 'reflect-metadata';
import { Expose, plainToInstance } from 'class-transformer';
import { useAuthStore } from '@/stores/AuthStore';
import { SearchTopicsItem } from '@/services/topics/TopTopics';

class TopicItem {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose({ name: 'user_id' })
  hostId: number;

  @Expose({ name: 'opinions_count' })
  opinionsCount: number;

  @Expose({ name: 'participants_count' })
  participantsCount: number;

  @Expose()
  host: string;

  @Expose({ name: 'created_at' })
  createdAt: string;

  @Expose({ name: 'updated_at' })
  updatedAt: string;
}

interface TopicWithOpinions {
  topic: TopicItem;
  opinions: OpinionData[];
}

class Topic {
  public static async fetch(topicId: number) {
    const response = await fetchApi(`/api/topics/${topicId}`, {
      method: 'GET',
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const topic: TopicItem = plainToInstance(TopicItem, result.data);
    return topic;
  }

  public static async fetchByUser(userId: number) {
    const URI = `/api/users/${userId}/topics`;
    const response = await fetchApi(URI, {
      method: 'GET',
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const topics = plainToInstance(TopicItem, <any[]>result.data);

    return topics;
  }

  public static async create(title: string, description: string) {
    const authStore = useAuthStore();
    const URI = `/api/topics`;
    const response = await fetchApi(URI, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.user.token}`
      },
      body: JSON.stringify({ title, description })
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const topic: TopicItem = plainToInstance(TopicItem, result.data);
    return topic;
  }

  public static async search(title: string) {
    const URI = `/api/topics?keyword=${title}`;
    const response = await fetchApi(URI, {
      method: 'GET',
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const topics = plainToInstance(SearchTopicsItem, result.data);
    return topics;
  }
}

export { TopicItem, type TopicWithOpinions, Topic };
