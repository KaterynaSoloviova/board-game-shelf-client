import { BASE_URL } from '../config';

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('authToken');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  return fetch(`${BASE_URL}${endpoint}`, config);
};

export const handleApiError = (response: Response): Promise<never> => {
  return response.json().then((errorData) => {
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  });
};
