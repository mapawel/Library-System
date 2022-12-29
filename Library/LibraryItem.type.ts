import { Book } from 'Library/Book/Book.class';
import { User } from '../Users/User.class';

export type LibraryItem = {
  book: Book;
  user: User | null;
};
