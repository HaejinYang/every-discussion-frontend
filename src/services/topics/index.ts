import type { Opinion } from '@/services/opinions';
import fetchApi from '@/util/network';
import { throwErrorWhenResponseNotOk } from '@/util/error';
import 'reflect-metadata';
import { Expose, plainToInstance } from 'class-transformer';

class Topic {
  @Expose()
  id: number;

  @Expose()
  title: string;

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
  topic: Topic;
  opinions: Opinion[];
}

class TopicApi {
  public static async fetch(topicId: number) {
    const response = await fetchApi(`/api/topics/${topicId}`, {
      method: 'GET',
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const topic: Topic = plainToInstance(Topic, result.data);
    return topic;
  }
}

export { type Topic, type TopicWithOpinions, TopicApi };
