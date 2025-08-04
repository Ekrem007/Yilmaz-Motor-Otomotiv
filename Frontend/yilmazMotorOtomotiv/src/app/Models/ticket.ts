import { UserDto } from "./userDto";

export interface TicketDto {
  id: number;
  subject: string;
  message: string;
  createdAt: Date;
  userId: number;
  status: TicketStatus;
  user?: UserDto;
  replies?: TicketReplyDto[];
}

export interface TicketReplyDto {
  id: number;
  ticketId: number;
  replyMessage: string;
  repliedAt: Date;
  userId: number;
  user?: UserDto;
}

export interface CreateTicketDto {
  subject: string;
  message: string;
  userId: number;
}

export interface CreateTicketReplyDto {
  ticketId: number;
  replyMessage: string;
  userId: number;
}

export enum TicketStatus {
  Open = 0,
  Answered = 1,
  Closed = 2
}
