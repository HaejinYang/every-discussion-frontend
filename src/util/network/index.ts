/**
 *
 * @param input - "/api/topics..." 같은 URL
 * @param init - fetch api에 필요한 옵션
 */
const fetchApi = (input: RequestInfo, init?: RequestInit) => {
  const apiUrl = `${import.meta.env.VITE_API_BASE_URL}${input}`;
  return fetch(apiUrl, init);
};

export default fetchApi;
