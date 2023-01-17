import { User } from '../Users/User/User.class'
import { Book } from '../Books/Book/Book.class'

export type ExceptionPayload = {
  uuid?: string;
  book?: Book;
  user?: User | null;
};
export type BookParams = {
  title: string;
  author: string;
  year: number;
  publisher: string;
};

export type BookStoreItem = {
  book: Book;
  user: User | null;
};