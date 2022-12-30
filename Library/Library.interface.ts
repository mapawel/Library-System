import { Book } from './Book/Book.class';
import { LibraryItem } from './LibraryItem.type';
import { User } from '../Users/User.class';

export interface ILibrary {
  addBook(book: Book): LibraryItem;
  connectBookWhUser(bookUuid: string, user: User | null): boolean;
  getItemById(uuid: string): LibraryItem;
  removeItemById(uuid: string): LibraryItem;
}
