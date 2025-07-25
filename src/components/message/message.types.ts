import type { Message } from '../../types/message';

export interface MessageProps {
  message: Message;
  isOwn: boolean;
}