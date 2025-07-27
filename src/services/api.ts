import type {
  Message,
  CreateMessagePayload,
  GetMessagesParams,
} from '../types/message';

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
    Authorization: `Bearer ${AUTH_TOKEN}`,
  };

  private decodeHtmlEntities(text: string): string {
    const htmlEntities: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x27;': "'",
      '&#x2F;': '/',
      '&#x60;': '`',
      '&#x3D;': '=',
    };

    return text.replace(
      /&amp;|&lt;|&gt;|&quot;|&#39;|&#x27;|&#x2F;|&#x60;|&#x3D;/g,
      (match) => htmlEntities[match] || match
    );
  }

  private decodeMessage(message: Message): Message {
    return {
      ...message,
      message: this.decodeHtmlEntities(message.message),
      author: this.decodeHtmlEntities(message.author),
    };
  }

  async getMessages({ after, before, limit }: GetMessagesParams = {}): Promise<
    Message[]
  > {
    const queryParams = new URLSearchParams();

    if (after) queryParams.append('after', after);
    if (before) queryParams.append('before', before);
    if (limit) queryParams.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/messages?${queryParams}`, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }

    const messages: Message[] = await response.json();
    const decodedMessages = messages.map((message) => this.decodeMessage(message));
    
    // Sort array (API returns newest first, we want oldest first)
    return decodedMessages.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  async createMessage({
    message,
    author,
  }: CreateMessagePayload): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ message, author }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create message: ${response.statusText}`);
    }

    const createdMessage: Message = await response.json();
    return this.decodeMessage(createdMessage);
  }
}

export const apiService = new ApiService();
