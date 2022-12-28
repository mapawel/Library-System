import { Book } from '../Book/Book.class';
import { LibraryItem } from './LibraryItem.type';
import { User } from '../Users/User.class';

export interface ILibrary {
  addBook(book: Book): LibraryItem | void;
  connectBookWhUser(bookUuid: string, user: User | null): boolean | void;
  getItemById(uuid: string): LibraryItem | undefined;
  removeBookById(uuid: string): LibraryItem | void;
}
