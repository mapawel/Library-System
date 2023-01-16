import { Book } from '../Book/Book.class'
import { BookStoreItem } from './BookStoreItem.type';
import { User } from '../../Users/User/User.class'

export interface IBookStore {
  addBook(book: Book): BookStoreItem;
  connectOrDisconnectBook(bookUuid: string, user: User | null): boolean;
  getItemById(uuid: string): BookStoreItem;
  removeItemById(uuid: string): BookStoreItem;
}
