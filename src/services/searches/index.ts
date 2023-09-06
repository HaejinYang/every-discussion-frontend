import { plainToInstance } from 'class-transformer';
import fetchApi from '@/util/network';
import { throwErrorWhenResponseNotOk } from '@/util/error';
import { TopTopics } from '@/services/topics';

const searchTopics = async (keyword: string): Promise<TopTopics> => {
  const response = await fetchApi(`/api/topics?keyword=${keyword}`, {
    method: 'GET',
    credentials: 'include'
  });

  throwErrorWhenResponseNotOk(response);

  const result = await response.json();
  const topics = plainToInstance(TopTopics, result.data);
  return topics;
};

export { searchTopics };
