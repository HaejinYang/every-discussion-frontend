import { Expose, plainToInstance, Type } from 'class-transformer';
import { TopicItem } from '@/services/topics/index';
import { fetchApi } from '@/util/network';
import throwErrorWhenResponseNotOk from '@/util/error/NetworkError';

class TopTopicsItem {
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

  @Type(() => TopicItem)
  @Expose({ name: 'data' })
  data: TopicItem[];
}

class SearchTopicsItem extends TopTopicsItem {}

class TopTopicsService {
  async fetch() {
    const response = await fetchApi('/api/topics', {
      method: 'GET',
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const topics: TopTopicsItem = plainToInstance(TopTopicsItem, result.data);
    return topics;
  }

  async fetchNext(pageUrlFromServer: string) {
    const response = await fetch(pageUrlFromServer, {
      method: 'GET',
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const topics: TopTopicsItem = plainToInstance(TopTopicsItem, result.data);
    return topics;
  }
}

export { TopTopicsItem, TopTopicsService, SearchTopicsItem };
