import { Expose, plainToInstance, Type } from 'class-transformer';
import { Topic } from '@/services/topics/index';
import fetchApi from '@/util/network';
import { throwErrorWhenResponseNotOk } from '@/util/error';

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

export { type TopTopics, TopTopicsApi };
