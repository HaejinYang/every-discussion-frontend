/**
 *
 * @param input - "/api/topics..." 같은 URL
 * @param init - fetch api에 필요한 옵션
 */

const domain = import.meta.env.VITE_API_BASE_URL;

const fetchApi = (path: RequestInfo, init?: RequestInit) => {
  return fetch(`${domain}${path}`, init);
};

export default fetchApi;
