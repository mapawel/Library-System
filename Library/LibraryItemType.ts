import { Book } from 'Book/Book';
import { User } from '../Users/User';

export type LibraryItem = {
  book: Book;
  user: User | null;
};
