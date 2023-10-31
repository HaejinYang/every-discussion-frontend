import { fetchApi } from '@/util/network';
import { throwErrorWhenResponseNotOk } from '@/util/error';
import { plainToInstance } from 'class-transformer';
import { LinkedOpinion, OpinionData } from '@/services/opinions/index';

class OpinionService {
  async fetch(opinionId: number) {
    const response = await fetchApi(`/api/opinions/${opinionId}`, {
      method: 'GET',
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const opinion: LinkedOpinion = plainToInstance(LinkedOpinion, result.data);

    opinion.referTo = plainToInstance(OpinionData, opinion.referTo);

    return opinion;
  }

  async fetchAllInTopic(topicId: number, keyword = '') {
    let URI = `/api/topics/${topicId}/opinions`;
    if (keyword.length > 0) {
      URI += `?keyword=${keyword}`;
    }

    const response = await fetchApi(URI, {
      method: 'GET',
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);

    const result = await response.json();
    const opinions: OpinionData[] = plainToInstance(OpinionData, <any[]>result.data);
    return opinions;
  }
}

export { OpinionService };
