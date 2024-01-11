import { plainToInstance } from 'class-transformer';
import { fetchApi } from '@/util/network';
import throwErrorWhenResponseNotOk from '@/util/error/NetworkError';
import { TopTopicsItem } from "@/services/topics/TopTopicsService";

class UserTopicsService {
    async fetch(userId: number, keyword?: string) {
        let URL = `/api/users/${userId}/topics`;
        if(keyword) {
            URL += `?keyword=${keyword}`;
        }

        const response = await fetchApi(URL, {
            method: 'GET',
            credentials: 'include'
        });

        throwErrorWhenResponseNotOk(response);

        const result = await response.json();
        const topics: TopTopicsItem = plainToInstance(TopTopicsItem, result.data);
        return topics;
    }

    async fetchNext(pageUrlFromServer: string, keyword?: string) {
        let nextUrl = pageUrlFromServer;
        if(keyword) {
            nextUrl += `&keyword=${keyword}`;
        }

        const response = await fetch(nextUrl, {
            method: 'GET',
            credentials: 'include'
        });

        throwErrorWhenResponseNotOk(response);

        const result = await response.json();
        const topics: TopTopicsItem = plainToInstance(TopTopicsItem, result.data);
        return topics;
    }
}

export { UserTopicsService };
