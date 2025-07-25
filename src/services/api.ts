import type { Message, CreateMessagePayload, GetMessagesParams } from '../types/message';

const API_BASE_URL = 'http://localhost:3000/api/v1';
const AUTH_TOKEN = 'doodle';

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