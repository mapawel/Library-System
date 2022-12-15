import { Book } from '../Book/Book';
import { LibraryItem } from './LibraryItemType';
import { User } from '../Users/User';

export interface ILibrary {
  addBook(book: Book): LibraryItem | void;
  connectBookWhUser(bookUuid: string, user: User | null): boolean | void;
  getItemById(uuid: string): LibraryItem | undefined;
  removeBookById(uuid: string): LibraryItem | void;
}
