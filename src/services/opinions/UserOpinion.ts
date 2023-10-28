import { fetchApi } from '@/util/network';
import { throwErrorWhenResponseNotOk } from '@/util/error';
import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import {
  type AgreeingType,
  OpinionData,
  OpinionWithReferenceItem
} from '@/services/opinions/index';

interface RegisterOpinion {
  topicId: number;
  title: string;
  content: string;
  agreeingType: AgreeingType;
}

class UserOpinion {
  private userId: number;
  private token: string;

  constructor(userId: number, token: string) {
    this.userId = userId;
    this.token = token;
  }

  public async fetch(topicId: number) {
    const response = await fetchApi(`/api/users/${this.userId}/topics/${topicId}/opinions`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${this.token}`
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

  public async create(opinion: RegisterOpinion) {
    const response = await fetchApi('/api/opinions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`
      },
      credentials: 'include',
      body: JSON.stringify(opinion)
    });

    throwErrorWhenResponseNotOk(response);
    const result = await response.json();
    const created = plainToInstance(OpinionData, result.data);

    return created;
  }

  public async delete(opinionId: number) {
    const response = await fetchApi(`/api/opinions/${opinionId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      credentials: 'include'
    });

    throwErrorWhenResponseNotOk(response);
  }
}

export { UserOpinion };
