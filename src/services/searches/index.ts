import { plainToInstance } from 'class-transformer';
import { fetchApi } from '@/util/network';
import { throwErrorWhenResponseNotOk } from '@/util/error';
import { TopTopicsItem } from '@/services/topics/TopTopics';

const searchTopics = async (keyword: string): Promise<TopTopicsItem> => {
  const response = await fetchApi(`/api/topics?keyword=${keyword}`, {
    method: 'GET',
    credentials: 'include'
  });

  throwErrorWhenResponseNotOk(response);

  const result = await response.json();
  const topics = plainToInstance(TopTopicsItem, result.data);
  return topics;
};

export { searchTopics };
