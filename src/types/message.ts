export interface Message {
  _id: string;
  message: string;
  author: string;
  createdAt: string;
}

export interface CreateMessagePayload {
  message: string;
  author: string;
}

export type GetMessagesParams = {
  limit?: number;
} & (
  | { after?: string; before?: never }
  | { after?: never; before?: string }
  | { after?: never; before?: never }
);

export interface ApiError {
  error: string;
  details?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}