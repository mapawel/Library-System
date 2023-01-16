import { BookStoreItem } from '../Books/Book-store/BookStoreItem.type';
import { User } from '../Users/User/User.class';

export type ExceptionPayload = {
  user: User;
  bookStoreItem: BookStoreItem;
};
