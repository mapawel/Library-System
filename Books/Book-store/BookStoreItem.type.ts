import { Book } from 'Books/Book/Book.class';
import { User } from '../../Users/User/User.class';

export type BookStoreItem = {
  book: Book;
  user: User | null;
};
