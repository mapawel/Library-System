import { BookStoreItem } from 'Books/Books.types';
import { User } from '../Users/User/User.class';

export type ExceptionPayload = {
  user: User;
  bookStoreItem: BookStoreItem;
};
