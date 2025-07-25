import type { Message, CreateMessagePayload, GetMessagesParams } from '../types/message';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined in environment variables');
}

if (!AUTH_TOKEN) {
  throw new Error('VITE_AUTH_TOKEN is not defined in environment variables');
}

class ApiService {
  private headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AUTH_TOKEN}`
  };

  async getMessages({ after, before, limit }: GetMessagesParams = {}): Promise<Message[]> {
    const queryParams = new URLSearchParams();
    
    if (after) queryParams.append('after', after);
    if (before) queryParams.append('before', before);
    if (limit) queryParams.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/messages?${queryParams}`, {
      method: 'GET',
      headers: this.headers
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }

    return response.json();
  }

  async createMessage({ message, author }: CreateMessagePayload): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ message, author })
    });

    if (!response.ok) {
      throw new Error(`Failed to create message: ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiService = new ApiService();