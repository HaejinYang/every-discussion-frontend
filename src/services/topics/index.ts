import type { Opinion } from '@/services/opinions';
import fetchApi from '@/util/network';
import { throwErrorWhenResponseNotOk } from '@/util/error';
import 'reflect-metadata';
import { Expose, plainToInstance, Type } from 'class-transformer';

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

class TopTopics {
  @Expose({ name: 'current_page' })
  currentPage: number;

  @Expose({ name: 'per_page' })
  perPage: number;

  @Expose({ name: 'first_page_url' })
  firstPageUrl: string;

  @Expose({ name: 'next_page_url' })
  nextPageUrl: string;

  @Expose({ name: 'prev_page_url' })
  prevPageUrl: string;

  @Expose({ name: 'from' })
  from: number;

  @Expose({ name: 'to' })
  to: number;

  @Expose({ name: 'path' })
  path: string;

  @Type(() => Topic)
  @Expose({ name: 'data' })
  data: Topic[];
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

class TopTopicsApi {
  public static async fetch() {
    const response = await fetchApi('/api/topics', {
      method: 'GET',
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const topics: TopTopics = plainToInstance(TopTopics, result.data);
    return topics;
  }

  public static async fetchNext(pageUrlFromServer: string) {
    const response = await fetch(pageUrlFromServer, {
      method: 'GET',
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const topics: TopTopics = plainToInstance(TopTopics, result.data);
    return topics;
  }
}

export { type Topic, type TopicWithOpinions, type TopTopics, TopicApi, TopTopicsApi };
